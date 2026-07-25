import "server-only";

import { db } from "@/db";
import { roles, userRoles, users } from "@/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import {
  AppError,
  DatabaseError,
  EmailAlreadyExistsError,
  InvalidUserInputError,
  UserNotFoundError,
  UsernameAlreadyExistsError,
  WrongPasswordError,
} from "./user-errors";
import { desc } from "drizzle-orm/pg-core/expressions";
/**
 * 创建用户输入类型
 */
export type CreateUserInput = typeof users.$inferInsert;

/**
 * 更新用户输入类型
 */
export type UpdateUserInput = Partial<
  Pick<
    typeof users.$inferSelect,
    "username" | "email" | "displayName" | "password"
  >
> &
  Pick<typeof users.$inferSelect, "id">;

/**
 * 用户服务层 - 处理业务逻辑、数据访问和异常转换
 * 直接使用 db 操作数据库，将外部错误转换为内部自定义错误
 */
export const userService = {
  /**
   * 创建新用户
   */
  async create(input: CreateUserInput) {
    // 输入验证
    if (!input.username?.trim()) {
      throw new InvalidUserInputError("username", "不能为空");
    }
    if (!input.password?.trim()) {
      throw new InvalidUserInputError("password", "不能为空");
    }

    try {
      // 检查用户名是否已存在
      const existingUsername = await db.query.users.findFirst({
        where: {
          username: input.username,
        },
      });

      if (existingUsername) {
        throw new UsernameAlreadyExistsError(input.username);
      }

      // 检查邮箱是否已存在
      if (input.email) {
        const existingEmail = await db.query.users.findFirst({
          where: {
            email: input.email,
          },
        });
        if (existingEmail) {
          throw new EmailAlreadyExistsError(input.email);
        }
      }
      const [user] = await db.insert(users).values(input).returning();
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new DatabaseError("创建用户", error);
    }
  },

  /**
   * 分页查询用户
   */
  async findPaginated(page: number = 1, pageSize: number = 10) {
    if (page < 1) {
      throw new InvalidUserInputError("page", "必须大于 0");
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new InvalidUserInputError("pageSize", "必须在 1-100 之间");
    }

    const offset = (page - 1) * pageSize;

    try {
      const [usersResult, countResult] = await Promise.all([
        db.query.users.findMany({
          with: { roles: true },
          limit: pageSize,
          offset,
          orderBy: (users, { asc }) => [desc(users.createdAt),asc(users.username)],
        }),
        db.select({ count: count() }).from(users),
      ]);

      const total = countResult[0].count;

      return {
        data: usersResult,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new DatabaseError("分页查询用户", error);
    }
  },

  /**
   * 更新用户
   */
  async update(input: UpdateUserInput) {
    // 先检查用户是否存在
    const existingUser = await findByIdOrThrow(input.id);

    // 检查用户名是否被其他用户使用
    if (input.username && input.username !== existingUser.username) {
      const existingUsername = await db.query.users.findFirst({
        where: { username: input.username },
      });
      if (existingUsername && existingUsername.id !== input.id) {
        throw new UsernameAlreadyExistsError(input.username);
      }
    }

    // 检查邮箱是否被其他用户使用
    if (input.email && input.email !== existingUser.email) {
      const existingEmail = await db.query.users.findFirst({
        where: { email: input.email },
      });
      if (existingEmail && existingEmail.id !== input.id) {
        throw new EmailAlreadyExistsError(input.email);
      }
    }
    if (input.password?.length == 0) {
      input.password = undefined;
    }
    try {
      const [user] = await db
        .update(users)
        .set(input)
        .where(eq(users.id, input.id))
        .returning();

      if (!user) {
        throw new UserNotFoundError(input.id);
      }
      return user;
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof UsernameAlreadyExistsError ||
        error instanceof EmailAlreadyExistsError
      ) {
        throw error;
      }
      throw new DatabaseError("更新用户", error);
    }
  },

  /**
   * 删除用户
   */
  async delete(id: string) {
    // 先检查用户是否存在
    await findByIdOrThrow(id);

    try {
      const [user] = await db.delete(users).where(eq(users.id, id)).returning();

      if (!user) {
        throw new UserNotFoundError(id);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError("删除用户", error);
    }
  },

  /**
   * 给用户挂载角色（全量替换：先清除旧角色，再写入新角色）
   */
  async assignRoles(userId: string, roleIds: string[]) {
    // 先检查用户是否存在
    await findByIdOrThrow(userId);

    // 去重，避免同一角色重复挂载
    const uniqueRoleIds = [...new Set(roleIds)];

    // 校验所有角色都存在
    if (uniqueRoleIds.length > 0) {
      const existingRoles = await db.query.roles.findMany({
        where: {id:{in:uniqueRoleIds}}
      });
      if (existingRoles.length !== uniqueRoleIds.length) {
        throw new InvalidUserInputError("roleIds", "包含不存在的角色");
      }
    }

    try {
      await db.transaction(async (tx) => {
        await tx.delete(userRoles).where(eq(userRoles.userId, userId));
        if (uniqueRoleIds.length > 0) {
          await tx.insert(userRoles).values(
            uniqueRoleIds.map((roleId) => ({ userId, roleId })),
          );
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new DatabaseError("分配角色", error);
    }
  },

  /**
   * 修改密码（验证当前密码后更新）
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await findByIdOrThrow(userId);

    if (user.password !== currentPassword) {
      throw new WrongPasswordError();
    }

    try {
      await db
        .update(users)
        .set({ password: newPassword })
        .where(eq(users.id, userId));
    } catch (error) {
      throw new DatabaseError("修改密码", error);
    }
  },

  /**
   * 获取分页信息（总页数）
   */
  async getTotalPages(pageSize: number = 10) {
    if (pageSize < 1 || pageSize > 100) {
      throw new InvalidUserInputError("pageSize", "必须在 1-100 之间");
    }

    try {
      const [countResult] = await db.select({ count: count() }).from(users);
      const total = countResult.count;
      return {
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      throw new DatabaseError("获取分页信息", error);
    }
  },
};
async function findByUsernameOrThrow(username: string) {
  try {
    const user = await db.query.users.findFirst({ where: { username } });
    if (!user) {
      throw new UserNotFoundError(username);
    }
    return user;
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new DatabaseError("找用户时候出错了");
  }
}
async function findByIdOrThrow(id: string) {
  try {
    const user = await db.query.users.findFirst({ where: { id } });
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new DatabaseError("找用户时候 出错了");
  }
}
