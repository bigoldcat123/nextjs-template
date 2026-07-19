"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "disabled"
> {
  isPending: boolean;
  pendingArea?: React.ReactNode;
}

function SubmitButton({
  isPending,
  pendingArea = <span>提交中</span>,
  className,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className={cn(className)}
      {...props}
    >
      {isPending && <Spinner data-icon="inline-start" />}
      {isPending ? pendingArea : children}
    </Button>
  );
}

export { SubmitButton };
