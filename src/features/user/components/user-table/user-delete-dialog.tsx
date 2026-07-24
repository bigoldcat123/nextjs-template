"use client";

import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteUserAction } from "../../user-action";

type UserDeleteDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onConfirmAction: typeof deleteUserAction;
  userId: string;
  username: string;
};

export function UserDeleteDialog({
  open,
  onOpenChangeAction,
  onConfirmAction,
  userId,
  username,
}: UserDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const onConfirm = () => {
    startTransition(async () => {
      const res = await onConfirmAction(userId);
      startTransition(() => {
        if (res?.status === "ok") {
          onOpenChangeAction(false);
        } else {
          setError(res?.message ?? "删除出错啦！");
        }
      });
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <DialogTitle>确认删除</DialogTitle>
          </div>
          <DialogDescription>
            确定要删除用户{" "}
            <span className="font-medium text-foreground">{username}</span>{" "}
            吗？此操作无法撤销。
          </DialogDescription>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            取消
          </Button>
          <SubmitButton
            type="button"
            isPending={isPending}
            variant="destructive"
            onClick={onConfirm}
          >
            删除
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
