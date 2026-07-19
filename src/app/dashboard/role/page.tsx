import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserKey } from "lucide-react";
import { RoleTableServer } from "@/features/role/components/role-table-server";
import { getRolePaginationInfo } from "@/features/role/role-query";
import { PaginationBar } from "@/components/pagination-bar";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; pageSize: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">角色管理</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserKey className="size-5" />
            角色列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense key={page} fallback={<RoleTableSkeleton />}>
            <RoleTableServer page={page} pageSize={pageSize} />
          </Suspense>
          <Suspense fallback={<PaginationBarSkeleton />}>
            <PaginationBar
              pageSize={pageSize}
              page={page}
              pageInfo={getRolePaginationInfo(pageSize)}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function PaginationBarSkeleton() {
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
