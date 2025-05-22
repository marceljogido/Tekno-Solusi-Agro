import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_user_id")?.value;

  if (!sessionId) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(sessionId)),
  });

  return user;
}
