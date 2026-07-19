import * as userQuery from "@/features/user/user-query";
import { UserTable } from "@/features/user/components/user-table";
import { updateUserAction, deleteUserAction } from "@/features/user/user-action";

type UserTableServerProps = {
  page: number;
  pageSize: number;
};

export async function UserTableServer({
  page,
  pageSize,
}: UserTableServerProps) {
  const result = await userQuery.getUsersPaginated(page, pageSize);

  return (
    <UserTable
      {...result}
      onUpdateAction={updateUserAction}
      onDeleteAction={deleteUserAction}
    />
  );
}
