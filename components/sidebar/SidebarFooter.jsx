"use client";

import Link from "next/link";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useSidebar } from "./SidebarContext";
import {
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarLeftCollapse,
  IconLogout,
  IconDotsVertical,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function SidebarFooter() {
  const { collapsed, toggleSidebar, mobileOpen, closeMobile } = useSidebar();
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then(setUser)
      .catch(() => {});
  }, []);

  // 🔁 Collapse on desktop, Close on mobile
  const handleToggle = () => {
    if (mobileOpen) {
      closeMobile();
    } else {
      toggleSidebar();
    }
  };

  return (
    <div
      className={clsx(
        "sticky bottom-0 z-10 flex flex-col border-t border-slate-300 bg-white p-4",
        collapsed ? "items-center" : "items-start",
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "mb-2 flex w-full items-center",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          href="/profile"
          className="flex items-center gap-3 overflow-hidden py-2 transition hover:opacity-80"
        >
          <img
            src="/images/avatar.png"
            alt="User Avatar"
            className="h-[24px] w-[24px] rounded-full object-cover"
          />
          {!collapsed && (
            <div className="w-full overflow-hidden">
              <p className="truncate text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
        </Link>

        {/* Popover button */}
        {!collapsed && (
          <Popover className="relative rounded-md hover:bg-slate-200">
            <PopoverButton className="p-1 text-slate-500 hover:cursor-pointer hover:text-slate-700">
              <IconDotsVertical size={16} />
            </PopoverButton>

            <PopoverPanel className="absolute right-0 z-50 mt-2 w-36 rounded-md border border-slate-200 bg-white shadow-lg">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch("/api/logout", { method: "POST" });
                    if (res.ok) {
                      window.location.href = "/login"; 
                    }
                  } catch (error) {
                    console.error("Logout failed", error);
                  }
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <IconLogout size={16} />
                  Logout
                </button>
              </form>
            </PopoverPanel>
          </Popover>
        )}
      </div>

      {/* Toggle Button */}
      <div
        className={clsx(
          "flex w-full items-end",
          collapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          onClick={handleToggle}
          className="p-1 text-slate-700 hover:cursor-pointer hover:text-slate-700"
        >
          {mobileOpen ? (
            <IconLayoutSidebarLeftCollapse size={20} />
          ) : collapsed ? (
            <IconLayoutSidebarRightCollapse size={20} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
