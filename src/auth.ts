import NextAuth, { DefaultSession } from "next-auth";
import { credentials } from "./auth-providers/credential";
import { db } from "./db";
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      name: string;
      id: string;
      displayname: string;
      image: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [credentials],
  callbacks: {
    async authorized({ auth }) {
      // if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const session = auth?.user;
      if (!session) {
        return false;
      }
      // }

      return true;
    },
    async session({ session, token }) {
      // this is called every time you fetch the currentUserInfo, such as await auth on server or useAuth on client.
      const user = await db.query.users.findFirst({ where: { id: token.sub } });
      if (!user) {
        return session;
      }

      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          name: user.username,
          displayname: user.displayName,
          image: user.profile,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
});
