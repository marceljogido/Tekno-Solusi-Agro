import { db } from "@/db";
import { plantings } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { crops } from "@/db/schema";
import { mediaLocations } from "@/db/schema";

// DELETE /api/plantings/[id] - Delete planting
export async function DELETE(request, { params }) {
  console.log("API /api/plantings/[id] DELETE endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (DELETE):", user);
    if (!user) {
      console.log("User not authenticated for DELETE");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    console.log("Attempting to delete planting with id:", id);
    if (isNaN(id)) {
      console.log("Invalid ID format:", params.id);
      return NextResponse.json(
        { error: "Invalid planting ID" },
        { status: 400 }
      );
    }

    // Delete planting where id matches and createdBy is the current user
    const [deletedPlanting] = await db
      .delete(plantings)
      .where(and(
        eq(plantings.id, id),
        eq(plantings.createdBy, user.id)
      ))
      .returning();

    console.log("Delete result:", deletedPlanting);

    if (!deletedPlanting) {
      console.log("Planting not found for delete or user not authorized");
      return NextResponse.json(
        { error: "Planting not found or you are not authorized to delete this planting" },
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

// GET /api/plantings/[id] - Get specific planting by ID
export async function GET(request, { params }) {
  console.log("API /api/plantings/[id] GET endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (GET):", user);
    if (!user) {
      console.log("User not authenticated for GET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const plantingId = Number(id);
    console.log("Attempting to fetch planting with ID:", plantingId);
    if (isNaN(plantingId)) {
      console.log("Invalid ID format:", id);
      return NextResponse.json({ error: "Invalid planting ID" }, { status: 400 });
    }

    const planting = await db.select()
      .from(plantings)
      .where(and(
        eq(plantings.id, plantingId),
        eq(plantings.createdBy, user.id)
      ))
      .then(rows => rows[0]);

    console.log("Found planting for GET:", planting);

    if (!planting) {
      console.log("Planting not found for GET or user not authorized");
      return NextResponse.json({ error: "Planting not found" }, { status: 404 });
    }

    // If we have a planting, fetch related data separately
    const crop = planting.cropId ? await db.select()
      .from(crops)
      .where(eq(crops.id, planting.cropId))
      .then(rows => rows[0]) : null;

    const location = planting.locationId ? await db.select()
      .from(mediaLocations)
      .where(eq(mediaLocations.id, planting.locationId))
      .then(rows => rows[0]) : null;

    // Combine the data
    const result = {
      ...planting,
      crop,
      location
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching planting:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/plantings/[id] - Update planting by ID
export async function PUT(request, { params }) {
  console.log("API /api/plantings/[id] PUT endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session (PUT):", user);
    if (!user) {
      console.log("User not authenticated for PUT");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    console.log("Attempting to update planting with ID:", id);
    if (isNaN(id)) {
      console.log("Invalid ID format:", params.id);
      return NextResponse.json({ error: "Invalid planting ID" }, { status: 400 });
    }

    const data = await request.json();
    console.log("Received data for PUT:", data);

     // Convert string numbers to actual numbers
     const numericFields = [
      'plantingQuantity', 'plantSpacing', 'rowSpacing', 'rowLength',
      'numberOfRows', 'estimatedYield', 'estimatedProfit'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = parseFloat(data[field]);
      } else {
        // Set to 0 or null based on schema nullable constraint
        data[field] = 0; // Assuming 0 is acceptable for numeric fields
      }
    });

    // Prepare update data, excluding id and createdBy/createdAt
    const updateData = {
      cropId: parseInt(data.crop_id), // Ensure integer
      locationId: parseInt(data.location_id), // Ensure integer
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
      updatedBy: user.id, // Update updatedBy
      updatedAt: new Date() // Update updatedAt
    };

    console.log("Final planting data for update:", updateData);

    // Perform the update, ensuring the planting belongs to the user
    const [updatedPlanting] = await db
      .update(plantings)
      .set(updateData)
      .where(and(
        eq(plantings.id, id),
        eq(plantings.createdBy, user.id)
      ))
      .returning();

    console.log("Update result:", updatedPlanting);

    if (!updatedPlanting) {
      console.log("Planting not found for update or user not authorized");
      return NextResponse.json(
        { error: "Planting not found or you are not authorized to update this planting" },
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