"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { KeyRound } from "lucide-react";
import { ChangePasswordDialog } from "@/components/change-password-dialog";

export function ChangePasswordMenuItem() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem onClick={() => setOpen(true)}>
        <KeyRound className="mr-2 size-4" />
        <span>修改密码</span>
      </DropdownMenuItem>
      <ChangePasswordDialog open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
