"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, Monitor, UserPen, KeyRound } from "lucide-react";
import { ProfileDialog } from "@/components/profile-dialog";
import { ChangePasswordDialog } from "@/components/change-password-dialog";

export function UserNav() {
  const { data: session } = useSession();
  const { setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
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
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{userName}</span>
              {user?.email && (
                <span className="text-xs text-muted-foreground">{user.email}</span>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
          <UserPen className="mr-2 size-4" />
          <span>修改个人信息</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
          <KeyRound className="mr-2 size-4" />
          <span>修改密码</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4" />
          <span>浅色模式</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4" />
          <span>深色模式</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 size-4" />
          <span>跟随系统</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 size-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ProfileDialog open={profileOpen} onOpenChangeAction={setProfileOpen} />
      <ChangePasswordDialog open={passwordOpen} onOpenChangeAction={setPasswordOpen} />
    </DropdownMenu>
  );
}
