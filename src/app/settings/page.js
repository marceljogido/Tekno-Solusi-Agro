'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('id');
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
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-600">Kelola preferensi aplikasi Anda</p>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Tampilan</h2>
          <p className="text-sm text-gray-600">Sesuaikan tampilan aplikasi</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  theme === 'light'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                <i className="fas fa-sun mr-2"></i>
                Terang
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  theme === 'dark'
                    ? 'bg-green-50 text-green-600 border-2 border-green-600'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                <i className="fas fa-moon mr-2"></i>
                Gelap
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full md:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifikasi</h2>
          <p className="text-sm text-gray-600">Atur preferensi notifikasi</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Email Notifikasi</h3>
                <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Notifikasi Push</h3>
                <p className="text-sm text-gray-500">Terima notifikasi push di perangkat Anda</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Update Sistem</h3>
                <p className="text-sm text-gray-500">Dapatkan informasi tentang pembaruan sistem</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.system}
                  onChange={(e) => setNotifications({...notifications, system: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Privasi</h2>
          <p className="text-sm text-gray-600">Atur pengaturan privasi akun Anda</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibilitas Profil</label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                className="w-full md:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="public">Publik</option>
                <option value="private">Privat</option>
                <option value="contacts">Hanya Kontak</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Status Aktivitas</h3>
                <p className="text-sm text-gray-500">Tampilkan ketika Anda sedang online</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.showOnline}
                  onChange={(e) => setPrivacy({...privacy, showOnline: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Tampilkan Email</h3>
                <p className="text-sm text-gray-500">Tampilkan email Anda ke pengguna lain</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}