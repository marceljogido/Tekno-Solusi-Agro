"use client";

import { useSidebar } from "./SidebarContext";
import clsx from "clsx";

export default function Sidebar({ children }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col overflow-hidden border-r border-slate-300 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-18" : "w-72",
      )}
    >
      {children}
    </aside>
  );
}
