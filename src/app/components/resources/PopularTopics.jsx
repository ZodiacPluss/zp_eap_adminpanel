import React from "react";
import { Card } from "@/app/components/ui/Card";
import { useAccents } from "@/app/theme/ThemeProvider";

/** Topic shortcuts; each one applies its category to the library below. */
export function PopularTopics({ topics, onSelect }) {
  const A = useAccents();

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {topics.map(({ id, label, icon: Icon, tone, categoryId }) => {
        const accent = A[tone] ?? A.brand;
        return (
          <li key={id}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <button type="button" onClick={() => onSelect(categoryId)}
                className="flex h-full w-full items-center gap-3 rounded-2xl px-3.5 py-4 text-left transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${accent}1f` }}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} style={{ color: accent }} />
                </span>
                <span className="min-w-0 text-[13px] font-medium leading-[17px] text-[var(--zp-navy)]">{label}</span>
              </button>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export default PopularTopics;
