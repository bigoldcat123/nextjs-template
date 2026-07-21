import { roleService } from "@/features/role/role-service";

const res = await roleService.getRoleGraph(
  "c7410941-1437-41e0-8eb0-5ab45387c8af",
);
console.log(res);
