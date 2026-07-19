import "server-only";

import { db } from "@/db";
import { users, type users as usersTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import {
  DatabaseError,
  EmailAlreadyExistsError,
  InvalidUserInputError,
  UserNotFoundError,
  UsernameAlreadyExistsError,
} from "./user-errors";

/**
 * 创建用户输入类型
 */
export type CreateUserInput = typeof usersTable.$inferInsert;

/**
 * 更新用户输入类型
 */
export type UpdateUserInput = Partial<
  Pick<
    typeof usersTable.$inferSelect,
    "username" | "email" | "displayName" | "password"
  >
>;

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

    // 检查用户名是否已存在
    const existingUsername = await this.findByUsername(input.username);

    if (existingUsername) {
      throw new UsernameAlreadyExistsError(input.username);
    }

    // 检查邮箱是否已存在
    if (input.email) {
      const existingEmail = await this.findByEmail(input.email);
      if (existingEmail) {
        throw new EmailAlreadyExistsError(input.email);
      }
    }

    try {
      const [user] = await db.insert(users).values(input).returning();
      return user;
    } catch (error) {
      throw new DatabaseError("创建用户", error);
    }
  },

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return user ?? null;
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 根据 ID 查找用户，不存在则抛出异常
   */
  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  },

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      if (user) {
        return user;
      } else {
        throw new UserNotFoundError(username);
      }
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 根据用户名查找用户，不存在则抛出异常
   */
  async findByUsernameOrThrow(username: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError(username);
    }
    return user;
  },

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return user ?? null;
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 查询所有用户
   */
  async findAll() {
    try {
      return await db.select().from(users);
    } catch (error) {
      throw new DatabaseError("查询用户列表", error);
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
        db
          .select()
          .from(users)
          .limit(pageSize)
          .offset(offset)
          .orderBy(users.createdAt),
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
  async update(id: string, input: UpdateUserInput) {
    // 先检查用户是否存在
    const existingUser = await this.findByIdOrThrow(id);

    // 检查用户名是否被其他用户使用
    if (input.username && input.username !== existingUser.username) {
      const existingUsername = await this.findByUsername(input.username);
      if (existingUsername && existingUsername.id !== id) {
        throw new UsernameAlreadyExistsError(input.username);
      }
    }

    // 检查邮箱是否被其他用户使用
    if (input.email && input.email !== existingUser.email) {
      const existingEmail = await this.findByEmail(input.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new EmailAlreadyExistsError(input.email);
      }
    }

    try {
      const [user] = await db
        .update(users)
        .set(input)
        .where(eq(users.id, id))
        .returning();

      if (!user) {
        throw new UserNotFoundError(id);
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
    await this.findByIdOrThrow(id);

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
};
