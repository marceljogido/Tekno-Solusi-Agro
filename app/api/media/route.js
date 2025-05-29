import { db } from "@/db";
import { media, mediaPolygon } from "@/db/schema";
import { NextResponse } from "next/server";

// ✅ Helper untuk konversi ke integer/null
const parseIntOrNull = (value) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const mediaData = body.media;
    const polygon = body.polygon;

    // ✅ Insert ke tabel media
    const insertedMedia = await db
      .insert(media)
      .values({
        name: mediaData.name,
        internalId: mediaData.internalId,
        type: mediaData.type,
        jumlahBedengan: parseIntOrNull(mediaData.jumlahBedengan),
        panjangBedengan: parseIntOrNull(mediaData.panjangBedengan),
        lebarBedengan: parseIntOrNull(mediaData.lebarBedengan),
        jarakKelompokLegowo: parseIntOrNull(mediaData.jarakKelompokLegowo),
        jarakDalamLegowo: parseIntOrNull(mediaData.jarakDalamLegowo),
        jarakBarisLegowo: parseIntOrNull(mediaData.jarakBarisLegowo),
        panjangLahan: parseIntOrNull(mediaData.panjangLahan),
        lebarLahan: parseIntOrNull(mediaData.lebarLahan),
        luasLahan: parseIntOrNull(mediaData.luasLahan),
        nilaiTanah: parseIntOrNull(mediaData.nilaiTanah),
        paparan: mediaData.paparan,
        deskripsi: mediaData.deskripsi || null,
      })
      .returning();

    const mediaId = insertedMedia[0].id;

    // ✅ Insert ke tabel polygon
    await db.insert(mediaPolygon).values({
      mediaId,
      area: polygon.area,
      center: polygon.center,
      path: polygon.path,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving media:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const data = await db.query.media.findMany({
      with: {
        polygons: true, // jika ada relasi
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching media:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

