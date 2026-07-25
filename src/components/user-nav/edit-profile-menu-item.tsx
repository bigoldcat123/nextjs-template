"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserPen } from "lucide-react";

type EditProfileMenuItemProps = {
  onOpen: () => void;
};

export function EditProfileMenuItem({ onOpen }: EditProfileMenuItemProps) {
  return (
    <DropdownMenuItem onClick={onOpen}>
      <UserPen className="mr-2 size-4" />
      <span>修改个人信息</span>
    </DropdownMenuItem>
  );
}
