import { getCurrentUser } from "@/features/user/user-query";
import { UserNavView } from "./user-nav-view";

export default async function UserNav() {
  const user = await getCurrentUser();

  return (
    <UserNavView
      userName={user?.name || user?.email || "User"}
      userImage={user?.image || ""}
      userEmail={user?.email}
      userDisplayname={user?.displayname}
    />
  );
}
