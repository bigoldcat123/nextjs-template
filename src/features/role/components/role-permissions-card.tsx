"use client";

import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, ShieldCheck } from "lucide-react";
import { PermissionDialog } from "./permission-dialog";
import type { Permission } from "@/types";

type RolePermissionsCardProps = {
  roleId: string;
  permissions: Permission[];
  currentPermissionIds: string[];
};

/**
 * 角色详情页的权限卡片:展示当前权限,点击"配置权限"打开配置弹窗
 */
export function RolePermissionsCard({
  roleId,
  permissions,
  currentPermissionIds,
}: RolePermissionsCardProps) {
  const [open, setOpen] = useState(false);

  const currentPermissions = permissions.filter((perm) =>
    currentPermissionIds.includes(perm.id),
  );

  // 按资源分组当前权限
  const groups = currentPermissions.reduce<Record<string, Permission[]>>(
    (acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = [];
      }
      acc[perm.resource].push(perm);
      return acc;
    },
    {},
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5" />
          角色权限
        </CardTitle>
        <CardAction>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Settings2 className="mr-1 size-3.5" />
            配置权限
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {currentPermissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无权限</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(groups).map(([resource, perms]) => (
              <span
                key={resource}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
              >
                <span className="font-medium">{resource}</span>
                <span className="text-muted-foreground">
                  {perms.map((p) => p.action).join(" / ")}
                </span>
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <PermissionDialog
        open={open}
        onOpenChangeAction={setOpen}
        roleId={roleId}
        permissions={permissions}
        currentPermissionIds={currentPermissionIds}
      />
    </Card>
  );
}
