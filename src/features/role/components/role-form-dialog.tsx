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
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect } from "react";
import { createRoleAction } from "../role-action";

type RoleFormDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSubmitAction: typeof createRoleAction;
};

export function RoleFormDialog({
  open,
  onOpenChangeAction,
  onSubmitAction,
}: RoleFormDialogProps) {
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
            <DialogTitle>创建角色</DialogTitle>
            <DialogDescription>填写以下信息以创建新角色</DialogDescription>
          </DialogHeader>
          {state?.status == "error" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {state.message}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">角色名称</Label>
              <Input id="name" name="name" placeholder="如: admin, editor, viewer" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="角色的用途说明"
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton isPending={isPending}>创建</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
