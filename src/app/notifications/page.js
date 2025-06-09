'use client';

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
        <p className="text-gray-600">Pantau semua pemberitahuan dan peringatan penting</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Semua (12)
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 border">
          Belum Dibaca (5)
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 border">
          Peringatan (3)
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50 border">
          Update (4)
        </button>
      </div>

      {/* Today's Notifications */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Hari Ini</h2>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-red-800 font-medium">Peringatan Kelembaban Tanah</p>
                  <span className="text-red-600 text-sm">5 menit yang lalu</span>
                </div>
                <p className="text-red-700 mt-1">Kelembaban tanah di Area B turun di bawah 30%. Diperlukan irigasi segera.</p>
                <div className="mt-3 flex gap-3">
                  <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Tindak Lanjut
                  </button>
                  <button className="px-3 py-1.5 text-red-700 text-sm hover:underline">
                    Abaikan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-yellow-800 font-medium">Jadwal Pemupukan</p>
                  <span className="text-yellow-600 text-sm">1 jam yang lalu</span>
                </div>
                <p className="text-yellow-700 mt-1">Waktunya pemupukan untuk tanaman padi di Area A. Gunakan pupuk NPK sesuai dosis yang direkomendasikan.</p>
                <div className="mt-3 flex gap-3">
                  <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-box text-blue-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">Stok Bahan Update</p>
                  <span className="text-gray-500 text-sm">3 jam yang lalu</span>
                </div>
                <p className="text-gray-600 mt-1">Persediaan pestisida organik tersisa 15%. Harap lakukan pemesanan ulang.</p>
                <div className="mt-3 flex gap-3">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yesterday's Notifications */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Kemarin</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">Maintenance Selesai</p>
                  <span className="text-gray-500 text-sm">Kemarin, 15:30</span>
                </div>
                <p className="text-gray-600 mt-1">Perawatan Traktor Kubota M7040 telah selesai dilakukan. Siap digunakan kembali.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-cloud-sun text-blue-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">Prakiraan Cuaca</p>
                  <span className="text-gray-500 text-sm">Kemarin, 12:00</span>
                </div>
                <p className="text-gray-600 mt-1">Prakiraan hujan ringan untuk 3 hari ke depan. Sesuaikan jadwal irigasi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Older Notifications */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Minggu Lalu</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">Laporan Mingguan</p>
                  <span className="text-gray-500 text-sm">5 hari yang lalu</span>
                </div>
                <p className="text-gray-600 mt-1">Laporan produktivitas mingguan telah tersedia. Produktivitas meningkat 15% dari minggu sebelumnya.</p>
                <div className="mt-3">
                  <button className="px-3 py-1.5 text-purple-600 text-sm hover:underline">
                    Lihat Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-user-check text-green-600 text-xl"></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 font-medium">Pekerja Baru</p>
                  <span className="text-gray-500 text-sm">7 hari yang lalu</span>
                </div>
                <p className="text-gray-600 mt-1">Siti Aminah telah bergabung sebagai Admin Inventaris. Selamat bergabung!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 