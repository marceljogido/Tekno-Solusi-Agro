import { db } from "@/db";
import { crops } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/crops - Get all crops
export async function GET() {
  console.log("API /api/crops GET endpoint called");
  try {
    const user = await getUserFromSession();
    console.log("User from session:", user);
    if (!user) {
      console.log("User not authenticated for GET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Attempting to fetch crops from DB...");
    try {
      // Select specific fields from crops table
      const allCrops = await db.select({
        id: crops.id,
        name: crops.name,
        variety: crops.variety,
        startMethod: crops.startMethod,
        germinationRate: crops.germinationRate,
        seedPerCell: crops.seedPerCell,
        lightProfile: crops.lightProfile,
        soilCondition: crops.soilCondition,
        daysToEmerge: crops.daysToEmerge,
        plantSpacing: crops.plantSpacing,
        rowSpacing: crops.rowSpacing,
        plantingDepth: crops.plantingDepth,
        averageHeight: crops.averageHeight,
        daysToFlower: crops.daysToFlower,
        daysToMaturity: crops.daysToMaturity,
        harvestWindow: crops.harvestWindow,
        lossRate: crops.lossRate,
        harvestUnit: crops.harvestUnit,
        estimatedRevenue: crops.estimatedRevenue,
        expectedYield: crops.expectedYield,
        plantingDetails: crops.plantingDetails,
        pruningDetails: crops.pruningDetails,
        isPerennial: crops.isPerennial,
        autoCreateTasks: crops.autoCreateTasks,
        createdAt: crops.createdAt,
        updatedAt: crops.updatedAt,
        createdBy: crops.createdBy,
        updatedBy: crops.updatedBy,
      })
      .from(crops)
      .where(eq(crops.createdBy, user.id));

      console.log("Successfully fetched crops:", allCrops);
      console.log("User ID:", user.id);
      console.log("Number of crops found:", allCrops.length);
      return NextResponse.json(allCrops);
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
    console.error("Error fetching crops:", error);
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

// POST /api/crops - Create new crop
export async function POST(request) {
  console.log("API /api/crops POST endpoint called");
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
      'germinationRate', 'seedPerCell', 'daysToEmerge', 'plantSpacing',
      'rowSpacing', 'plantingDepth', 'averageHeight', 'daysToFlower',
      'daysToMaturity', 'harvestWindow', 'lossRate', 'estimatedRevenue',
      'expectedYield'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = parseFloat(data[field]);
      } else {
        data[field] = null;
      }
    });
    console.log("Processed numeric data for POST:", data);

    // Add audit fields and ensure required fields have values
    const cropData = {
      name: data.name || data.cropType || '', // Use name if provided, fallback to cropType
      cropType: data.cropType || '',
      variety: data.variety || '',
      startMethod: data.startMethod || '',
      germinationRate: data.germinationRate,
      seedPerCell: data.seedPerCell,
      lightProfile: data.lightProfile || '',
      soilCondition: data.soilCondition || '',
      daysToEmerge: data.daysToEmerge,
      plantSpacing: data.plantSpacing,
      rowSpacing: data.rowSpacing,
      plantingDepth: data.plantingDepth,
      averageHeight: data.averageHeight,
      daysToFlower: data.daysToFlower,
      daysToMaturity: data.daysToMaturity,
      harvestWindow: data.harvestWindow,
      lossRate: data.lossRate,
      harvestUnit: data.harvestUnit || '',
      estimatedRevenue: data.estimatedRevenue,
      expectedYield: data.expectedYield,
      description: data.description || '',
      botanicalName: data.botanicalName || '',
      isPerennial: data.isPerennial === true,
      autoCreateTasks: data.autoCreateTasks === true,
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Final crop data for insert:", cropData);
    const [newCrop] = await db.insert(crops).values(cropData).returning();
    console.log("New crop inserted:", newCrop);
    return NextResponse.json(newCrop, { status: 201 });
  } catch (error) {
    console.error("Error creating crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/crops - Update crop
export async function PUT(request) {
  console.log("API /api/crops PUT endpoint called");
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
        { error: "Crop ID is required" },
        { status: 400 }
      );
    }

    // Convert string numbers to actual numbers
    const numericFields = [
      'germinationRate', 'seedPerCell', 'daysToEmerge', 'plantSpacing',
      'rowSpacing', 'plantingDepth', 'averageHeight', 'daysToFlower',
      'daysToMaturity', 'harvestWindow', 'lossRate', 'estimatedRevenue',
      'expectedYieldPer3048m', 'expectedYieldPerHectare'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        data[field] = parseFloat(data[field]);
      } else {
        data[field] = 0;
      }
    });
    console.log("Processed numeric data for PUT:", data);

    // Add audit fields
    const cropData = {
      ...data,
      updatedBy: user.id,
      updatedAt: new Date()
    };

    // Remove id from cropData as it's used in the where clause
    const { id, ...updateData } = cropData;

    console.log("Final crop data for update:", updateData);
    console.log("Updating crop with ID:", id);

    const [updatedCrop] = await db
      .update(crops)
      .set(updateData)
      .where(eq(crops.id, parseInt(id)))
      .returning();

    console.log("Update result:", updatedCrop);

    if (!updatedCrop) {
      console.log("Crop not found for update");
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCrop);
  } catch (error) {
    console.error("Error updating crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/crops/:id - Delete crop
export async function DELETE(request, { params }) {
  console.log("API /api/crops/:id DELETE endpoint called");
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

    console.log("Attempting to delete crop with id:", id);
    const [deletedCrop] = await db
      .delete(crops)
      .where(eq(crops.id, id))
      .returning();

    console.log("Delete result:", deletedCrop);

    if (!deletedCrop) {
      console.log("Crop not found for delete");
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    console.log("Crop deleted successfully:", deletedCrop);
    return NextResponse.json({ message: "Crop deleted successfully", crop: deletedCrop });
  } catch (error) {
    console.error("Error deleting crop:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 