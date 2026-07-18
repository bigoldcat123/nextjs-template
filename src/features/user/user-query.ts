import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";
export async function getUserByUsername(username: string) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (user) {
      return user;
    }
  } catch (e) {
    console.error(e);
  }
}
