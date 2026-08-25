import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleGraph from "@/features/role/components/role-graph";
import { AddParentRoleForm } from "@/features/role/components/add-parent-role-form";
import { ParentRoleBadges } from "@/features/role/components/parent-role-badges";
import { UserKey, GitBranch } from "lucide-react";
import { notFound } from "next/navigation";
import { RolePermissionsCard } from "@/features/role/components/role-permissions-card";
import { getAllPermissions, getAllRoles, getRoleById } from "@/features/role/role-query";

export default async function RoleDetailPage({
  params,
}: PageProps<"/dashboard/role/[id]">) {
  const { id } = await params;
  const [role, allRoles, allPermissions] = await Promise.all([
    getRoleById(id),
    getAllRoles(),
    getAllPermissions(),
  ]);

  if (!role) {
    notFound();
  }

  // 排除自身和已有的父角色
  const parentRoleIds = new Set(role.parentRoles.map((r) => r.id));
  const availableRoles = allRoles.filter(
    (r) => r.id !== id && !parentRoleIds.has(r.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{role.name}</h1>
        <p className="text-muted-foreground mt-1">
          {role.description || "暂无描述"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="size-5" />
            继承关系
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ParentRoleBadges
            childRoleId={id}
            parentRoles={role.parentRoles}
          />

          <AddParentRoleForm
            childRoleId={id}
            availableRoles={availableRoles}
          />
        </CardContent>
      </Card>
      <RolePermissionsCard
        roleId={id}
        permissions={allPermissions}
        currentPermissionIds={role.permissions.map((p) => p.id)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserKey className="size-5" />
            角色继承图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoleGraph roleId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
