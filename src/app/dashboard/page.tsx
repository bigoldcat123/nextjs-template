import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
import ModeToggle from "@/components/theme-toogle";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <div className="shimmer shimmer-color-amber-500">
        <div>
          <ModeToggle />
        </div>
        HELLO {JSON.stringify(session?.user)} <SignOut></SignOut>
      </div>
    </>
  );
}
