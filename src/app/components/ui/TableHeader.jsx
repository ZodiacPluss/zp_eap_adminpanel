import React from "react";
import { usePalette } from "@/app/theme/ThemeProvider";
import { cn } from "./utils";
export function TableHeader({ cols, className }) {
  const P = usePalette();
  return (
    <thead>
      <tr style={{ borderBottom: `1px solid ${P.border}` }}>
        {cols.map(c => (
          <th key={c} className={cn("text-left text-[10.5px] font-semibold uppercase tracking-wide pb-3 pr-4", className)} style={{ color: P.slateLight }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
