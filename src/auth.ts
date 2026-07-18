import NextAuth, { DefaultSession } from "next-auth";
import { credentials } from "./auth-providers/credential";

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
      console.log(token);
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
