import { db } from "@/db";
import { getUserPermissions } from "@/features/access-control/access-control-query";
import { getUserByUsername } from "@/features/user/user-query";

const p = await getUserPermissions(
  (await getUserByUsername("alice"))?.id ?? "",
);
console.log(p);
