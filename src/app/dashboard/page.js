'use client';

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Good Morning, Nazlan!
          <span className="wave">👋</span>
        </h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
          Export
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        here's what's happening with your field today
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Sumber Jaya Farm
          </h3>
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Total Land Area
          </h3>
          <p className="text-2xl font-bold">
            10.4 Hectares
          </p>
          <p className="text-green-600">
            70% Planted
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Revenue
          </h3>
          <p className="text-2xl font-bold">
            Rp. 12.350.000
          </p>
          <p className="text-green-600">
            +12% from last month
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Vegetable Harvest Summary
          </h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Paddy</span>
              <span className="font-medium">100 Kg</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Carrot</span>
              <span className="font-medium">96.8 Kg</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Chili</span>
              <span className="font-medium">80.2 Kg</span>
            </li>
          </ul>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 transition-colors">
            See All
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Quantity of students helped
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">
              2,300+
            </div>
            <p className="text-gray-600">
              Students
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">
            Growth
          </h3>
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">
            Cileunyi
          </h3>
          <p className="text-gray-600">
            Friday, 7th March 2025
          </p>
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-2xl font-bold">
                23°C
              </p>
              <p className="text-gray-600">
                Clear
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <p className="text-gray-600 mt-4">
            Humidity 83%
          </p>
          <p className="text-gray-600">
            Day 24° • Night 19°
          </p>
        </div>
      </div>
    </div>
  );
}