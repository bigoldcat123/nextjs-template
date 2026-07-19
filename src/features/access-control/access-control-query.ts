import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * 获取指定用户的所有权限(包括通过角色继承得到的权限)
 * 使用递归 CTE 遍历角色继承链
 */
export async function getUserPermissions(userId: string) {
  // 递归查询: 从用户的直接角色出发,沿 roleHierarchy 向上查找所有祖先角色,
  // 最后聚合这些角色关联的权限
  const result = await db.execute(sql`
    WITH RECURSIVE user_roles_recursive AS (
      -- 基础: 用户的直接角色
      SELECT role_id
      FROM user_roles
      WHERE user_id = ${userId}

      UNION

      -- 递归: 查找父角色(childRoleId 继承了 parentRoleId 的权限)
      SELECT rh.parent_role_id AS role_id
      FROM role_hierarchy rh
      INNER JOIN user_roles_recursive urr ON rh.child_role_id = urr.role_id
    )
    SELECT DISTINCT p.id, p.resource, p.action, p.description
    FROM user_roles_recursive urr
    JOIN role_permissions rp ON rp.role_id = urr.role_id
    JOIN permissions p ON p.id = rp.permission_id
  `);

  return result.rows as {
    id: string;
    resource: string;
    action: string;
    description: string | null;
  }[];
}
