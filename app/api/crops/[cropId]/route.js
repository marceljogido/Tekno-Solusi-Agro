import { db } from '@/db';
import { crops } from '@/db/schema';
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