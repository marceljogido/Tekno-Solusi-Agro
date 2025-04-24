'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tekno Solusi Agro - Farm Management Dashboard</title>
        <meta name="description" content="Modern farm management system for agricultural monitoring and analytics" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <SettingsProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 bg-background">
              {children}
            </main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
