import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationBar } from "./pagination-bar";

type User = {
  id: string;
  username: string;
  email: string | null;
  displayName: string;
  profile: string | null;
  createdAt: Date;
};

type UserTableProps = {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function UserTable({
  data,
  total,
  page,
  pageSize,
  totalPages,
}: UserTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>用户名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>注册时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => {
            const initials = user.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.profile || ""}
                        alt={user.displayName}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.displayName}</span>
                  </div>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
      />
    </div>
  );
}
