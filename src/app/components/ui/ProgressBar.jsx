import React from "react";

export function ProgressBar({ pct, color }) {
  return (
    <div className="h-1.5 bg-[var(--zp-surface)] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

export default ProgressBar;
