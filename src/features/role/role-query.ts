import "server-only";

import { roleService } from "./role-service";
import { cacheTag } from "next/cache";

/**
 * 分页查询角色
 */
export async function getRolesPaginated(
  page: number = 1,
  pageSize: number = 10,
) {
  return await roleService.findPaginated(page, pageSize);
}

/**
 * 根据 pageSize 获取分页信息
 */
export async function getRolePaginationInfo(pageSize: number = 10) {
  "use cache";
  cacheTag("roles");
  return await roleService.getTotalPages(pageSize);
}

export async function getRoleGraph(roleId: string) {
  return roleService.getRoleGraph(roleId);
}
