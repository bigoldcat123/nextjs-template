"use client";

import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/sidebar-header";
import { AppSidebarContent } from "@/components/sidebar-content";
import { AppSidebarFooter } from "@/components/sidebar-footer";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
