'use client';

export default function ReportingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reporting</h1>
        <p className="text-gray-600">Generate and view comprehensive reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Types */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option>Daily Activity Report</option>
                <option>Weekly Progress Report</option>
                <option>Monthly Performance Report</option>
                <option>Custom Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Generate Report
            </button>
          </form>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {/* Sample reports - replace with actual data */}
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Daily Activity Report</h3>
                <p className="text-sm text-gray-500">Generated on March 20, 2024</p>
              </div>
              <button className="text-green-600 hover:text-green-800">
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h3 className="font-medium">Weekly Progress Report</h3>
                <p className="text-sm text-gray-500">Generated on March 17, 2024</p>
              </div>
              <button className="text-green-600 hover:text-green-800">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 