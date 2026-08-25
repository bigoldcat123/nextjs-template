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
  'use cache'
  cacheTag("roles")
  return roleService.getRoleGraph(roleId);
}

/**
 * 根据 ID 获取角色详情（含父角色）
 */
export async function getRoleById(roleId: string) {
  return roleService.findById(roleId);
}

/**
 * 获取所有角色（用于下拉选择）
 */
export async function getAllRoles() {
  return roleService.findAll();
}
/**
 * 获取所有权限（用于角色权限配置）
 */
export async function getAllPermissions() {
  'use cache'
  cacheTag("permissions")
  return roleService.findAllPermissions();
}
