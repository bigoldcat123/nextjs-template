import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import { string, z } from "zod";
const userSchema = z.object({
  username: string(),
  password: string(),
});
export const credentials = Credentials({
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  credentials: {
    username: {
      label: "Username",
      placeholder: "please input user name",
      type: "text",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*******",
    },
  },
  authorize: async (credentials) => {
    const credentialsParsed = await userSchema.parseAsync(credentials);
    const user = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.username, credentialsParsed.username),
          eq(usersTable.password, credentialsParsed.password),
        ),
      );
    if (user.length == 0) {
      // No user found, so this is their first attempt to login
      // Optionally, this is also the place you could do a user registration
      throw new Error("Invalid credentials.");
    }

    // return user object with their profile data
    return { id: "id" + user[0].id.toString(), name: user[0].username,email:"1233" };
  },
});
