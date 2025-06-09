'use client';

export default function MonitoringPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Monitoring Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring dan status pertanian</p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Suhu Rata-rata</h3>
            <i className="fas fa-temperature-high text-green-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">27.5°C</span>
            <span className="text-green-600 text-sm">Normal</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Kelembaban Tanah</h3>
            <i className="fas fa-water text-yellow-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">65%</span>
            <span className="text-yellow-600 text-sm">Perlu Air</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">pH Tanah</h3>
            <i className="fas fa-flask text-green-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">6.8</span>
            <span className="text-green-600 text-sm">Optimal</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Status Irigasi</h3>
            <i className="fas fa-faucet text-blue-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">Aktif</span>
            <span className="text-blue-600 text-sm">3 Zona</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Status Lahan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium">Lahan A - Padi</h3>
                  <p className="text-sm text-gray-500">Fase: Pertumbuhan Vegetatif</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-800">
                Detail
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium">Lahan B - Jagung</h3>
                  <p className="text-sm text-gray-500">Fase: Pembibitan</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-800">
                Detail
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium">Lahan C - Kedelai</h3>
                  <p className="text-sm text-gray-500">Fase: Panen</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-800">
                Detail
              </button>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Peringatan Terkini</h2>
            <button className="text-sm text-green-600 hover:text-green-800">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-md">
              <i className="fas fa-exclamation-circle mr-3"></i>
              <div>
                <h3 className="font-medium">Kelembaban Rendah</h3>
                <p className="text-sm">Lahan B membutuhkan irigasi segera</p>
                <p className="text-xs mt-1">2 jam yang lalu</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 text-yellow-700 rounded-md">
              <i className="fas fa-exclamation-triangle mr-3"></i>
              <div>
                <h3 className="font-medium">Potensi Hama</h3>
                <p className="text-sm">Terdeteksi tanda-tanda hama di Lahan A</p>
                <p className="text-xs mt-1">5 jam yang lalu</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-md">
              <i className="fas fa-info-circle mr-3"></i>
              <div>
                <h3 className="font-medium">Jadwal Pemupukan</h3>
                <p className="text-sm">Lahan C memerlukan pemupukan dalam 2 hari</p>
                <p className="text-xs mt-1">1 hari yang lalu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center">
              <i className="fas fa-power-off text-2xl text-green-600 mb-2"></i>
              <span className="text-sm font-medium">Kontrol Irigasi</span>
            </button>
            
            <button className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center">
              <i className="fas fa-camera text-2xl text-green-600 mb-2"></i>
              <span className="text-sm font-medium">Cek CCTV</span>
            </button>

            <button className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center">
              <i className="fas fa-bug text-2xl text-green-600 mb-2"></i>
              <span className="text-sm font-medium">Lapor Hama</span>
            </button>

            <button className="p-4 border rounded-md hover:bg-gray-50 flex flex-col items-center">
              <i className="fas fa-calendar-plus text-2xl text-green-600 mb-2"></i>
              <span className="text-sm font-medium">Jadwal Baru</span>
            </button>
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Prakiraan Cuaca</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Hari ini</p>
              <i className="fas fa-sun text-2xl text-yellow-500 my-2"></i>
              <p className="font-medium">32°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Besok</p>
              <i className="fas fa-cloud-sun text-2xl text-gray-400 my-2"></i>
              <p className="font-medium">30°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Lusa</p>
              <i className="fas fa-cloud-rain text-2xl text-blue-500 my-2"></i>
              <p className="font-medium">28°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">3 Hari</p>
              <i className="fas fa-cloud text-2xl text-gray-500 my-2"></i>
              <p className="font-medium">29°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
