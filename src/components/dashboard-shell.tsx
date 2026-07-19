"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex h-14 items-center border-b px-4">
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
