import { db } from "@/db";
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
    const user = await db.query.users.findFirst({
      where: {
        OR: [
          { username: credentialsParsed.username },
          { password: credentialsParsed.password },
        ],
      },
    });
    if (!user) {
      // No user found, so this is their first attempt to login
      // Optionally, this is also the place you could do a user registration
      throw new Error("Invalid credentials.");
    }

    // return user object with their profile data
    return {
      id: user.id.toString(),
    };
  },
});
