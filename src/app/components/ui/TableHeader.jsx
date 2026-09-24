import React from "react";
import { usePalette } from "@/app/theme/ThemeProvider";
export function TableHeader({ cols }) {
  const P = usePalette();
  return (
    <thead>
      <tr style={{ borderBottom: `1px solid ${P.border}` }}>
        {cols.map(c => (
          <th key={c} className="text-left text-[10.5px] font-semibold uppercase tracking-wide pb-3 pr-4" style={{ color: P.slateLight }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
