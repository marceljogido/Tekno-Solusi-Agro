"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "./SidebarContext";

export default function SidebarTooltip({ children, label }) {
  const { collapsed } = useSidebar();
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (ref.current && collapsed && visible) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    }
  }, [visible, collapsed]);

  return (
    <div
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      className="relative w-full"
    >
      {children}

      {collapsed && visible && (
        <div
          className="fixed z-50 rounded-full bg-green-700 px-3 py-1 text-xs text-white shadow-md transition-opacity"
          style={{
            top: coords.y,
            left: coords.x,
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
