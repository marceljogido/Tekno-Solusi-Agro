import React from "react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Pengaturan Akun</h2>
        <p className="text-gray-600 mb-4">Halaman pengaturan akun Anda. Fitur pengaturan akan segera tersedia.</p>
        {/* Tambahkan form atau komponen pengaturan di sini */}
        <div className="text-gray-400 italic">Belum ada pengaturan yang dapat diubah.</div>
      </div>
    </div>
  );
} 