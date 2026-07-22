import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserKey } from "lucide-react";
import { getRolePaginationInfo } from "@/features/role/role-query";
import { PaginationBar } from "@/components/pagination-bar";
import RoleTable from "@/features/role/components/role-table";

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
          <RoleTable page={page} pageSize={pageSize} />
          <PaginationBar
            pageSize={pageSize}
            page={page}
            pageInfo={getRolePaginationInfo(pageSize)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
