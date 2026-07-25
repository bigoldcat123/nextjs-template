"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleFormDialog } from "./role-form-dialog";
import { createRoleAction } from "@/features/role/role-action";

export function CreateRoleButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 size-4" />
        新建角色
      </Button>
      <RoleFormDialog
        open={open}
        onOpenChangeAction={setOpen}
        onSubmitAction={createRoleAction}
      />
    </>
  );
}
