"use client";

import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { saveRolePermissionsAction } from "../role-action";
import type { Permission } from "@/types";

type PermissionDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  roleId: string;
  permissions: Permission[];
  currentPermissionIds: string[];
};

/**
 * 角色权限配置弹窗:按资源分组列出全部权限,勾选后全量保存
 */
export function PermissionDialog({
  open,
  onOpenChangeAction,
  roleId,
  permissions,
  currentPermissionIds,
}: PermissionDialogProps) {
  const [state, action, isPending] = useActionState(
    saveRolePermissionsAction,
    undefined,
  );

  useEffect(() => {
    if (state?.status === "ok") {
      onOpenChangeAction(false);
    }
  }, [state, onOpenChangeAction]);

  // 按资源分组权限
  const groups = permissions.reduce<Record<string, Permission[]>>(
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
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-106.25">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>配置角色权限</DialogTitle>
            <DialogDescription>
              勾选该角色拥有的权限，保存后生效
            </DialogDescription>
          </DialogHeader>
          {state?.status === "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}
          <input type="hidden" name="roleId" value={roleId} />
          <div className="grid max-h-96 gap-4 overflow-y-auto py-4">
            {Object.entries(groups).map(([resource, perms]) => (
              <div key={resource} className="grid gap-2">
                <Label className="font-medium">{resource}</Label>
                <div className="flex flex-wrap gap-2">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      title={perm.description ?? undefined}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        name="permissionIds"
                        value={perm.id}
                        defaultChecked={currentPermissionIds.includes(perm.id)}
                        className="size-4 accent-primary"
                      />
                      {perm.action}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <SubmitButton isPending={isPending}>保存</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
