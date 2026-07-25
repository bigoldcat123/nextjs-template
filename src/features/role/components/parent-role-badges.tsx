"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { removeParentRoleAction } from "../role-action";

type ParentRole = {
  id: string;
  name: string;
};

type ParentRoleBadgesProps = {
  childRoleId: string;
  parentRoles: ParentRole[];
};

export function ParentRoleBadges({
  childRoleId,
  parentRoles,
}: ParentRoleBadgesProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (parentRoleId: string) => {
    startTransition(async () => {
      await removeParentRoleAction(childRoleId, parentRoleId);
    });
  };

  if (parentRoles.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无父角色</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {parentRoles.map((parent) => (
        <span
          key={parent.id}
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
        >
          {parent.name}
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRemove(parent.id)}
            className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
