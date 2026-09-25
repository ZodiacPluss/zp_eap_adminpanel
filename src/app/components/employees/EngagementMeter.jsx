import React from "react";
import { ProgressBar } from "@/app/components/ui/ProgressBar";

export const ENGAGEMENT = {
  high: { label: "High", pct: 72, color: "var(--zp-emerald)" },
  medium: { label: "Medium", pct: 45, color: "var(--zp-brand)" },
  low: { label: "Low", pct: 10, color: "var(--zp-rose)" },
};

/** "High ▬▬▬" label + bar, or an em dash when the employee has not engaged yet. */
export function EngagementMeter({ level }) {
  const engagement = level ? ENGAGEMENT[level] : null;
  if (!engagement) {
    return <span className="text-[13.5px] text-[var(--zp-slate)]" aria-label="No engagement yet">—</span>;
  }
  return (
    <div className="flex items-center gap-3">
      <span className="w-[54px] text-[13.5px] text-[var(--zp-slate)]">{engagement.label}</span>
      <ProgressBar pct={engagement.pct} color={engagement.color} className="h-[5px] w-[62px] bg-[var(--zp-border-strong)]" />
    </div>
  );
}

export default EngagementMeter;
