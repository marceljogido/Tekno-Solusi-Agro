'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Teks untuk berbagai bahasa
export const translations = {
  id: {
    // Settings
    settings: 'Pengaturan',
    managePreferences: 'Kelola preferensi aplikasi Anda',
    appearance: 'Tampilan',
    customizeApp: 'Sesuaikan tampilan aplikasi',
    theme: 'Tema',
    language: 'Bahasa',
    light: 'Terang',
    dark: 'Gelap',
    notifications: 'Notifikasi',
    notificationPreferences: 'Atur preferensi notifikasi',
    emailNotification: 'Email Notifikasi',
    receiveEmail: 'Terima notifikasi melalui email',
    pushNotification: 'Notifikasi Push',
    receivePush: 'Terima notifikasi push di perangkat Anda',
    systemUpdates: 'Update Sistem',
    getSystemUpdates: 'Dapatkan informasi tentang pembaruan sistem',
    privacy: 'Privasi',
    managePrivacy: 'Atur pengaturan privasi akun Anda',
    profileVisibility: 'Visibilitas Profil',
    public: 'Publik',
    private: 'Privat',
    contactsOnly: 'Hanya Kontak',
    activityStatus: 'Status Aktivitas',
    showOnline: 'Tampilkan ketika Anda sedang online',
    showEmail: 'Tampilkan Email',
    showEmailDesc: 'Tampilkan email Anda ke pengguna lain',

    // Sidebar
    dashboard: 'Dashboard',
    monitoring: 'Monitoring',
    cropProduction: 'Produksi Tanaman',
    resources: 'Sumber Daya',
    insights: 'Wawasan',
    fieldActivity: 'Catatan Aktivitas Lapangan',
    reporting: 'Pelaporan',
    analysis: 'Analisis',
    finance: 'Keuangan',
    newTask: 'Tugas Baru',
    search: 'Cari...',
    menu: 'Menu',
    logout: 'Keluar'
  },
  en: {
    // Settings
    settings: 'Settings',
    managePreferences: 'Manage your application preferences',
    appearance: 'Appearance',
    customizeApp: 'Customize the application display',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    notifications: 'Notifications',
    notificationPreferences: 'Set notification preferences',
    emailNotification: 'Email Notifications',
    receiveEmail: 'Receive notifications via email',
    pushNotification: 'Push Notifications',
    receivePush: 'Receive push notifications on your device',
    systemUpdates: 'System Updates',
    getSystemUpdates: 'Get information about system updates',
    privacy: 'Privacy',
    managePrivacy: 'Manage your account privacy settings',
    profileVisibility: 'Profile Visibility',
    public: 'Public',
    private: 'Private',
    contactsOnly: 'Contacts Only',
    activityStatus: 'Activity Status',
    showOnline: 'Show when you are online',
    showEmail: 'Show Email',
    showEmailDesc: 'Show your email to other users',

    // Sidebar
    dashboard: 'Dashboard',
    monitoring: 'Monitoring',
    cropProduction: 'Crop Production',
    resources: 'Resources',
    insights: 'Insights',
    fieldActivity: 'Field Activity Record',
    reporting: 'Reporting',
    analysis: 'Analysis',
    finance: 'Finance',
    newTask: 'New Task',
    search: 'Search...',
    menu: 'Menu',
    logout: 'Log out'
  }
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('id');

  // Load saved preferences from localStorage when app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'id';
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Update language
  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Get text based on current language
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, updateTheme, language, updateLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 