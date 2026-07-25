import { Users, UserKey } from "lucide-react";

/**
 * 仪表盘导航配置 —— 侧边栏与面包屑共用的单一数据源。
 * 新增路由时只需在这里添加一项，两边的标签自动保持同步。
 */
export const navItems = [
  {
    title: "用户管理",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "角色管理",
    url: "/dashboard/role",
    icon: UserKey,
  },
];
