import React from "react";

/** `large` is the Home page's card heading scale. */
export function SectionHeader({ title, sub, right, large = false }) {
  return (
    <div className={`flex justify-between gap-3 mb-5 ${large ? "items-start" : "items-center"}`}>
      <div>
        <h2 className={large ? "text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[var(--zp-navy)]" : "text-[14.5px] font-bold text-[var(--zp-navy)]"}>{title}</h2>
        {sub && <p className={large ? "mt-1 text-[13px] text-[var(--zp-slate-light)]" : "text-[11.5px] text-[var(--zp-slate-light)] mt-0.5"}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export default SectionHeader;
