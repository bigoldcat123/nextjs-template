import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";
export async function getUserByUsername(username: string) {
  try {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (res.length != 0) {
      return res[0];
    }
  } catch (e) {
    console.error(e);
  }
}
