import { Skeleton } from "./ui/skeleton";

export default function PaginationBarSkeleton() {
  return (
    <div className="flex items-center justify-between pt-4">
      <Skeleton className="h-5 w-40" />
      <div className="flex items-center gap-1">
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
      </div>
    </div>
  );
}
