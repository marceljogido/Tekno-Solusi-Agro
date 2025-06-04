import { db } from "@/db";
import { plantings } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { crops } from "@/db/schema";
import { mediaLocations } from "@/db/schema";

// GET /api/plantings - Get all plantings
export async function GET() {
  console.log("API /api/plantings GET endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session:", user);
    if (!user) {
      console.log("User not authenticated for GET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to fetch plantings from DB...");
    try {
      const allPlantings = await db.select({
        id: plantings.id,
        cropId: plantings.cropId,
        locationId: plantings.locationId,
        plantingQuantity: plantings.plantingQuantity,
        plantingMethod: plantings.plantingMethod,
        plantingDate: plantings.plantingDate,
        seedingDate: plantings.seedingDate,
        plantSpacing: plantings.plantSpacing,
        rowSpacing: plantings.rowSpacing,
        rowLength: plantings.rowLength,
        numberOfRows: plantings.numberOfRows,
        electronicId: plantings.electronicId,
        currentlyPlanted: plantings.currentlyPlanted,
        harvestPlan: plantings.harvestPlan,
        estimatedYield: plantings.estimatedYield,
        estimatedProfit: plantings.estimatedProfit,
        plantingInfo: plantings.plantingInfo,
        status: plantings.status,
        createdAt: plantings.createdAt,
        updatedAt: plantings.updatedAt,
        createdBy: plantings.createdBy,
        updatedBy: plantings.updatedBy,
        crop: {
          name: crops.name,
          variety: crops.variety,
          daysToFlower: crops.daysToFlower,
          daysToMaturity: crops.daysToMaturity,
          harvestWindow: crops.harvestWindow
        },
        location: {
          name: mediaLocations.name,
          locationType: mediaLocations.locationType
        }
      })
      .from(plantings)
      .leftJoin(crops, eq(plantings.cropId, crops.id))
      .leftJoin(mediaLocations, eq(plantings.locationId, mediaLocations.id))
      .where(eq(plantings.createdBy, user.id));

      console.log("Successfully fetched plantings with joins:", allPlantings);
      return NextResponse.json(allPlantings);
    } catch (dbError) {
      console.error("Database error details:", {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        hint: dbError.hint,
        position: dbError.position,
        where: dbError.where,
        schema: dbError.schema,
        table: dbError.table,
        column: dbError.column
      });
      throw dbError;
    }
  } catch (error) {
    console.error("Error fetching plantings:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/plantings - Create new planting
export async function POST(request) {
  console.log("API /api/plantings POST endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (POST):", user);
    if (!user) {
      console.log("User not authenticated for POST");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data for POST:", data);

    // Convert string numbers to actual numbers
    const numericFields = [
      'plantingQuantity', 'plantSpacing', 'rowSpacing', 'rowLength',
      'numberOfRows', 'estimatedYield', 'estimatedProfit'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = parseFloat(data[field]);
      } else {
        data[field] = 0;
      }
    });

    // Add audit fields
    const plantingData = {
      cropId: parseInt(data.crop_id),
      locationId: parseInt(data.location_id),
      plantingQuantity: data.plantingQuantity,
      plantingMethod: data.plantingMethod,
      plantingDate: data.plantingDate ? new Date(data.plantingDate) : null,
      seedingDate: data.seedingDate ? new Date(data.seedingDate) : null,
      plantSpacing: data.plantSpacing,
      rowSpacing: data.rowSpacing,
      rowLength: data.rowLength,
      numberOfRows: data.numberOfRows,
      electronicId: data.electronicId,
      currentlyPlanted: data.currentlyPlanted === true,
      harvestPlan: data.harvestPlan,
      estimatedYield: data.estimatedYield,
      estimatedProfit: data.estimatedProfit,
      plantingInfo: data.plantingInfo,
      status: data.status || 'active',
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Final planting data for insert:", plantingData);
    const [newPlanting] = await db.insert(plantings).values(plantingData).returning();
    console.log("New planting inserted:", newPlanting);
    return NextResponse.json(newPlanting, { status: 201 });
  } catch (error) {
    console.error("Error creating planting:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/plantings - Update planting
export async function PUT(request) {
  console.log("API /api/plantings PUT endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (PUT):", user);
    if (!user) {
      console.log("User not authenticated for PUT");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data for PUT:", data);

    if (!data.id) {
      console.log("No ID provided in request body");
      return NextResponse.json(
        { error: "Planting ID is required" },
        { status: 400 }
      );
    }

    // Convert string numbers to actual numbers
    const numericFields = [
      'plantingQuantity', 'plantSpacing', 'rowSpacing', 'rowLength',
      'numberOfRows', 'estimatedYield', 'estimatedProfit'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = parseFloat(data[field]);
      } else {
        data[field] = 0;
      }
    });

    // Add audit fields
    const plantingData = {
      cropId: data.crop_id,
      locationId: data.location_id,
      plantingQuantity: data.plantingQuantity,
      plantingMethod: data.plantingMethod,
      plantingDate: data.plantingDate ? new Date(data.plantingDate) : null,
      seedingDate: data.seedingDate ? new Date(data.seedingDate) : null,
      plantSpacing: data.plantSpacing,
      rowSpacing: data.rowSpacing,
      rowLength: data.rowLength,
      numberOfRows: data.numberOfRows,
      electronicId: data.electronicId,
      currentlyPlanted: data.currentlyPlanted === true,
      harvestPlan: data.harvestPlan,
      estimatedYield: data.estimatedYield,
      estimatedProfit: data.estimatedProfit,
      plantingInfo: data.plantingInfo,
      status: data.status || 'active',
      updatedBy: user.id,
      updatedAt: new Date()
    };

    // Remove id from plantingData as it's used in the where clause
    const { id, ...updateData } = plantingData;

    console.log("Final planting data for update:", updateData);
    console.log("Updating planting with ID:", id);

    const [updatedPlanting] = await db
      .update(plantings)
      .set(updateData)
      .where(eq(plantings.id, parseInt(id)))
      .returning();

    console.log("Update result:", updatedPlanting);

    if (!updatedPlanting) {
      console.log("Planting not found for update");
      return NextResponse.json(
        { error: "Planting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPlanting);
  } catch (error) {
    console.error("Error updating planting:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/plantings - Delete planting
export async function DELETE(request) {
  console.log("API /api/plantings DELETE endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (DELETE):", user);
    if (!user) {
      console.log("User not authenticated for DELETE");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    console.log("Extracted ID from URL:", id);

    if (!id || isNaN(parseInt(id))) {
      console.log("Invalid ID format:", id);
      return NextResponse.json(
        { error: "Invalid planting ID" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete planting with id:", id);
    const [deletedPlanting] = await db
      .delete(plantings)
      .where(eq(plantings.id, parseInt(id)))
      .returning();

    console.log("Delete result:", deletedPlanting);

    if (!deletedPlanting) {
      console.log("Planting not found for delete");
      return NextResponse.json(
        { error: "Planting not found" },
        { status: 404 }
      );
    }

    console.log("Planting deleted successfully:", deletedPlanting);
    return NextResponse.json({ message: "Planting deleted successfully", planting: deletedPlanting });
  } catch (error) {
    console.error("Error deleting planting:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 