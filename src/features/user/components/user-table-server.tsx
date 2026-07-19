import * as userQuery from "@/features/user/user-query";
import { UserTable } from "@/features/user/components/user-table";

type UserTableServerProps = {
  page: Promise<number | undefined>;
  pageSize: Promise<number | undefined>;
};

export async function UserTableServer({
  page,
  pageSize,
}: UserTableServerProps) {
  const { data: users } = await userQuery.findPaginated(
    await page,
    await pageSize,
  );

  return <UserTable users={users} />;
}
