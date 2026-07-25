import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleGraph from "@/features/role/components/role-graph";
import { AddParentRoleForm } from "@/features/role/components/add-parent-role-form";
import { UserKey, GitBranch } from "lucide-react";
import { getRoleById, getAllRoles } from "@/features/role/role-query";
import { notFound } from "next/navigation";

export default async function RoleDetailPage({
  params,
}: PageProps<"/dashboard/role/[id]">) {
  const { id } = await params;
  const [role, allRoles] = await Promise.all([getRoleById(id), getAllRoles()]);

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
          {role.parentRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {role.parentRoles.map((parent) => (
                <span
                  key={parent.id}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                >
                  {parent.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无父角色</p>
          )}

          <AddParentRoleForm
            childRoleId={id}
            availableRoles={availableRoles}
          />
        </CardContent>
      </Card>

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
