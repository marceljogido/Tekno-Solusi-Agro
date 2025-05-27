"use client";

import { useSidebar } from "./SidebarContext";
import { IconMenu2 } from "@tabler/icons-react";

export default function SidebarToggleButton() {
  const { openMobile } = useSidebar();

  return (
    <button
      onClick={openMobile}
      className="rounded-md  p-2 md:hidden hover:cursor-pointer"
    >
      <IconMenu2 size={20} className="text-slate-500"/>
    </button>
  );
}
