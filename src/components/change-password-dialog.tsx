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
import { changePasswordAction } from "@/features/user/user-action";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function ChangePasswordDialog({
  open,
  onOpenChangeAction,
}: ChangePasswordDialogProps) {
  const [state, action, isPending] = useActionState(
    changePasswordAction,
    undefined,
  );

  useEffect(() => {
    if (state?.status === "ok") {
      onOpenChangeAction(false);
    }
  }, [state, onOpenChangeAction]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-106.25">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>输入当前密码和新密码</DialogDescription>
          </DialogHeader>
          {state?.status === "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={6}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isPending={isPending}>确认修改</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
