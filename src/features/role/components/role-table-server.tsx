import * as roleQuery from "@/features/role/role-query";
import { RoleTable } from "@/features/role/components/role-table";

type RoleTableServerProps = {
  page: number;
  pageSize: number;
};

export async function RoleTableServer({
  page,
  pageSize,
}: RoleTableServerProps) {
  const result = await roleQuery.getRolesPaginated(page, pageSize);

  return <RoleTable {...result} />;
}
