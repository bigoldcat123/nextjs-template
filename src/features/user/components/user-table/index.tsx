import { Suspense } from "react";
import * as userQuery from "@/features/user/user-query";
import { updateUserAction, deleteUserAction } from "@/features/user/user-action";
import { UserTableView } from "./user-table-view";
import UserTableSkeleton from "./user-table-skeleton";

type UserTableProps = {
  page: number;
  pageSize: number;
  roles: { id: string; name: string }[];
};

async function UserTableData({ page, pageSize, roles }: UserTableProps) {
  const result = await userQuery.getUsersPaginated(page, pageSize);

  return (
    <UserTableView
      {...result}
      roles={roles}
      onUpdateAction={updateUserAction}
      onDeleteAction={deleteUserAction}
    />
  );
}

export default async function UserTable({ page, pageSize, roles }: UserTableProps) {
  return (
    <Suspense key={page} fallback={<UserTableSkeleton />}>
      <UserTableData page={page} pageSize={pageSize} roles={roles} />
    </Suspense>
  );
}
