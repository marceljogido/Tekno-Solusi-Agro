'use client';

export default function ResourcesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resources Management</h1>
        <p className="text-gray-600">Kelola semua sumber daya pertanian Anda</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Peralatan</h3>
            <i className="fas fa-tools text-green-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">24</span>
            <span className="text-green-600 text-sm">Unit</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Stok Bahan</h3>
            <i className="fas fa-box text-blue-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">85%</span>
            <span className="text-blue-600 text-sm">Tersedia</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Tenaga Kerja</h3>
            <i className="fas fa-users text-yellow-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">12</span>
            <span className="text-yellow-600 text-sm">Aktif</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
            <i className="fas fa-wrench text-red-600"></i>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">3</span>
            <span className="text-red-600 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Daftar Peralatan</h2>
              <p className="text-sm text-gray-600">Kelola inventaris peralatan pertanian</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
              <i className="fas fa-plus mr-2"></i>
              Tambah Baru
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-tractor text-2xl text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Traktor Kubota M7040</h3>
                    <p className="text-sm text-gray-500">Status: Aktif</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-history"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-spray-can text-2xl text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Sprayer Electric</h3>
                    <p className="text-sm text-gray-500">Status: Maintenance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-history"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-solar-panel text-2xl text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">Solar Panel System</h3>
                    <p className="text-sm text-gray-500">Status: Aktif</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-history"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials & Supplies */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Bahan & Persediaan</h2>
              <p className="text-sm text-gray-600">Monitor stok bahan pertanian</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
              <i className="fas fa-plus mr-2"></i>
              Tambah Stok
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Pupuk NPK</h3>
                    <p className="text-sm text-gray-500">Stok: 500 kg</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Cukup
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Bibit Padi</h3>
                    <p className="text-sm text-gray-500">Stok: 200 kg</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Menipis
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Pestisida Organik</h3>
                    <p className="text-sm text-gray-500">Stok: 100 L</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Kritis
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workers/Staff */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Tenaga Kerja</h2>
              <p className="text-sm text-gray-600">Manajemen pekerja dan staff</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
              <i className="fas fa-user-plus mr-2"></i>
              Tambah Pekerja
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img
                      src="/worker1.jpg"
                      alt="Worker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Ahmad Sudrajat</h3>
                    <p className="text-sm text-gray-500">Kepala Lapangan</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Full-time
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img
                      src="/worker2.jpg"
                      alt="Worker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Siti Aminah</h3>
                    <p className="text-sm text-gray-500">Admin Inventaris</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Full-time
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img
                      src="/worker3.jpg"
                      alt="Worker"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Budi Santoso</h3>
                    <p className="text-sm text-gray-500">Operator Mesin</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Part-time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Jadwal Maintenance</h2>
              <p className="text-sm text-gray-600">Perawatan rutin peralatan</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
              <i className="fas fa-plus mr-2"></i>
              Tambah Jadwal
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-red-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-red-800">Traktor Kubota M7040</h3>
                    <p className="text-sm text-red-600">Maintenance Rutin</p>
                  </div>
                  <span className="text-sm text-red-600">Hari ini</span>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  Penggantian oli dan filter
                </p>
              </div>

              <div className="p-4 border rounded-md bg-yellow-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-yellow-800">Sprayer Electric</h3>
                    <p className="text-sm text-yellow-600">Pemeriksaan Komponen</p>
                  </div>
                  <span className="text-sm text-yellow-600">Besok</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Kalibrasi dan pembersihan nozzle
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Solar Panel System</h3>
                    <p className="text-sm text-gray-500">Pembersihan Panel</p>
                  </div>
                  <span className="text-sm text-gray-500">3 hari lagi</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Pembersihan permukaan panel dan pemeriksaan koneksi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 