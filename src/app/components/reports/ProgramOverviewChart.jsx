import React, { useId, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/app/components/ui/Card";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { TREND_PERIODS, trendsByPeriod } from "@/app/data/reportsData";

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap text-[12.5px] text-[var(--zp-slate)]">
      <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function PeriodSelect({ value, onChange }) {
  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">Chart period</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-[34px] cursor-pointer appearance-none rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] pl-3.5 pr-9 text-[13px] font-medium text-[var(--zp-navy)] outline-none transition-colors hover:bg-[var(--zp-hover)] focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25">
        {TREND_PERIODS.map((period) => <option key={period}>{period}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--zp-slate)]" aria-hidden="true" />
    </label>
  );
}

function TrendTooltip({ active, payload, label, style, colors }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div style={style}>
      <p className="mb-1 font-semibold">{label}</p>
      <p style={{ color: colors.participation }}>EAP Participation Rate: {row.participation}%</p>
      <p style={{ color: colors.wellbeing }}>Average Wellbeing Score: {row.wellbeing}</p>
    </div>
  );
}

/**
 * Participation rate (left axis, %) and wellbeing score (right axis, 1-5) over
 * the selected period. Both series are lightly filled, as in the design.
 */
export function ProgramOverviewChart({ trends, period, onPeriodChange }) {
  const A = useAccents();
  const tipStyle = useTipStyle();
  const gradientId = useId();
  const data = useMemo(() => trendsByPeriod(trends, period), [trends, period]);
  const colors = { participation: A.brand, wellbeing: A.emerald };

  return (
    <Card className="px-4 pb-4 pt-5 sm:px-6 sm:pb-5">
      <SectionHeader
        large
        title="EAP Program Overview"
        sub="EAP participation and average wellbeing score over time."
        right={
          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
            <LegendDot color={colors.participation} label="EAP Participation Rate" />
            <LegendDot color={colors.wellbeing} label="Average Wellbeing Score" />
            <PeriodSelect value={period} onChange={onPeriodChange} />
          </div>
        }
      />

      <ResponsiveContainer width="100%" height={252}>
        <AreaChart data={data} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gradientId}-p`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.participation} stopOpacity={0.16} />
              <stop offset="100%" stopColor={colors.participation} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${gradientId}-w`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.wellbeing} stopOpacity={0.18} />
              <stop offset="100%" stopColor={colors.wellbeing} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={A.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: A.slateLight }} axisLine={false} tickLine={false} dy={6} />
          <YAxis yAxisId="left" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12, fill: A.slateLight }} axisLine={false} tickLine={false} width={54} />
          <YAxis yAxisId="right" orientation="right" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: A.slateLight }} axisLine={false} tickLine={false} width={28} />
          <Tooltip cursor={{ stroke: A.borderStrong, strokeWidth: 1 }}
            content={<TrendTooltip style={tipStyle} colors={colors} />} />
          <Area yAxisId="right" type="monotone" dataKey="wellbeing" name="Average Wellbeing Score"
            stroke={colors.wellbeing} strokeWidth={2.2} fill={`url(#${gradientId}-w)`}
            dot={{ r: 3.2, fill: colors.wellbeing, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Area yAxisId="left" type="monotone" dataKey="participation" name="EAP Participation Rate"
            stroke={colors.participation} strokeWidth={2.2} fill={`url(#${gradientId}-p)`}
            dot={{ r: 3.2, fill: colors.participation, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default ProgramOverviewChart;
