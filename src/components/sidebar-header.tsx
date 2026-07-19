import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="flex h-14 items-center border-b px-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton render={<Link href="/dashboard" />}>
            <Image src={"/next.svg"} width={50} height={50} alt="" className="h-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
