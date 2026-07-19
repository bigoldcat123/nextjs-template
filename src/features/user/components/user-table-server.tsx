import * as userQuery from "@/features/user/user-query";
import { UserTable } from "@/features/user/components/user-table";

type UserTableServerProps = {
  page?: number;
  pageSize?: number;
};

export async function UserTableServer({
  page = 1,
  pageSize = 10,
}: UserTableServerProps) {
  const { data: users } = await userQuery.findPaginated(page, pageSize);

  return <UserTable users={users} />;
}
