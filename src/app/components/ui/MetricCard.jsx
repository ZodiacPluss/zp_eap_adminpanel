import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { useAccents } from "@/app/theme/ThemeProvider";

/**
 * One headline metric: tinted icon disc, the value, its label, and the change
 * against the comparison window. Used by the KPI rows on Reports and
 * Departments.
 */
export function MetricCard({ icon: Icon, label, value, change, comparison, tone = "brand" }) {
  const A = useAccents();
  const accent = A[tone] ?? A.brand;
  const up = change >= 0;
  const Arrow = up ? ArrowUp : ArrowDown;
  const trendColor = up ? "var(--zp-emerald)" : "var(--zp-rose)";

  return (
    <Card className="flex items-start gap-4 px-5 py-[18px] transition-shadow hover:shadow-md sm:px-6">
      <span aria-hidden="true" className="mt-0.5 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full"
        style={{ background: `${accent}1f` }}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} style={{ color: accent }} />
      </span>
      <div className="min-w-0">
        <p className="text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--zp-navy)]">{value}</p>
        <p className="mt-1 truncate text-[13.5px] text-[var(--zp-slate)]">{label}</p>
        <p className="mt-2.5 flex items-center gap-1 text-[13.5px] font-semibold" style={{ color: trendColor }}>
          <Arrow className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
          {Math.abs(change)}%
        </p>
        <p className="mt-0.5 text-[12px] text-[var(--zp-slate-light)]">{comparison}</p>
      </div>
    </Card>
  );
}

export default MetricCard;
