import React from "react";
import { Card } from "@/app/components/ui/Card";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { useAccents } from "@/app/theme/ThemeProvider";

const COLS = ["Department", "Total Employees", "Participation Rate", "Avg. Wellbeing Score"];

/** Per-department participation and wellbeing, with an inline rate meter. */
export function DepartmentInsights({ departments }) {
  const A = useAccents();

  return (
    <Card className="px-4 pb-2 pt-5 sm:px-6">
      <SectionHeader large title="Department Insights" sub="EAP participation and wellbeing score by department." />

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[620px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--zp-border)]">
              {COLS.map((col) => (
                <th key={col} className="pb-3 pr-6 text-left text-[12.5px] font-normal text-[var(--zp-slate)] last:pr-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map(({ id, name, employees, participation, wellbeing, icon: Icon, tone }) => {
              const accent = A[tone] ?? A.brand;
              return (
                <tr key={id} className="border-b border-[var(--zp-border)] transition-colors last:border-b-0 hover:bg-[var(--zp-hover)]">
                  <td className="py-[13px] pr-6">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: `${accent}1f` }}>
                        <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} style={{ color: accent }} />
                      </span>
                      <span className="text-[13.5px] font-medium text-[var(--zp-navy)]">{name}</span>
                    </div>
                  </td>
                  <td className="py-[13px] pr-6 text-[13.5px] text-[var(--zp-navy)]">{employees}</td>
                  <td className="py-[13px] pr-6">
                    <div className="flex items-center gap-3">
                      <span className="w-9 shrink-0 text-[13.5px] text-[var(--zp-navy)]">{participation}%</span>
                      <ProgressBar pct={participation} color={A.emerald} className="h-2 w-full min-w-[90px] max-w-[160px] bg-[var(--zp-border-strong)]" />
                    </div>
                  </td>
                  <td className="py-[13px] text-[13.5px] text-[var(--zp-navy)]">{wellbeing.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DepartmentInsights;
