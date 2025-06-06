import { db } from '@/db';
import { crops, plantings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getUserFromSession } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { cropId } = params;
    if (!cropId) {
      return new Response(JSON.stringify({ error: 'Crop ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const crop = await db.query.crops.findFirst({
      where: eq(crops.id, parseInt(cropId))
    });

    if (!crop) {
      return new Response(JSON.stringify({ error: 'Crop not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(crop), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching crop:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { cropId } = params;
    if (!cropId) {
      return new Response(JSON.stringify({ error: 'Crop ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if there are any plantings using this crop
    const existingPlantings = await db.query.plantings.findMany({
      where: eq(plantings.cropId, parseInt(cropId))
    });

    if (existingPlantings && existingPlantings.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Cannot delete crop because it is being used in existing plantings',
        plantingsCount: existingPlantings.length
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const deletedCrop = await db.delete(crops).where(eq(crops.id, parseInt(cropId))).returning();

    if (!deletedCrop || deletedCrop.length === 0) {
      return new Response(JSON.stringify({ error: 'Crop not found or already deleted' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(deletedCrop[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting crop:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 