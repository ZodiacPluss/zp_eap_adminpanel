import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/app/components/ui/Card";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { useAccents, useTipStyle } from "@/app/theme/ThemeProvider";

/** Donut split of the workforce, with the participating share called out in the middle. */
export function ParticipationChart({ participation }) {
  const A = useAccents();
  const tipStyle = useTipStyle();
  const { rate, segments } = participation;
  const data = segments.map((segment) => ({ ...segment, color: A[segment.tone] ?? A.brand }));

  return (
    <Card className="flex h-full flex-col px-4 pb-4 pt-5 sm:px-6 sm:pb-5">
      <SectionHeader large title="Participation" sub="Employee participation in the EAP program." />

      <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row sm:justify-between lg:flex-col xl:flex-row">
        <div className="relative h-[176px] w-[176px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="pct" nameKey="label" innerRadius="70%" outerRadius="100%"
                startAngle={90} endAngle={-270} paddingAngle={1.5} stroke="none" isAnimationActive={false}>
                {data.map((segment) => <Cell key={segment.id} fill={segment.color} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} formatter={(value, name, entry) => [`${entry.payload.value} · ${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[30px] font-semibold leading-none tracking-[-0.02em] text-[var(--zp-navy)]">{rate}%</span>
            <span className="mt-1.5 text-[12.5px] text-[var(--zp-slate)]">Participating</span>
          </div>
        </div>

        <ul className="w-full min-w-0 max-w-[260px] space-y-[18px]">
          {data.map((segment) => (
            <li key={segment.id} className="flex items-center gap-3 text-[13px]">
              <span aria-hidden="true" className="h-[11px] w-[11px] shrink-0 rounded-full" style={{ background: segment.color }} />
              <span className="min-w-0 flex-1 truncate text-[var(--zp-slate)]">{segment.label}</span>
              <span className="w-10 shrink-0 text-right font-semibold text-[var(--zp-navy)]">{segment.value}</span>
              <span className="w-9 shrink-0 text-right text-[var(--zp-slate)]">{segment.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default ParticipationChart;
