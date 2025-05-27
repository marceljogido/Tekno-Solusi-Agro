"use client";

import { useSidebar } from "./SidebarContext";
import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarFooter from "./SidebarFooter";
import SidebarMenu from "./SidebarMenu";

export default function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();

  if (!mobileOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeMobile}
        className="fixed inset-0 z-40 transform bg-black/40 backdrop-blur-sm transition-transform duration-300"
      />

      {/* Sidebar Overlay */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col bg-white shadow-xl transition-transform duration-300">
        <SidebarHeader />
        <SidebarContent>
          <SidebarMenu />
        </SidebarContent>
        <SidebarFooter />
      </div>
    </>
  );
}
