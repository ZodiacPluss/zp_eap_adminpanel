import React from "react";
import { Card } from "@/app/components/ui/Card";
import { useAccents } from "@/app/theme/ThemeProvider";

/**
 * The category strip. Selecting the active chip again clears the filter, so the
 * row doubles as its own reset.
 */
export function CategoryFilters({ categories, selectedId, onSelect }) {
  const A = useAccents();

  return (
    <Card className="p-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {categories.map(({ id, label, icon: Icon, tone }) => {
          const accent = A[tone] ?? A.brand;
          const selected = selectedId === id;
          return (
            <li key={id}>
              <button type="button" onClick={() => onSelect(selected ? null : id)} aria-pressed={selected}
                className={`flex h-full w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30 ${
                  selected
                    ? "border-[var(--zp-brand)]/40 bg-[var(--zp-brand)]/[0.07]"
                    : "border-[var(--zp-border)] bg-[var(--zp-card)] hover:bg-[var(--zp-hover)]"
                }`}>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${accent}1f` }}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} style={{ color: accent }} />
                </span>
                <span className="min-w-0 text-[12.5px] font-medium leading-[16px] text-[var(--zp-navy)]">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default CategoryFilters;
