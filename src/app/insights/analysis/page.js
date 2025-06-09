'use client';

export default function AnalysisPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analysis</h1>
        <p className="text-gray-600">Data analysis and insights dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Production</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">2,450</span>
            <span className="text-green-600 text-sm">+12.5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average Yield</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">4.8</span>
            <span className="text-sm">tons/ha</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Resource Efficiency</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">87%</span>
            <span className="text-green-600 text-sm">+5%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analysis Tools */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Analysis Tools</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-chart-line mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Trend Analysis</h3>
                  <p className="text-sm text-gray-500">Analyze production trends over time</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>

            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-chart-pie mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Yield Analysis</h3>
                  <p className="text-sm text-gray-500">Compare yields across fields</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>

            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-calculator mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Cost Analysis</h3>
                  <p className="text-sm text-gray-500">Calculate and analyze costs</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Analysis</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Q1 2024 Production Analysis</h3>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Analysis of production metrics for Q1 2024 showing 15% improvement in yield.
              </p>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Details
              </button>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Resource Optimization Report</h3>
                <span className="text-sm text-gray-500">1 week ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Detailed analysis of resource utilization and recommendations for optimization.
              </p>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 