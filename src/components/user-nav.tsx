"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();

  const user = session?.user;
  const userName = user?.name || user?.email || "User";
  const userImage = user?.image || "";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />}
      >
        <Avatar className="size-8">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium">{userName}</span>
          {user?.email && (
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{userName}</span>
            {user?.email && (
              <span className="text-xs text-muted-foreground">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full cursor-pointer items-center"
            />
          }
        >
          <LogOut className="mr-2 size-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
