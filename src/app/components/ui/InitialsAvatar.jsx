import React from "react";
import { avatarGrad, initials } from "@/app/data/designTokens";

// Tinted circle + coloured initials, used by the redesigned pages.
const SOFT_TONES = [
  "bg-[var(--zp-brand)]/12 text-[var(--zp-brand-deep)]",
  "bg-[var(--zp-emerald)]/12 text-[var(--zp-emerald)]",
  "bg-[var(--zp-violet)]/12 text-[var(--zp-violet)]",
  "bg-[var(--zp-rose)]/10 text-[var(--zp-rose)]",
  "bg-[var(--zp-teal)]/12 text-[var(--zp-teal)]",
];

export function InitialsAvatar({ name, idx = 0, size = "w-8 h-8", soft = false }) {
  if (soft) {
    return (
      <div className={`${size} flex shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${SOFT_TONES[Math.abs(idx) % SOFT_TONES.length]}`}>
        {initials(name)}
      </div>
    );
  }
  return (
    <div className={`${size} rounded-xl flex items-center justify-center text-[10.5px] font-bold text-white flex-shrink-0`}
      style={{ background: avatarGrad(idx) }}>
      {initials(name)}
    </div>
  );
}

export default InitialsAvatar;
