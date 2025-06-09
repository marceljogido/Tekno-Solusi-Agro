'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { translations } from '@/context/translations';
import ProfilePopup from './ProfilePopup';

export default function Sidebar() {
  const pathname = usePathname();
  const [showInsights, setShowInsights] = useState(false);
  const [isCropProductionOpen, setIsCropProductionOpen] = useState(false);
  const { language } = useSettings();
  const t = translations[language];

  useEffect(() => {
    setShowInsights(pathname.startsWith('/insights'));
    setIsCropProductionOpen(pathname.startsWith('/crop-production'));
  }, [pathname]);

  const isParentActive = (path) => {
    return pathname.startsWith(path + '/') || pathname === path;
  };

  const isSubmenuActive = (path) => {
    return pathname === path;
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSaveCrop = (formData) => {
    console.log('Saving crop:', formData);
    handleCloseForm();
  };

  return (
    <div className="fixed w-64 h-screen bg-sidebar border-r border-custom shadow-sm flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-10 h-10 relative">
            <Image 
              src="/images/Vector-Green-Leafs-PNG-File.png" 
              alt="Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-primary">Tekno Solusi Agro</span>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mb-6 flex items-center justify-center">
          <i className="fas fa-plus mr-2"></i>
          {t.newTask}
        </button>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t.search}
            className="w-full pl-10 pr-4 py-2 border border-custom rounded-md bg-card text-primary focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <i className="fas fa-search absolute left-3 top-3 text-secondary"></i>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto space-y-1 px-4 pb-4">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
            isSubmenuActive('/dashboard')
              ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <i className="fas fa-chart-line w-5"></i>
          <span>{t.dashboard}</span>
        </Link>

        <Link
          href="/monitoring"
          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
            isSubmenuActive('/monitoring')
              ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <i className="fas fa-tachometer-alt w-5"></i>
          <span>{t.monitoring}</span>
        </Link>

        <div>
          <button
            onClick={() => setIsCropProductionOpen(!isCropProductionOpen)}
            className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors ${
              isParentActive('/crop-production')
                ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
                : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-leaf w-5"></i>
            <span>{t.cropProduction}</span>
            <i className={`fas fa-chevron-${isCropProductionOpen ? 'up' : 'down'} ml-auto text-sm`}></i>
          </button>
          <ul className={`ml-5 mt-1 space-y-1 ${isCropProductionOpen ? 'block' : 'hidden'}`}>
            <li>
              <Link
                href="/crop-production/media-management"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/media-management')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Media Management
              </Link>
            </li>
            <li>
              <Link
                href="/crop-production/crop-planning"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/crop-planning')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Crop Planning
              </Link>
            </li>
            <li>
              <Link
                href="/crop-production/pesticide-application"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/pesticide-application')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pesticide Application
              </Link>
            </li>
            <li>
              <Link
                href="/crop-production/fertilizer-application"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/fertilizer-application')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Fertilizer Application
              </Link>
            </li>
            <li>
              <Link
                href="/crop-production/irrigation-management"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/irrigation-management')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Irrigation Management
              </Link>
            </li>
            <li>
              <Link
                href="/crop-production/harvest-management"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/crop-production/harvest-management')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Harvest Management
              </Link>
            </li>
          </ul>
        </div>

        <Link
          href="/resources"
          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
            isSubmenuActive('/resources')
              ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <i className="fas fa-book w-5"></i>
          <span>{t.resources}</span>
        </Link>

        <div>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className={`w-full flex items-center p-3 rounded-md text-left transition-colors ${
              isParentActive('/insights')
                ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
                : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <i className="fas fa-chart-line mr-2"></i>
            <span>{t.insights}</span>
            <i className={`fas fa-chevron-${showInsights ? 'up' : 'down'} ml-auto text-sm`}></i>
          </button>
          <ul className={`ml-5 mt-1 space-y-1 ${showInsights ? 'block' : 'hidden'}`}>
            <li>
              <Link
                href="/insights/field-activity"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/insights/field-activity')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.fieldActivity}
              </Link>
            </li>
            <li>
              <Link
                href="/insights/reporting"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/insights/reporting')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.reporting}
              </Link>
            </li>
            <li>
              <Link
                href="/insights/analysis"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/insights/analysis')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.analysis}
              </Link>
            </li>
            <li>
              <Link
                href="/insights/finance"
                className={`flex items-center p-2 rounded-md transition-colors text-sm ${
                  isSubmenuActive('/insights/finance')
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t.finance}
              </Link>
            </li>
          </ul>
        </div>

        <Link
          href="/notifications"
          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
            isSubmenuActive('/notifications')
              ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <i className="fas fa-bell w-5"></i>
          <span>{t.notifications}</span>
        </Link>

        <Link
          href="/settings"
          className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
            isSubmenuActive('/settings')
              ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300'
              : 'text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <i className="fas fa-cog w-5"></i>
          <span>{t.settings}</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-custom flex-shrink-0">
        <div className="relative group">
          <Link href="/profile" className="block">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
                <Image
                  src="/images/nazlan.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-medium text-primary">Nazlan Rizqon</p>
                <p className="text-sm text-secondary">nazlanrizqon@upi.edu</p>
              </div>
            </div>
          </Link>
          <div className="hidden group-hover:block">
            <ProfilePopup />
          </div>
        </div>
        <button className="w-full text-left p-3 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <i className="fas fa-sign-out-alt mr-2"></i>
          {t.logout}
        </button>
      </div>
    </div>
  );
}
