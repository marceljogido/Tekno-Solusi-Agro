import { db } from "@/db";
import { mediaLocations } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { plantings } from "@/db/schema";

// GET /api/media_locations/[id] - Get specific media location
export async function GET(request, { params }) {
  try {
    const user = await getUserFromSession();
    console.log("User from session:", user);
    if (!user) {
      console.log("No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    console.log("Attempting to fetch media location with ID:", id);
    if (isNaN(id)) {
      console.log("Invalid ID provided:", params.id);
      return NextResponse.json({ error: "Invalid media location ID" }, { status: 400 });
    }

    const mediaLocation = await db
      .select()
      .from(mediaLocations)
      .where(eq(mediaLocations.id, id))
      .limit(1);

    console.log("Found media location:", mediaLocation);

    if (!mediaLocation || mediaLocation.length === 0) {
      console.log("Media location not found");
      return NextResponse.json({ error: "Media location not found" }, { status: 404 });
    }

    return NextResponse.json(mediaLocation[0]);
  } catch (error) {
    console.error("Error fetching media location:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/media_locations/[id] - Update media location
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromSession();
    console.log("User from session:", user);
    if (!user) {
      console.log("No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    console.log("Attempting to update media location with ID:", id);
    if (isNaN(id)) {
      console.log("Invalid ID provided:", params.id);
      return NextResponse.json({ error: "Invalid media location ID" }, { status: 400 });
    }

    // First check if the media location exists
    const existingMedia = await db
      .select()
      .from(mediaLocations)
      .where(eq(mediaLocations.id, id))
      .limit(1);

    console.log("Full media location data:", JSON.stringify(existingMedia[0], null, 2));
    console.log("Media createdBy value:", existingMedia[0].createdBy);

    if (!existingMedia || existingMedia.length === 0) {
      console.log("Media location not found");
      return NextResponse.json({ error: "Media location not found" }, { status: 404 });
    }

    // Convert both IDs to numbers for comparison
    const mediaCreatedBy = Number(existingMedia[0].createdBy);
    const currentUserId = Number(user.id);
    
    console.log("Media createdBy (converted):", mediaCreatedBy);
    console.log("Current user ID (converted):", currentUserId);
    console.log("Media createdBy type:", typeof mediaCreatedBy);
    console.log("Current user ID type:", typeof currentUserId);
    console.log("Are IDs equal?", mediaCreatedBy === currentUserId);

    // Check if the media location belongs to the current user
    if (mediaCreatedBy !== currentUserId) {
      console.log("Media location belongs to different user. Media createdBy:", mediaCreatedBy, "Current user:", currentUserId);
      return NextResponse.json({ error: "You are not authorized to modify this media location" }, { status: 403 });
    }

    const data = await request.json();
    console.log("Received update data:", data);
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
      updatedAt: new Date(),
      updatedBy: currentUserId
    };

    console.log("Prepared media data for update:", mediaData);

    const [updatedMediaLocation] = await db
      .update(mediaLocations)
      .set(mediaData)
      .where(and(
        eq(mediaLocations.id, id),
        eq(mediaLocations.createdBy, currentUserId)
      ))
      .returning();

    console.log("Update result:", updatedMediaLocation);

    if (!updatedMediaLocation) {
      console.log("Update failed - no rows affected");
      return NextResponse.json(
        { error: "Failed to update media location" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedMediaLocation);
  } catch (error) {
    console.error("Error updating media location:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/media_locations/[id] - Delete media location
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid media location ID" }, { status: 400 });
    }

    // Check if the media location exists and belongs to the user
    const existingMedia = await db.query.mediaLocations.findFirst({
      where: eq(mediaLocations.id, id)
    });

    if (!existingMedia) {
      return NextResponse.json({ error: "Media location not found" }, { status: 404 });
    }

    if (existingMedia.createdBy !== user.id) {
      return NextResponse.json({ error: "You are not authorized to delete this media location" }, { status: 403 });
    }

    // Check for related plantings
    const relatedPlantings = await db.query.plantings.findMany({
      where: eq(plantings.locationId, id)
    });

    if (relatedPlantings && relatedPlantings.length > 0) {
      return NextResponse.json({ 
        error: "Cannot delete media location because it has active plantings",
        plantingsCount: relatedPlantings.length
      }, { status: 400 });
    }

    // Delete the media location
    const deletedMediaLocation = await db
      .delete(mediaLocations)
      .where(eq(mediaLocations.id, id))
      .returning();

    if (!deletedMediaLocation || deletedMediaLocation.length === 0) {
      return NextResponse.json({ error: "Failed to delete media location" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Media location deleted successfully",
      deletedMedia: deletedMediaLocation[0]
    });

  } catch (error) {
    console.error("Error deleting media location:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
} 