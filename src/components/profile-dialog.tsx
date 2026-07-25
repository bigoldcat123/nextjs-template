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
import { useSession } from "next-auth/react";
import { updateProfileAction } from "@/features/user/user-action";

type ProfileDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function ProfileDialog({ open, onOpenChangeAction }: ProfileDialogProps) {
  const { data: session } = useSession();
  const [state, action, isPending] = useActionState(updateProfileAction, undefined);

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
            <DialogTitle>修改个人信息</DialogTitle>
            <DialogDescription>更新你的显示名称和邮箱</DialogDescription>
          </DialogHeader>
          {state?.status === "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="displayName">显示名称</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={session?.user?.displayname}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={session?.user?.email || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isPending={isPending}>保存</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
