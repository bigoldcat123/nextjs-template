import * as userQuery from "@/features/user/user-query";
import { UserTable } from "@/features/user/components/user-table";
import { updateUser, deleteUser } from "@/features/user/user-action";

type UserTableServerProps = {
  page: number;
  pageSize: number;
};

export async function UserTableServer({
  page,
  pageSize,
}: UserTableServerProps) {
  const result = await userQuery.findPaginated(page, pageSize);

  return (
    <UserTable
      {...result}
      onUpdateAction={updateUser}
      onDeleteAction={deleteUser}
    />
  );
}
