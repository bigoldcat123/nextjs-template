# Auth Template — RBAC 认证后台模板

一个开箱即用的 **用户 · 角色 · 权限 (RBAC)** 后台管理系统模板,基于现代 Next.js 全栈架构,可直接作为新项目的起点。

## 功能特性

| 模块 | 说明 | 状态 |
| --- | --- | --- |
| 账号认证 | NextAuth v5 Credentials 登录、会话管理、`/dashboard` 与 `/api` 路由保护 | ✅ |
| 用户管理 | 用户增删改查、分页、角色分配(多选)、个人资料编辑、修改密码 | ✅ |
| 角色管理 | 角色创建、列表、详情 | ✅ |
| 角色多继承 | 角色 DAG 继承、父角色添加/移除、继承关系图可视化 | ✅ |
| 权限模型 | `resource × action` 权限、角色-权限关联、递归继承权限解析 | ✅(仅查询能力) |

> 权限模型目前提供数据库 schema 与「按用户聚合继承权限」的解析函数(`access-control-query`),尚未实现权限管理 UI 与业务侧权限校验,见 [Roadmap](#roadmap)。

## 技术栈

- **框架**: Next.js 16 (App Router) · React 19 · TypeScript
- **认证**: NextAuth v5 (beta) — Credentials 账号密码登录
- **数据库**: PostgreSQL · Drizzle ORM + `drizzle-kit` 迁移
- **UI**: Tailwind CSS v4 · shadcn/ui (base-lyra) · lucide / remixicon 图标
- **图可视化**: React Flow (`@xyflow/react`) + Dagre 自动布局
- **校验**: Zod
- **包管理**: Bun

## 快速开始

### 1. 环境要求

- [Bun](https://bun.sh) ≥ 1.x(或 npm / pnpm / yarn)
- 本地 PostgreSQL 实例(默认连接 `localhost:5432`)

### 2. 安装依赖

```bash
bun install
```

### 3. 配置环境变量

在项目根目录的 `.env` 中配置:

```
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://admin:root@localhost:5432/auth_template
```

- `AUTH_SECRET`: NextAuth 会话签名密钥,可用 `openssl rand -base64 32` 生成
- `DATABASE_URL`: PostgreSQL 连接串,需提前创建对应数据库(如 `CREATE DATABASE auth_template;`)

### 4. 同步数据库表结构

仓库未内置迁移文件,直接按 schema 推送(适合模板开发阶段):

```bash
bunx drizzle-kit push
```

### 5. 填充种子数据(可选)

```bash
bun seed.ts
```

种子脚本会清空并重建数据:

| 用户名 | 密码 | 角色 |
| --- | --- | --- |
| `alice` | `hashed_password_1` | admin |
| `bob` | `hashed_password_2` | editor |
| `charlie` | `hashed_password_3` | viewer |
| `diana` | `hashed_password_4` | viewer |

角色继承链:`admin → editor → viewer`;权限资源:`post / user / comment / setting`,操作:`read / create / update / delete`。

### 6. 启动开发服务器

```bash
bun dev
```

访问 http://localhost:3000,使用种子账号登录后进入 `/dashboard`。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `bun dev` | 启动开发服务器 |
| `bun build` | 生产构建 |
| `bun start` | 启动生产服务器 |
| `bun lint` | ESLint 检查 |
| `bun seed.ts` | 重建种子数据 |
| `bunx drizzle-kit push` | 直接同步 schema 到数据库 |
| `bunx drizzle-kit generate` | 生成 SQL 迁移文件 |
| `bunx drizzle-kit migrate` | 执行迁移 |

## 目录结构

```
auth-template/
├── src/
│   ├── app/                    # App Router 路由
│   │   ├── api/auth/           # NextAuth API 路由
│   │   ├── dashboard/          # 后台页面(用户管理 / 角色管理)
│   │   ├── login/              # 登录页
│   │   └── layout.tsx          # 根布局(主题、字体)
│   ├── auth.ts                 # NextAuth 配置(会话、回调)
│   ├── proxy.ts                # 中间件:保护 /dashboard 与 /api
│   ├── db/                     # Drizzle:schema / relations / 客户端
│   ├── features/               # 按业务域划分
│   │   ├── user/               # 用户:service / query / action / 组件
│   │   ├── role/               # 角色:service / query / action / 组件 / 继承图
│   │   └── access-control/     # 权限:继承权限解析(递归 CTE)
│   ├── components/             # 全局 UI 组件(shadcn/ui 等)
│   ├── lib/                    # 工具函数(cn、sleep 等)
│   ├── types/                  # 共享类型(ActionState)
│   ├── error/                  # 错误基类(AppError / DatabaseError)
│   └── auth-providers/         # NextAuth Provider(credentials)
├── seed.ts                     # 种子数据脚本
├── drizzle.config.ts           # Drizzle 配置
├── components.json             # shadcn/ui 配置
└── AGENTS.md                   # AI 辅助开发规则
```

## 架构概览

数据流遵循「页面 → query(缓存) → service → db」与「表单 → action → service → db」两层分层,每层职责单一、错误逐层转换为领域错误。详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## Roadmap

- [x] 用户管理(增删改查、角色分配)
- [x] 角色管理(创建、查询)
- [x] 角色多继承 + 关系图可视化
- [ ] 权限管理 UI(权限 CRUD、角色-权限绑定)
- [ ] 业务侧权限校验(基于 `getUserPermissions` 的页面/接口守卫)
- [ ] 密码哈希存储(当前为明文,模板演示用)

## 已知限制

- 密码以明文存储,`authorize` 仅做等价匹配(模板演示用),接入生产需引入密码哈希(如 bcrypt)与登录防爆破。
- `access-control` 只有继承权限解析函数,缺少权限管理 UI 与业务侧校验守卫。
- 仓库未内置 Drizzle 迁移文件,首次使用需 `drizzle-kit push` 或 `generate`。
