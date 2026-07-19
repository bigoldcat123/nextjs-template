import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  permissions,
  roleHierarchy,
  rolePermissions,
  roles,
  userRoles,
  users,
} from "@/db/schema";
import crypto from "crypto";

const db = drizzle(process.env.DATABASE_URL!);

// 预生成 UUID
const generateId = () => crypto.randomUUID();

async function seed() {
  console.log("🌱 开始填充数据...\n");

  // 清空现有数据
  await db.delete(userRoles);
  await db.delete(rolePermissions);
  await db.delete(roleHierarchy);
  await db.delete(permissions);
  await db.delete(roles);
  await db.delete(users);
  console.log("✅ 已清空现有数据\n");

  // 生成 UUID
  const viewerRoleId = generateId();
  const editorRoleId = generateId();
  const adminRoleId = generateId();

  const user1Id = generateId();
  const user2Id = generateId();
  const user3Id = generateId();
  const user4Id = generateId();

  // ── 权限 ──
  const insertedPermissions = await db
    .insert(permissions)
    .values([
      { resource: "post", action: "read", description: "查看文章" },
      { resource: "post", action: "create", description: "创建文章" },
      { resource: "post", action: "update", description: "更新文章" },
      { resource: "post", action: "delete", description: "删除文章" },
      { resource: "user", action: "read", description: "查看用户" },
      { resource: "user", action: "create", description: "创建用户" },
      { resource: "user", action: "update", description: "更新用户" },
      { resource: "user", action: "delete", description: "删除用户" },
      { resource: "comment", action: "read", description: "查看评论" },
      { resource: "comment", action: "create", description: "创建评论" },
      { resource: "comment", action: "delete", description: "删除评论" },
      { resource: "setting", action: "read", description: "查看设置" },
      { resource: "setting", action: "update", description: "更新设置" },
    ])
    .returning();
  console.log(`✅ 已插入 ${insertedPermissions.length} 条权限`);

  // ── 角色 ──
  const insertedRoles = await db
    .insert(roles)
    .values([
      {
        id: viewerRoleId,
        name: "viewer",
        description: "访客角色，只能查看内容",
      },
      {
        id: editorRoleId,
        name: "editor",
        description: "编辑角色，可以管理文章和评论",
      },
      {
        id: adminRoleId,
        name: "admin",
        description: "管理员角色，拥有全部权限",
      },
    ])
    .returning();
  console.log(`✅ 已插入 ${insertedRoles.length} 条角色`);

  // ── 角色继承 ──
  // editor 继承 viewer
  // admin 继承 editor（从而也继承 viewer）
  await db.insert(roleHierarchy).values([
    { parentRoleId: viewerRoleId, childRoleId: editorRoleId },
    { parentRoleId: editorRoleId, childRoleId: adminRoleId },
  ]);
  console.log("✅ 已设置角色继承关系");

  // 找到各权限 ID
  const getPermissionId = (resource: string, action: string) =>
    insertedPermissions.find(
      (p) => p.resource === resource && p.action === action
    )!.id;

  // viewer 的权限：只能读取
  await db.insert(rolePermissions).values([
    { roleId: viewerRoleId, permissionId: getPermissionId("post", "read") },
    { roleId: viewerRoleId, permissionId: getPermissionId("user", "read") },
    {
      roleId: viewerRoleId,
      permissionId: getPermissionId("comment", "read"),
    },
    {
      roleId: viewerRoleId,
      permissionId: getPermissionId("setting", "read"),
    },
  ]);

  // editor 的权限：文章的完整操作 + 评论的创建和删除
  await db.insert(rolePermissions).values([
    {
      roleId: editorRoleId,
      permissionId: getPermissionId("post", "create"),
    },
    {
      roleId: editorRoleId,
      permissionId: getPermissionId("post", "update"),
    },
    {
      roleId: editorRoleId,
      permissionId: getPermissionId("post", "delete"),
    },
    {
      roleId: editorRoleId,
      permissionId: getPermissionId("comment", "create"),
    },
    {
      roleId: editorRoleId,
      permissionId: getPermissionId("comment", "delete"),
    },
  ]);

  // admin 的权限：用户管理和设置管理
  await db.insert(rolePermissions).values([
    {
      roleId: adminRoleId,
      permissionId: getPermissionId("user", "create"),
    },
    {
      roleId: adminRoleId,
      permissionId: getPermissionId("user", "update"),
    },
    {
      roleId: adminRoleId,
      permissionId: getPermissionId("user", "delete"),
    },
    {
      roleId: adminRoleId,
      permissionId: getPermissionId("setting", "update"),
    },
  ]);
  console.log("✅ 已设置角色-权限关联");

  // ── 用户 ──
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        id: user1Id,
        username: "alice",
        email: "alice@example.com",
        password: "hashed_password_1",
        displayName: "Alice Wang",
      },
      {
        id: user2Id,
        username: "bob",
        email: "bob@example.com",
        password: "hashed_password_2",
        displayName: "Bob Li",
      },
      {
        id: user3Id,
        username: "charlie",
        email: "charlie@example.com",
        password: "hashed_password_3",
        displayName: "Charlie Zhang",
      },
      {
        id: user4Id,
        username: "diana",
        email: "diana@example.com",
        password: "hashed_password_4",
        displayName: "Diana Chen",
      },
    ])
    .returning();
  console.log(`✅ 已插入 ${insertedUsers.length} 条用户`);

  // ── 用户-角色关联 ──
  await db.insert(userRoles).values([
    { userId: user1Id, roleId: adminRoleId }, // Alice 是管理员
    { userId: user2Id, roleId: editorRoleId }, // Bob 是编辑
    { userId: user3Id, roleId: viewerRoleId }, // Charlie 是访客
    { userId: user4Id, roleId: viewerRoleId }, // Diana 也是访客
  ]);
  console.log("✅ 已设置用户-角色关联");

  console.log("\n🎉 数据填充完成！");
  console.log("\n📊 数据概览:");
  console.log("  - 用户: alice(admin), bob(editor), charlie(viewer), diana(viewer)");
  console.log("  - 角色继承: admin → editor → viewer");
  console.log("  - 权限资源: post, user, comment, setting");
  console.log("  - 权限操作: read, create, update, delete");
}

seed()
  .catch((error) => {
    console.error("❌ 填充失败:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
