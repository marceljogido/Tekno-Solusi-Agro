'use client';

export default function InsightsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Insights Overview</h1>
        <p className="text-gray-600">Comprehensive view of your farm's performance and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <i className="fas fa-clipboard-list text-2xl text-green-600 mr-3"></i>
            <h2 className="text-lg font-semibold">Field Activity Record</h2>
          </div>
          <p className="text-gray-600 mb-4">Track and manage all field activities and operations</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Recent Activities</p>
              <p className="font-medium">15 activities this week</p>
            </div>
            <a href="/insights/field-activity" className="text-green-600 hover:text-green-800 font-medium">
              View Details →
            </a>
          </div>
        </div>

        {/* Reporting Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <i className="fas fa-file-alt text-2xl text-green-600 mr-3"></i>
            <h2 className="text-lg font-semibold">Reporting</h2>
          </div>
          <p className="text-gray-600 mb-4">Generate and access comprehensive reports</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Reports</p>
              <p className="font-medium">4 report types</p>
            </div>
            <a href="/insights/reporting" className="text-green-600 hover:text-green-800 font-medium">
              View Details →
            </a>
          </div>
        </div>

        {/* Analysis Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <i className="fas fa-chart-line text-2xl text-green-600 mr-3"></i>
            <h2 className="text-lg font-semibold">Analysis</h2>
          </div>
          <p className="text-gray-600 mb-4">Data analysis and insights dashboard</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Performance</p>
              <p className="font-medium">+15% yield improvement</p>
            </div>
            <a href="/insights/analysis" className="text-green-600 hover:text-green-800 font-medium">
              View Details →
            </a>
          </div>
        </div>

        {/* Finance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <i className="fas fa-money-bill-wave text-2xl text-green-600 mr-3"></i>
            <h2 className="text-lg font-semibold">Finance</h2>
          </div>
          <p className="text-gray-600 mb-4">Financial overview and management</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="font-medium">Rp 245M this quarter</p>
            </div>
            <a href="/insights/finance" className="text-green-600 hover:text-green-800 font-medium">
              View Details →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
