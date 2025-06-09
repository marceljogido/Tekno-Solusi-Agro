import { db } from "@/db";
import { mediaLocations } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get table structure
    const tableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'media_locations'
      ORDER BY ordinal_position;
    `);

    // Get sample data
    const sampleData = await db.select().from(mediaLocations).limit(5);

    return NextResponse.json({
      tableStructure: tableInfo,
      sampleData: sampleData
    });
  } catch (error) {
    console.error("Error fetching table info:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 