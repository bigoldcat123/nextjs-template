"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

type RoleTableProps = {
  data: Role[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function RoleTable({ data }: RoleTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>角色名称</TableHead>
          <TableHead>描述</TableHead>
          <TableHead>创建时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {role.description || "-"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(role.createdAt).toLocaleDateString("zh-CN")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
