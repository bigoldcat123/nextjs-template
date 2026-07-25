import "server-only";

import { userService } from "./user-service";
import { sleep } from "@/lib/utils";
import { cacheTag } from "next/cache";
import { auth } from "@/auth";

/**
 * 分页查询用户
 */
export async function getUsersPaginated(
  page: number = 1,
  pageSize: number = 10,
) {
  "use cache";
  cacheTag("users");
  await sleep(1000);
  return await userService.findPaginated(page, pageSize);
}
/**
 * 根据 pageSize 获取分页信息
 */
export async function getPaginationInfo(pageSize: number = 10) {
  "use cache";
  cacheTag("users");
  return await userService.getTotalPages(pageSize);
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
