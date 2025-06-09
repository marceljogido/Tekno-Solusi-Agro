import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("session_user_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ 
        authenticated: false,
        error: "No session found" 
      }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(sessionId)),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        error: "User not found" 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error checking auth:", error);
    return NextResponse.json({ 
      authenticated: false,
      error: "Error checking authentication" 
    }, { status: 500 });
  }
} 