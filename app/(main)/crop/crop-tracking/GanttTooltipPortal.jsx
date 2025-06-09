import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function GanttTooltipPortal({ children, x, y, visible }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (tooltipRef.current && visible) {
      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;
    }
  }, [x, y, visible]);

  if (!visible) return null;

  return createPortal(
    <div ref={tooltipRef} style={{ position: "fixed", zIndex: 9999, pointerEvents: "none" }}>
      {children}
    </div>,
    typeof window !== "undefined" ? document.body : null
  );
} 