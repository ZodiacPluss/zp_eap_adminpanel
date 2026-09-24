import React from "react";
import { usePalette } from "@/app/theme/ThemeProvider";
export function Card({ children, className = "" }) {
  const P = usePalette();
  return (
    <div className={`bg-[var(--zp-card)] rounded-2xl shadow-sm ${className}`} style={{ border: `1px solid ${P.border}` }}>
      {children}
    </div>
  );
}

export default Card;
