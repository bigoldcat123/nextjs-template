import "server-only";

import { userService } from "./user-service";

/**
 * 根据 ID 查找用户，不存在则抛出异常
 */
export async function findById(id: string) {
  // "use cache";
  return await userService.findByIdOrThrow(id);
}

/**
 * 根据用户名查找用户，不存在则抛出异常
 */
export async function findByUsername(username: string) {
  // "use cache";
  return await userService.findByUsernameOrThrow(username);
}

/**
 * 根据邮箱查找用户
 */
export async function findByEmail(email: string) {
  // "use cache";
  return await userService.findByEmail(email);
}

/**
 * 查询所有用户
 */
export async function findAll() {
  "use cache";
  return await userService.findAll();
}

/**
 * 分页查询用户
 */
export async function findPaginated(page: number = 1, pageSize: number = 10) {
  return await userService.findPaginated(page, pageSize);
}
