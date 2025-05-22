"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import clsx from "clsx";
import SidebarTooltip from "./SidebarTooltip";

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  variant = "default",
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { collapsed } = useSidebar();

  const baseClass = clsx(
    "group relative flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
    isActive
      ? "bg-green-100 text-green-700"
      : "text-slate-700 hover:bg-slate-100",
  );

  if (variant === "sub") {
    return (
      <Link href={href} className={clsx(baseClass, "gap-0")}>
        {label}
      </Link>
    );
  }

  return (
    <SidebarTooltip label={label}>
      <Link
        href={href}
        className={clsx(
          baseClass,
          collapsed ? "justify-center" : "justify-start",
        )}
      >
        {Icon && <Icon size={18} className="shrink-0" />}
        {!collapsed && <span>{label}</span>}
      </Link>
    </SidebarTooltip>
  );
}
