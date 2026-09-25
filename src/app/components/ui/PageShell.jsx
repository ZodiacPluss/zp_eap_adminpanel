import React from "react";
import { useIsMobile } from "@/app/hooks/useResponsive";
import { usePalette } from "@/app/theme/ThemeProvider";
/**
 * `large` is the heading scale of the redesigned pages. `eyebrow` renders above
 * the title (e.g. a breadcrumb) and `titleAddon` beside it (e.g. a status badge).
 */
export function PageShell({ title, sub, action, children, large = false, eyebrow, titleAddon }) {
  const P = usePalette();
  const isMobile = useIsMobile();
  return (
    <div>
      {eyebrow}
      <div className={`flex ${isMobile ? "flex-col gap-3 items-stretch" : "items-start justify-between gap-4"} ${large ? "mb-[18px]" : "mb-7"}`}>
        <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h1 className={large ? "text-[30px] font-semibold leading-tight tracking-[-0.02em] text-[var(--zp-navy)] sm:text-[36px]" : "text-[22px] font-bold text-[var(--zp-navy)] tracking-tight"}>{title}</h1>
            {titleAddon}
          </div>
          {sub && (large
            ? <p className="mt-1.5 text-[15px] text-[var(--zp-slate)] sm:text-[16px]">{sub}</p>
            : <p className="text-[12.5px] mt-1" style={{ color: P.slateLight }}>{sub}</p>)}
        </div>
        {action && <div className={isMobile ? "w-full flex" : ""}>{action}</div>}
      </div>
      {children}
    </div>
  );
}

export default PageShell;
