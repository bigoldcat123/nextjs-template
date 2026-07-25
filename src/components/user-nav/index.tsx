import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/features/user/user-query";
import { UserNavView } from "./user-nav-view";

async function UserNavData() {
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

function UserNavSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function UserNav() {
  return (
    <Suspense fallback={<UserNavSkeleton />}>
      <UserNavData />
    </Suspense>
  );
}
