"use client";

import { IconLayoutDashboard } from "@tabler/icons-react";
import SidebarToggleButton from "@/components/sidebar/SidebarToggleButton";

export default function PageHeader({ title }) {
  return (
    <div className="fixed z-10 flex w-full items-center gap-3 border-b border-slate-300 bg-white/70 px-4 py-[18px] text-sm font-semibold backdrop-blur-md">
      <div className="md:hidden">
        <SidebarToggleButton />
      </div>
      <span className="text-slate-500">{title}</span>
    </div>
  );
}
