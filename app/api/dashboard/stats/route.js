import { db } from "@/db";
import { mediaLocations, crops, plantings } from "@/db/schema";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 1. Luas lahan: SUM(area) dari mediaLocations yang locationType = 'Lahan' milik user
    const totalLandResult = await db
      .select({
        totalArea: sql`CAST(COALESCE(SUM(${mediaLocations.area}), 0) AS FLOAT)`
      })
      .from(mediaLocations)
      .where(and(
        eq(mediaLocations.createdBy, user.id),
        eq(mediaLocations.locationType, 'Lahan')
      ));
    const totalLand = Number(totalLandResult[0]?.totalArea || 0);

    // 2. Pendapatan: SUM(estimatedProfit) dari plantings milik user
    const revenueResult = await db
      .select({
        totalRevenue: sql`CAST(COALESCE(SUM(${plantings.estimatedProfit}), 0) AS FLOAT)`
      })
      .from(plantings)
      .where(eq(plantings.createdBy, user.id));
    const totalRevenue = Number(revenueResult[0]?.totalRevenue || 0);

    // 3. Lahan yang ditanam: SUM(area) dari mediaLocations yang di-relasi-kan ke plantings status 'active' milik user
    const plantedLandResult = await db
      .select({
        totalPlantedArea: sql`CAST(COALESCE(SUM(${mediaLocations.area}), 0) AS FLOAT)`
      })
      .from(plantings)
      .leftJoin(mediaLocations, eq(plantings.locationId, mediaLocations.id))
      .where(and(
        eq(plantings.createdBy, user.id),
        eq(plantings.status, 'active'),
        eq(mediaLocations.locationType, 'Lahan')
      ));
    const totalPlantedArea = Number(plantedLandResult[0]?.totalPlantedArea || 0);

    // 4. Jenis tanaman: GROUP BY crop.name, SUM(plantingQuantity) dari plantings milik user
    const cropStats = await db
      .select({
        name: crops.name,
        totalQuantity: sql`CAST(COALESCE(SUM(${plantings.plantingQuantity}), 0) AS FLOAT)`
      })
      .from(plantings)
      .leftJoin(crops, eq(plantings.cropId, crops.id))
      .where(eq(plantings.createdBy, user.id))
      .groupBy(crops.name);

    // Persentase lahan yang ditanam
    const plantedPercentage = totalLand > 0 ? Math.round((totalPlantedArea / totalLand) * 100) : 0;

    return NextResponse.json({
      totalLand: {
        area: totalLand
      },
      revenue: totalRevenue,
      landUsage: {
        planted: totalPlantedArea,
        percentage: plantedPercentage
      },
      crops: cropStats.map(crop => ({
        ...crop,
        totalQuantity: Number(crop.totalQuantity || 0)
      }))
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 