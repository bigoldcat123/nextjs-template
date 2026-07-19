import "server-only";

import { db } from "@/db";
import { users } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export type CreateUserInput = typeof users.$inferInsert;

export type UpdateUserInput = Partial<
  Pick<typeof users.$inferSelect, "email" | "displayName" | "password">
>;
/**
 * 用户仓储 - 提供对用户的增删改查操作
 * 该层仅负责数据访问，不做异常处理
 */
export const userRepository = {
  /**
   * 创建新用户
   */
  async create(input: CreateUserInput) {
    const [user] = await db.insert(users).values(input).returning();
    return user;
  },

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user ?? null;
  },

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user ?? null;
  },

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user ?? null;
  },

  /**
   * 查询所有用户
   */
  async findAll() {
    return await db.select().from(users);
  },

  /**
   * 分页查询用户
   */
  async findPaginated(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;

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
  },

  /**
   * 更新用户
   */
  async update(id: string, input: UpdateUserInput) {
    const [user] = await db
      .update(users)
      .set(input)
      .where(eq(users.id, id))
      .returning();
    return user ?? null;
  },

  /**
   * 删除用户
   */
  async delete(id: string) {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    return user ?? null;
  },
};
