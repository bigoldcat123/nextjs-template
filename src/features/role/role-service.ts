// import "server-only";

import { db } from "@/db";
import { roles } from "@/db/schema";
import { count } from "drizzle-orm";
import { DatabaseError, InvalidRoleInputError } from "./role-errors";

/**
 * 角色服务层 - 处理业务逻辑、数据访问和异常转换
 */
export const roleService = {
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
};
