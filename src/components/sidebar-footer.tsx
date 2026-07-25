import { SidebarFooter } from "@/components/ui/sidebar";
import UserNav from "@/components/user-nav";

export function AppSidebarFooter() {
  return (
    <SidebarFooter className="border-t">
      <UserNav />
    </SidebarFooter>
  );
}
