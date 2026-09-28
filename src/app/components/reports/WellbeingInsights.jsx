import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { useAccents } from "@/app/theme/ThemeProvider";

/** Focus areas from the assessment results, each with its direction of travel. */
export function WellbeingInsights({ insights }) {
  const A = useAccents();

  return (
    <Card className="h-full px-4 pb-5 pt-5 sm:px-6">
      <SectionHeader large title="Wellbeing Insights" sub="Key areas of focus based on assessment results." />

      <ul className="space-y-3">
        {insights.map(({ id, title, detail, direction, icon: Icon, tone }) => {
          const accent = A[tone] ?? A.brand;
          const up = direction === "up";
          const Arrow = up ? ArrowUpRight : ArrowDownRight;
          const trend = up ? A.emerald : A.rose;
          return (
            <li key={id} className="flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-colors"
              style={{ background: `${trend}0f` }}>
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${accent}24` }}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} style={{ color: accent }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[var(--zp-navy)]">{title}</p>
                <p className="mt-0.5 truncate text-[12.5px] text-[var(--zp-slate)]">{detail}</p>
              </div>
              <Arrow className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} style={{ color: trend }}
                aria-label={up ? "Improving" : "Decreasing"} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default WellbeingInsights;
