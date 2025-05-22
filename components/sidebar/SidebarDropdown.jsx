"use client";

import { useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import clsx from "clsx";
import { useSidebar } from "./SidebarContext";
import SidebarTooltip from "./SidebarTooltip";

export default function SidebarDropdown({ icon: Icon, label, children }) {
  const [open, setOpen] = useState(false);
  const { collapsed } = useSidebar();

  return (
    <SidebarTooltip label={label}>
    <div className="group relative"><button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {!collapsed && <span>{label}</span>}
        </div>

        {!collapsed && (
          <IconChevronRight
            size={16}
            className={clsx(
              "transition-transform duration-300",
              open && "rotate-90",
            )}
          />
        )}
      </button>

      {open && !collapsed && (
        <div className="relative mt-1 ml-4 flex flex-col gap-1 border-l border-slate-300 pl-3">
          {children}
        </div>
      )}</div>
      
    </SidebarTooltip>
  );
}
