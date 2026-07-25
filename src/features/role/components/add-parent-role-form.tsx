"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
      <NativeSelect name="parentRoleId"  required size="default">
        <NativeSelectOption value="">选择父角色...</NativeSelectOption>
        {availableRoles.map((role) => (
          <NativeSelectOption key={role.id} value={role.id}>
            {role.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
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
