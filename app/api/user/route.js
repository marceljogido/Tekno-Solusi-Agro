import { db } from "@/db";
import { users } from "@/db/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getUserFromSession } from "@/lib/auth";
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  return Response.json({ user });
}

export async function PUT(req) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const role = formData.get('role');
    const address = formData.get('address');
    const profileImageFile = formData.get('profileImageFile');
    const backgroundImageFile = formData.get('backgroundImageFile');

    let profileImageUrl = user.profileImage;
    let backgroundImageUrl = user.backgroundImage;

    // --- TODO: Implementasi Penyimpanan File Fisik --- //
    // Logika untuk menyimpan profileImageFile dan backgroundImageFile di sini.
    // 1. Pastikan file memang ada (profileImageFile/backgroundImageFile bukan null/undefined).
    // 2. Buat nama file unik untuk menghindari konflik.
    // 3. Tentukan direktori penyimpanan yang aman (misalnya di luar folder kode, atau di folder 'public' jika ingin bisa diakses langsung).
    // 4. Gunakan modul 'fs' atau library pihak ketiga untuk menulis file ke disk.
    // 5. Jika penyimpanan berhasil, perbarui profileImageUrl atau backgroundImageUrl dengan URL/path file yang tersimpan.
    //    Contoh: profileImageUrl = `/uploads/profile/${namaFileUnikProfil}.jpg`;
    // 6. Tangani error jika proses penyimpanan file gagal.
    //
    // Contoh pseudocode (membutuhkan import 'fs/promises' dan 'path'):
    // if (profileImageFile && profileImageFile instanceof File) {
    //   const bytes = await profileImageFile.arrayBuffer();
    //   const buffer = Buffer.from(bytes);
    //   const fileName = Date.now() + '-' + profileImageFile.name.replace(/[^a-zA-Z0-9.]/g, ''); // Simple unique name
    //   const filePath = join(process.cwd(), 'public', 'uploads', 'profile', fileName);
    //   await writeFile(filePath, buffer);
    //   profileImageUrl = `/uploads/profile/${fileName}`;
    // }
    // if (backgroundImageFile && backgroundImageFile instanceof File) {
    //   const bytes = await backgroundImageFile.arrayBuffer();
    //   const buffer = Buffer.from(bytes);
    //   const fileName = Date.now() + '-' + backgroundImageFile.name.replace(/[^a-zA-Z0-9.]/g, ''); // Simple unique name
    //   const filePath = join(process.cwd(), 'public', 'uploads', 'background', fileName);
    //   await writeFile(filePath, buffer);
    //   backgroundImageUrl = `/uploads/background/${fileName}`;
    // }
    // --- Akhir TODO --- //

    // Update user data in database with potentially new image URLs
    await db.update(users)
      .set({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phone: phone || user.phone,
        role: role || user.role,
        address: address || user.address,
        profileImage: profileImageUrl,
        backgroundImage: backgroundImageUrl,
      })
      .where(eq(users.id, user.id));

    // Get updated user data
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phone: true,
        profileImage: true,
        backgroundImage: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Failed to update user", details: error.message }, { status: 500 });
  }
} 