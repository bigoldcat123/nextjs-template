import "server-only";
import { db } from "@/db";

export async function getUserByUsername(username: string) {
  return db.query.users.findFirst({ where: { username } });
}
