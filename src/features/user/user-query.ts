import "server-only";

import { userService } from "./user-service";
import { sleep } from "@/lib/utils";
import { cacheTag } from "next/cache";

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
