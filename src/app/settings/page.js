'use client';

import { useSettings } from '@/context/SettingsContext';
import { translations } from '@/context/translations';
import { useState } from 'react';

export default function SettingsPage() {
  const { language, theme, toggleLanguage, toggleTheme } = useSettings();
  const t = translations[language];
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    system: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnline: true,
    showEmail: false
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">{t.settings}</h1>
        <p className="text-secondary">Kelola preferensi aplikasi Anda</p>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-custom">
          <h2 className="text-lg font-semibold text-primary">{t.appearance}</h2>
          <p className="text-sm text-secondary">{t.customizeAppearance}</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-2">{t.theme}</label>
            <div className="flex gap-4">
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-md flex items-center ${
                  theme === 'light'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <i className="fas fa-sun mr-2"></i>
                {t.lightMode}
              </button>
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-md flex items-center ${
                  theme === 'dark'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <i className="fas fa-moon mr-2"></i>
                {t.darkMode}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">{t.language}</label>
            <div className="flex gap-4">
              <button
                onClick={toggleLanguage}
                className={`px-4 py-2 rounded-md flex items-center ${
                  language === 'id'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <i className="fas fa-flag mr-2"></i>
                {t.indonesian}
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-4 py-2 rounded-md flex items-center ${
                  language === 'en'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <i className="fas fa-flag-usa mr-2"></i>
                {t.english}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-custom">
          <h2 className="text-lg font-semibold text-primary">{t.notifications}</h2>
          <p className="text-sm text-secondary">{t.notificationPreferences}</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{t.emailNotifications}</h3>
                <p className="text-sm text-secondary">{t.emailNotificationsDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{t.pushNotifications}</h3>
                <p className="text-sm text-secondary">{t.pushNotificationsDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{t.systemUpdates}</h3>
                <p className="text-sm text-secondary">{t.systemUpdatesDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.system}
                  onChange={(e) => setNotifications({...notifications, system: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card rounded-lg shadow-sm">
        <div className="p-6 border-b border-custom">
          <h2 className="text-lg font-semibold text-primary">{t.privacy}</h2>
          <p className="text-sm text-secondary">{t.privacySettings}</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t.profileVisibility}</label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                className="w-full md:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="public">{t.public}</option>
                <option value="private">{t.private}</option>
                <option value="contacts">{t.contactsOnly}</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{t.activityStatus}</h3>
                <p className="text-sm text-secondary">{t.activityStatusDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.showOnline}
                  onChange={(e) => setPrivacy({...privacy, showOnline: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{t.showEmail}</h3>
                <p className="text-sm text-secondary">{t.showEmailDesc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}