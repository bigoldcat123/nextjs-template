"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { KeyRound } from "lucide-react";

type ChangePasswordMenuItemProps = {
  onOpen: () => void;
};

export function ChangePasswordMenuItem({ onOpen }: ChangePasswordMenuItemProps) {
  return (
    <DropdownMenuItem onClick={onOpen}>
      <KeyRound className="mr-2 size-4" />
      <span>修改密码</span>
    </DropdownMenuItem>
  );
}
