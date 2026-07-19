import * as userQuery from "@/features/user/user-query";
import { UserTable } from "@/features/user/components/user-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "./pagination-bar";

type UserTableServerProps = {
  page: number;
  pageSize: number;
};

export async function UserTableServer({
  page,
  pageSize,
}: UserTableServerProps) {
  const result = await userQuery.findPaginated(page, pageSize);

  return <UserTable {...result} />;
}
