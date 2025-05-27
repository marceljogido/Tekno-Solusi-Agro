"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function register(prevState, formData) {
  const firstName = formData.get("firstName")?.trim();
  const lastName = formData.get("lastName")?.trim();
  const email = formData.get("email")?.toLowerCase().trim();
  const password = formData.get("password");

  const errors = {};

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  if (!password) errors.password = "Password is required.";
  else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      errors: { email: "Email is already registered." },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  redirect("/login");
}
