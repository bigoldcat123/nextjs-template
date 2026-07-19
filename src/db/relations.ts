// relations.ts
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    // userRoles: r.many.userRoles(),
    // 用 through,直接拿到用户的所有角色,不用手动嵌套 userRoles → role
    roles: r.many.roles({
      from: r.users.id.through(r.userRoles.userId),
      to: r.roles.id.through(r.userRoles.roleId),
    }),
  },
  roles: {
    // userRoles: r.many.userRoles(),
    // rolePermissions: r.many.rolePermissions(),
    // 直接拿权限,跳过 rolePermissions 这层
    permissions: r.many.permissions({
      from: r.roles.id.through(r.rolePermissions.roleId),
      to: r.permissions.id.through(r.rolePermissions.permissionId),
    }),
    // 角色继承:该角色继承了哪些父角色
    parentRoles: r.many.roles({
      from: r.roles.id.through(r.roleHierarchy.childRoleId),
      to: r.roles.id.through(r.roleHierarchy.parentRoleId),
      alias: "role_parents",
    }),
    // 哪些子角色继承了该角色
    childRoles: r.many.roles({
      from: r.roles.id.through(r.roleHierarchy.parentRoleId),
      to: r.roles.id.through(r.roleHierarchy.childRoleId),
      alias: "role_children",
    }),
  },
  // permissions: {
  //   rolePermissions: r.many.rolePermissions(),
  // },
}));
