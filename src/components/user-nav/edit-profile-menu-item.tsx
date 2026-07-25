"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserPen } from "lucide-react";
import { ProfileDialog } from "@/components/profile-dialog";

export function EditProfileMenuItem() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem onClick={() => setOpen(true)}>
        <UserPen className="mr-2 size-4" />
        <span>修改个人信息</span>
      </DropdownMenuItem>
      <ProfileDialog open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
