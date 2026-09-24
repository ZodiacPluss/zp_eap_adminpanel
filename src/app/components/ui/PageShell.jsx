import React from "react";
import { useIsMobile } from "@/app/hooks/useResponsive";
import { usePalette } from "@/app/theme/ThemeProvider";
export function PageShell({ title, sub, action, children }) {
  const P = usePalette();
  const isMobile = useIsMobile();
  return (
    <div>
      <div className={`flex ${isMobile ? "flex-col gap-3 items-stretch" : "items-start justify-between"} mb-7`}>
        <div>
          <h1 className="text-[22px] font-bold text-[var(--zp-navy)] tracking-tight">{title}</h1>
          {sub && <p className="text-[12.5px] mt-1" style={{ color: P.slateLight }}>{sub}</p>}
        </div>
        {action && <div className={isMobile ? "w-full flex" : ""}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

export default PageShell;
