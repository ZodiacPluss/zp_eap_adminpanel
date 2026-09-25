import React from "react";
import { cn } from "./utils";

export function ProgressBar({ pct, color, className }) {
  return (
    <div className={cn("h-1.5 bg-[var(--zp-surface)] rounded-full overflow-hidden", className)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

export default ProgressBar;
