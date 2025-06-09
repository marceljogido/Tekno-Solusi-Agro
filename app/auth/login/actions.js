"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// 🔐 You can change the cookie name as needed
const SESSION_COOKIE_NAME = "session_user_id";

export async function login(_, formData) {
  const email = formData.get("email")?.toLowerCase().trim();
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: "Email not found." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Incorrect password." };
  }

  // ✅ Store session ID in a cookie (user ID)
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, String(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}
