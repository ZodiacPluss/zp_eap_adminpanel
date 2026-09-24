import React from "react";

export function SectionHeader({ title, sub, right }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-[14.5px] font-bold text-[var(--zp-navy)]">{title}</h2>
        {sub && <p className="text-[11.5px] text-[var(--zp-slate-light)] mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export default SectionHeader;
