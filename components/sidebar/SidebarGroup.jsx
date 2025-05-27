"use client";
import { useSidebar } from "./SidebarContext";
import clsx from "clsx";

export default function SidebarGroup({ title, children, withDivider = false }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={clsx(
        "mt-2 space-y-2 px-2",
        withDivider && "my-2 border-t border-slate-300 pt-2",
      )}
    >
      {!collapsed && title && (
        <div className="mt-2 text-xs font-bold text-slate-500 uppercase">
          {title}
        </div>
      )}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}
