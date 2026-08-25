// import "server-only";

import { db } from "@/db";
import { permissions, rolePermissions, roles } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  DatabaseError,
  InvalidRoleInputError,
  RoleNameAlreadyExistsError,
  RoleNotFoundError,
} from "./role-errors";

export type CreateRoleInput = typeof roles.$inferInsert

/**
 * 角色服务层 - 处理业务逻辑、数据访问和异常转换
 */
export const roleService = {
  /**
   * 创建新角色
   */
  async create(input: CreateRoleInput) {
    if (!input.name?.trim()) {
      throw new InvalidRoleInputError("name", "不能为空");
    }

    try {
      const existing = await db.query.roles.findFirst({
        where: { name: input.name },
      });

      if (existing) {
        throw new RoleNameAlreadyExistsError(input.name);
      }

      const [role] = await db.insert(roles).values(input).returning();
      return role;
    } catch (error) {
      if (error instanceof InvalidRoleInputError || error instanceof RoleNameAlreadyExistsError) {
        throw error;
      }
      throw new DatabaseError("创建角色", error);
    }
  },

  /**
   * 分页查询角色
   */
  async findPaginated(page: number = 1, pageSize: number = 10) {
    if (page < 1) {
      throw new InvalidRoleInputError("page", "必须大于 0");
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new InvalidRoleInputError("pageSize", "必须在 1-100 之间");
    }

    const offset = (page - 1) * pageSize;

    try {
      const [rolesResult, countResult] = await Promise.all([
        db
          .select()
          .from(roles)
          .limit(pageSize)
          .offset(offset)
          .orderBy(roles.createdAt),
        db.select({ count: count() }).from(roles),
      ]);

      const total = countResult[0].count;

      return {
        data: rolesResult,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new DatabaseError("分页查询角色", error);
    }
  },

  /**
   * 获取分页信息（总页数）
   */
  async getTotalPages(pageSize: number = 10) {
    if (pageSize < 1 || pageSize > 100) {
      throw new InvalidRoleInputError("pageSize", "必须在 1-100 之间");
    }

    try {
      const [countResult] = await db.select({ count: count() }).from(roles);
      const total = countResult.count;
      return {
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new DatabaseError("获取分页信息", error);
    }
  },
  /**
   * 根据 ID 获取角色详情（含父角色）
   */
  async findById(roleId: string) {
    try {
      const role = await db.query.roles.findFirst({
        where: { id: roleId },
        with: {
          parentRoles: true,
          permissions: true,
        },
      });
      return role;
    } catch (error) {
      throw new DatabaseError("查询角色详情", error);
    }
  },

  /**
   * 获取所有角色（用于下拉选择）
   */
  async findAll() {
    try {
      return await db.query.roles.findMany({
        orderBy: (roles, { asc }) => [asc(roles.name)],
      });
    } catch (error) {
      throw new DatabaseError("查询所有角色", error);
    }
  },

  async getRoleGraph(roleId: string) {
    const res = await db.query.roles.findFirst({
      where: { id: roleId },
      with: {
        parentRoles: true,
        childRoles: true,
      },
    });
    const nodes = [{ id: roleId, name: res?.name }];
    const edges: Array<{ target: string; source: string }> = [];

    for (const parent of res?.parentRoles ?? []) {
      edges.push({ source: roleId, target: parent.id });
      const { nodes: nextNodes, edges: nextEdges } = await this.getRoleGraph(
        parent.id,
      );
      nodes.push(...nextNodes);
      edges.push(...nextEdges);
    }
    return { nodes, edges };
  },
  /**
   * 获取所有权限（用于角色权限配置）
   */
  async findAllPermissions() {
    try {
      return await db.query.permissions.findMany({
        orderBy: (permissions, { asc }) => [
          asc(permissions.resource),
          asc(permissions.action),
        ],
      });
    } catch (error) {
      throw new DatabaseError("查询所有权限", error);
    }
  },

  /**
   * 给角色挂载权限（全量替换：先清除旧权限，再写入新权限）
   */
  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await db.query.roles.findFirst({ where: { id: roleId } });
    if (!role) {
      throw new RoleNotFoundError(roleId);
    }

    // 去重，避免同一权限重复挂载
    const uniquePermissionIds = [...new Set(permissionIds)];

    // 校验所有权限都存在
    if (uniquePermissionIds.length > 0) {
      const existingPermissions = await db.query.permissions.findMany({
        where: { id: { in: uniquePermissionIds } },
      });
      if (existingPermissions.length !== uniquePermissionIds.length) {
        throw new InvalidRoleInputError("permissionIds", "包含不存在的权限");
      }
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .delete(rolePermissions)
          .where(eq(rolePermissions.roleId, roleId));
        if (uniquePermissionIds.length > 0) {
          await tx.insert(rolePermissions).values(
            uniquePermissionIds.map((permissionId) => ({
              roleId,
              permissionId,
            })),
          );
        }
      });
    } catch (error) {
      throw new DatabaseError("分配权限", error);
    }
  },
};
