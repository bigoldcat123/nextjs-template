import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";

export default async function Home() {
  const session = await auth();
  return (
    <>
      HELLO {JSON.stringify(session?.user.name)} <SignOut></SignOut>
    </>
  );
}
