"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserFormDialog } from "./user-form-dialog";
import { createUserAction } from "@/features/user/user-action";

export function CreateUserButton({
  roles = [],
}: {
  roles?: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 size-4" />
        新建用户
      </Button>
      <UserFormDialog
        open={open}
        onOpenChangeAction={setOpen}
        onSubmitAction={createUserAction}
        roles={roles}
      />
    </>
  );
}
