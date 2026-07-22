import { Suspense } from "react";
import * as roleQuery from "@/features/role/role-query";
import { RoleTableView } from "./role-table-view";
import RoleTableSkeleton from "./role-table-skeleton";

type RoleTableProps = {
  page: number;
  pageSize: number;
};

async function RoleTableData({ page, pageSize }: RoleTableProps) {
  const result = await roleQuery.getRolesPaginated(page, pageSize);
  return <RoleTableView {...result} />;
}

export default async function RoleTable({ page, pageSize }: RoleTableProps) {
  return (
    <Suspense key={page} fallback={<RoleTableSkeleton />}>
      <RoleTableData page={page} pageSize={pageSize} />
    </Suspense>
  );
}
