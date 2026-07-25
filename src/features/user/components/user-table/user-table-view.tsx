"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { UserFormDialog } from "../user-form-dialog";
import { UserDeleteDialog } from "./user-delete-dialog";
import { deleteUserAction, updateUserAction } from "../../user-action";

type User = {
  id: string;
  username: string;
  email: string | null;
  displayName: string;
  profile: string | null;
  createdAt: Date;
  roles: { id: string; name: string }[];
};

type UserTableViewProps = {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  roles: { id: string; name: string }[];
  onUpdateAction: typeof updateUserAction;
  onDeleteAction: typeof deleteUserAction;
};

export function UserTableView({
  data,
  roles,
  onUpdateAction,
  onDeleteAction,
}: UserTableViewProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>用户名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>注册时间</TableHead>
            <TableHead className="w-12">操作</TableHead>
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
                <TableCell>
                  {user.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" />}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 size-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserFormDialog
          key={selectedUser.id}
          open={editOpen}
          onOpenChangeAction={setEditOpen}
          onSubmitAction={onUpdateAction}
          roles={roles}
          initialData={{
            username: selectedUser.username,
            email: selectedUser.email || undefined,
            displayName: selectedUser.displayName,
            id: selectedUser.id,
            roleIds: selectedUser.roles.map((r) => r.id),
          }}
        />
      )}

      {selectedUser && (
        <UserDeleteDialog
          open={deleteOpen}
          onOpenChangeAction={setDeleteOpen}
          onConfirmAction={onDeleteAction}
          username={selectedUser.username}
          userId={selectedUser.id}
        />
      )}
    </>
  );
}
