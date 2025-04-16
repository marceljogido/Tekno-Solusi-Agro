'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 bg-white shadow-md h-screen fixed">
      <div className="p-4 flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <h1 className="text-lg font-bold text-green-600">
          Tekno Solusi Agro
        </h1>
      </div>
      <div className="p-4">
        <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
          + New Task
        </button>
      </div>
      <div className="p-4">
        <input 
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
          placeholder="Search..." 
          type="text" 
        />
      </div>

      {/* Menu Section */}
      <div className="px-4 mb-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Menu</p>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/monitoring" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/monitoring') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-eye mr-2"></i>
                Monitoring
              </Link>
            </li>
            <li>
              <Link 
                href="/crop-production" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/crop-production') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-seedling mr-2"></i>
                Crop Production
              </Link>
            </li>
            <li>
              <Link 
                href="/resources" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/resources') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-box-open mr-2"></i>
                Resources
              </Link>
            </li>
            <li>
              <div className="relative group">
                <Link 
                  href="/insights" 
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    pathname.startsWith('/insights') 
                      ? 'bg-green-50 text-green-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Insights
                  <i className="fas fa-chevron-down ml-auto text-sm"></i>
                </Link>
                <ul className={`ml-4 mt-1 space-y-1 ${pathname.startsWith('/insights') ? 'block' : 'hidden'}`}>
                  <li>
                    <Link
                      href="/insights/field-activity"
                      className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                        isActive('/insights/field-activity')
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Field Activity Record
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/insights/reporting"
                      className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                        isActive('/insights/reporting')
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Reporting
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/insights/analysis"
                      className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                        isActive('/insights/analysis')
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Analysis
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/insights/finance"
                      className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                        isActive('/insights/finance')
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Finance
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <Link 
                href="/notifications" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/notifications') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Notifications
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  9+
                </span>
              </Link>
            </li>
            <li>
              <Link 
                href="/settings" 
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isActive('/settings') 
                    ? 'bg-green-50 text-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-cog mr-2"></i>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Profile Section */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="p-4 border-t">
          <Link href="/profile" className="block">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-yellow-300 rounded-full overflow-hidden mr-3">
                <Image
                  src="/images/nazlan.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">Nazlan Rizqon</p>
                <p className="text-sm text-gray-500">nazlanrizqon@upi.edu</p>
              </div>
            </div>
          </Link>
          <button className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm p-2 rounded-md hover:bg-gray-100">
            <i className="fas fa-sign-out-alt mr-2"></i>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
} 