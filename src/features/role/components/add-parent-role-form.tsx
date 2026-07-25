"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addParentRoleAction } from "../role-action";

type Role = {
  id: string;
  name: string;
};

type AddParentRoleFormProps = {
  childRoleId: string;
  availableRoles: Role[];
};

export function AddParentRoleForm({
  childRoleId,
  availableRoles,
}: AddParentRoleFormProps) {
  const [state, action, isPending] = useActionState(
    addParentRoleAction,
    undefined,
  );

  return (
    <form action={action} className="flex items-end gap-2">
      <input type="hidden" name="childRoleId" value={childRoleId} />
      <select
        name="parentRoleId"
        required
        className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30"
      >
        <option value="">选择父角色...</option>
        {availableRoles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={isPending}>
        <Plus className="mr-1 size-3.5" />
        添加
      </Button>
      {state?.status === "error" && (
        <span className="text-xs text-destructive">{state.message}</span>
      )}
      {state?.status === "ok" && (
        <span className="text-xs text-emerald-600">{state.message}</span>
      )}
    </form>
  );
}
