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
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // 🔁 Collapse on desktop, Close on mobile
  const handleToggle = () => {
    if (mobileOpen) {
      closeMobile();
    } else {
      toggleSidebar();
    }
  };

  const profileLink = user ? "/profile" : "/auth/login";
  const avatarSrc = user?.profileImage || "/images/avatar.png";

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
        {user === null ? (
          // Loading skeleton
          <div className="flex items-center gap-3 overflow-hidden py-2">
            <div className="h-[24px] w-[24px] rounded-full bg-gray-200 animate-pulse" />
            {!collapsed && (
              <div className="w-full overflow-hidden">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
              </div>
            )}
          </div>
        ) : (
        <Link
            href={user ? "/profile" : "/auth/login"}
          className="flex items-center gap-3 overflow-hidden py-2 transition hover:opacity-80"
        >
          <img
              src={avatarSrc}
            alt="User Avatar"
            className="h-[24px] w-[24px] rounded-full object-cover"
          />
          {!collapsed && (
            <div className="w-full overflow-hidden">
              <p className="truncate text-sm font-semibold">
                  {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </p>
                <p className="truncate text-xs text-gray-500">{user?.email || ""}</p>
            </div>
          )}
        </Link>
        )}

        {/* Popover button */}
        {!collapsed && user && (
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
                      window.location.href = "/auth/login";
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
