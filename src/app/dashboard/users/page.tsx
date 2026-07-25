import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import UserTable from "@/features/user/components/user-table";
import { getPaginationInfo } from "@/features/user/user-query";
import { getAllRoles } from "@/features/role/role-query";
import { CreateUserButton } from "@/features/user/components/create-user-button";
import { PaginationBar } from "@/components/pagination-bar";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; pageSize: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const roles = await getAllRoles();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
        </div>
        <CreateUserButton roles={roles} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            用户列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable page={page} pageSize={pageSize} roles={roles} />
          <Suspense fallback={<PaginationBarSkeleton />}>
            <PaginationBar
              pageSize={pageSize}
              page={page}
              pageInfo={getPaginationInfo(pageSize)}
            />
          </Suspense>
        </CardContent>
      </Card>
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
