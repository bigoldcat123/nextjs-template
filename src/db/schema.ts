import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).unique(),
  password: varchar({ length: 255 }).notNull(),
  displayName: varchar({ length: 255 }).notNull().default("SomeRandomUser"),
  createdAt: timestamp("create_at").notNull().defaultNow(),
});

// ── 角色表 ──
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // 如 'admin', 'editor', 'viewer'
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── 权限表 ──
export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resource: varchar("resource", { length: 100 }).notNull(), // 如 'post', 'user'
    action: varchar("action", { length: 50 }).notNull(), // 如 'create', 'read', 'update', 'delete'
    description: text("description"),
  },
  (table) => [
    // 同一个 resource + action 组合唯一,避免重复定义权限
    uniqueIndex("resource_action_idx").on(table.resource, table.action),
  ],
);

// ── 角色继承关系表(核心)──
// childRole 继承 parentRole 的所有权限
// 例如: parentRoleId = 'viewer', childRoleId = 'editor'
// 表示 editor 继承 viewer 的权限(editor 是更"高级"的角色)
export const roleHierarchy = pgTable(
  "role_hierarchy",
  {
    parentRoleId: uuid("parent_role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    childRoleId: uuid("child_role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.parentRoleId, table.childRoleId] })],
);

// ── 角色-权限 关联表 ──
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => [
    // {
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    // },
  ],
);

// ── 用户-角色 关联表 ──
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);
