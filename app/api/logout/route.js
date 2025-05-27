import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("session_user_id", "", { maxAge: 0 }); // Hapus cookie sesi
  return response;
}
