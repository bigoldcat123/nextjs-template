import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";
export async function getUserByUsername(username: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (user) {
      return user;
    }
  } catch (e) {
    console.error(e);
  }
}
