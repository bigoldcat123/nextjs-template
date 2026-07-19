"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useTransition } from "react";

type UserDeleteDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onConfirmAction: (userid: string) => Promise<{ error?: string }>;
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
  const onConfirm = () => {
    startTransition(async () => {
      await onConfirmAction(userId);
      startTransition(() => {
        onOpenChangeAction(false);
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
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            取消
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={onConfirm}
          >
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
