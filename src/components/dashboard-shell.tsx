"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/breadcrumbs";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex h-14 items-center gap-2 border-b bg-background px-4 sticky top-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <AppBreadcrumbs />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
