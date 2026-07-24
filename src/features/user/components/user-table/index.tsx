import { Suspense } from "react";
import * as userQuery from "@/features/user/user-query";
import { updateUserAction, deleteUserAction } from "@/features/user/user-action";
import { UserTableView } from "./user-table-view";
import UserTableSkeleton from "./user-table-skeleton";

type UserTableProps = {
  page: number;
  pageSize: number;
};

async function UserTableData({ page, pageSize }: UserTableProps) {
  const result = await userQuery.getUsersPaginated(page, pageSize);

  return (
    <UserTableView
      {...result}
      onUpdateAction={updateUserAction}
      onDeleteAction={deleteUserAction}
    />
  );
}

export default async function UserTable({ page, pageSize }: UserTableProps) {
  return (
    <Suspense key={page} fallback={<UserTableSkeleton />}>
      <UserTableData page={page} pageSize={pageSize} />
    </Suspense>
  );
}
