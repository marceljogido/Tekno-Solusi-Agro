import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const value = searchParams.get("value");

  const exists = await db
    .select()
    .from(media)
    .where(eq(media.internalId, value))
    .limit(1);

  return NextResponse.json({ exists: exists.length > 0 });
}
