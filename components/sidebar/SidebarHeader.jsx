"use client";
import { useSidebar } from "./SidebarContext";
import Image from "next/image";
import clsx from "clsx";

export default function SidebarHeader() {
  const { collapsed } = useSidebar();
  return (
    <div className="sticky top-0 z-10 flex flex-col items-center gap-5 border-b border-slate-300  bg-white p-4">
      <div className="flex items-center justify-center gap-2">
        <Image src="/images/logo.png" alt="Logo" width={24} height={24} />
        {!collapsed && (
          <p className="text-base font-extrabold tracking-tight text-green-600">
            Farm Management
          </p>
        )}
      </div>
      {!collapsed && (
        <button className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
          + Buat Tugas
        </button>
      )}
    </div>
  );
}
