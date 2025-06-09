'use client';

export default function FinancePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Finance</h1>
        <p className="text-gray-600">Financial overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Financial Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">Rp 245M</span>
            <span className="text-green-600 text-sm">+8.3%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">Rp 142M</span>
            <span className="text-red-600 text-sm">+2.5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Net Profit</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">Rp 103M</span>
            <span className="text-green-600 text-sm">+15.8%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Profit Margin</h3>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">42%</span>
            <span className="text-green-600 text-sm">+3.2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="text-green-600 hover:text-green-800">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-arrow-down text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium">Income from Field A</h3>
                  <p className="text-sm text-gray-500">March 20, 2024</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">+Rp 25,000,000</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-arrow-up text-red-600"></i>
                </div>
                <div>
                  <h3 className="font-medium">Equipment Purchase</h3>
                  <p className="text-sm text-gray-500">March 18, 2024</p>
                </div>
              </div>
              <span className="text-red-600 font-medium">-Rp 12,500,000</span>
            </div>
          </div>
        </div>

        {/* Financial Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Financial Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-file-invoice-dollar mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Create Invoice</h3>
                  <p className="text-sm text-gray-500">Generate new invoice</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>

            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-chart-bar mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Financial Reports</h3>
                  <p className="text-sm text-gray-500">View and generate reports</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>

            <button className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center">
                <i className="fas fa-cog mr-3 text-green-600"></i>
                <div>
                  <h3 className="font-medium">Financial Settings</h3>
                  <p className="text-sm text-gray-500">Manage financial preferences</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 