import { db } from "@/db";
import { mediaLocations } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// GET /api/media_locations - Get all media locations
export async function GET(request) {
  try {
    const user = await getUserFromSession();
    console.log("User from session:", user);
    if (!user) {
      console.log("No user found in session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // First, let's check all media locations
    const allMediaLocations = await db
      .select()
      .from(mediaLocations);
    
    console.log("All media locations in database:", allMediaLocations);

    // Then get user's media locations
    const userMediaLocations = await db
      .select()
      .from(mediaLocations)
      .where(eq(mediaLocations.createdBy, user.id));

    console.log("User's media locations:", userMediaLocations);
    return NextResponse.json(userMediaLocations);
  } catch (error) {
    console.error("Error fetching media locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/media_locations - Create new media location
export async function POST(request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Convert and validate numeric fields
    const convertToNumber = (value) => {
      if (value === null || value === undefined || value === '') return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Convert and validate decimal fields
    const convertToDecimal = (value) => {
      if (value === null || value === undefined || value === '') return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Convert snake_case to camelCase for database fields
    const mediaData = {
      name: data.name,
      internalId: data.internal_id || data.internalId,
      electronicId: data.electronic_id || data.electronicId,
      locationType: data.location_type || data.locationType,
      plantingFormat: data.planting_format || data.plantingFormat,
      numberOfBeds: convertToNumber(data.number_of_beds || data.numberOfBeds),
      bedLength: convertToDecimal(data.bed_length || data.bedLength),
      bedWidth: convertToDecimal(data.bed_width || data.bedWidth),
      panjangLahan: convertToDecimal(data.panjang_lahan || data.panjangLahan),
      lebarLahan: convertToDecimal(data.lebar_lahan || data.lebarLahan),
      lebarLegowo: convertToDecimal(data.lebar_legowo || data.lebarLegowo),
      jarakAntarTanaman: convertToDecimal(data.jarak_antar_tanaman || data.jarakAntarTanaman),
      jarakAntarBaris: convertToDecimal(data.jarak_antar_baris || data.jarakAntarBaris),
      jumlahBarisPerLegowo: convertToNumber(data.jumlah_baris_per_legowo || data.jumlahBarisPerLegowo),
      luasTotalBedengan: convertToDecimal(data.luas_total_bedengan || data.luasTotalBedengan),
      luasTotalJajarLegowo: convertToDecimal(data.luas_total_jajar_legowo || data.luasTotalJajarLegowo),
      pricePerM2: convertToDecimal(data.price_per_m2 || data.pricePerM2),
      area: convertToDecimal(data.area),
      estimatedLandValue: convertToDecimal(data.estimated_land_value || data.estimatedLandValue),
      status: data.status,
      lightProfile: data.light_profile || data.lightProfile,
      grazingRestDays: convertToNumber(data.grazing_rest_days || data.grazingRestDays),
      description: data.description,
      geometry: data.geometry ? JSON.stringify(data.geometry) : null,
      createdAt: new Date(),
      createdBy: user.id,
      updatedAt: new Date(),
      updatedBy: user.id
    };

    console.log("Prepared media data for insert:", mediaData);

    const [newMediaLocation] = await db
      .insert(mediaLocations)
      .values(mediaData)
      .returning();

    return NextResponse.json(newMediaLocation);
  } catch (error) {
    console.error("Error creating media location:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 