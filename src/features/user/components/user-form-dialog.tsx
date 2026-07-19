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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { createUserAction, updateUserAction } from "../user-action";

type UserFormDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSubmitAction: typeof updateUserAction | typeof createUserAction;
  initialData?: {
    id: string;
    username: string;
    email?: string;
    displayName?: string;
  };
};

export function UserFormDialog({
  open,
  onOpenChangeAction,
  onSubmitAction,
  initialData,
}: UserFormDialogProps) {
  const isEdit = !!initialData;
  const [state, action, isPending] = useActionState(onSubmitAction, undefined);
  useEffect(() => {
    if (state?.status == "ok") {
      onOpenChangeAction(false);
    }
  }, [state, onOpenChangeAction]);
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-106.25">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "编辑用户" : "创建用户"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "更新用户信息" : "填写以下信息以创建新用户"}
            </DialogDescription>
          </DialogHeader>
          {state?.status == "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                defaultValue={initialData?.username}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={initialData?.email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="displayName">显示名称</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={initialData?.displayName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required={!isEdit}
              />
            </div>
          </div>
          <Input hidden name="id" defaultValue={initialData?.id} />
          <DialogFooter>
            <SubmitButton isPending={isPending}>
              {isEdit ? "保存" : "创建"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
