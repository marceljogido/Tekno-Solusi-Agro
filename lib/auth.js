import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserFromSession() {
  try {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_user_id")?.value;

    if (!sessionId) {
      console.log("No session ID found in cookies");
      return null;
    }

    console.log("Found session ID:", sessionId);
    const user = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      address: users.address,
      phone: users.phone,
      profileImage: users.profileImage,
      backgroundImage: users.backgroundImage,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, Number(sessionId)))
    .then(rows => rows[0]);

    if (!user) {
      console.log("No user found for session ID:", sessionId);
      return null;
    }

    console.log("Found user:", user);
  return user;
  } catch (error) {
    console.error("Error in getUserFromSession:", error);
    return null;
  }
}
