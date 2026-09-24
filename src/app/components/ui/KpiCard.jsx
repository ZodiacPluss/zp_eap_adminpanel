import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { readableInk, toLiteral } from "@/app/theme/palette";

export function KpiCard({ icon: Icon, label, value, sub, trend, color, gradient }) {
  const P = usePalette();
  const A = useAccents();
  // The tints below append an alpha suffix, which needs a literal hex, so the
  // incoming colour is resolved out of its `var()` form first.
  const accent = toLiteral(color, A);
  // Gradient tiles are filled with the accent itself, so the label colour has
  // to be picked from that accent rather than assumed to be white — the dark
  // palette's accents are far too bright to carry white text.
  const ink = gradient ? readableInk(accent) : null;
  const onDarkInk = ink === "#FFFFFF";

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ border: `1px solid ${P.border}`, background: gradient ? `linear-gradient(135deg,${accent}ee,${accent}bb)` : P.card }}>
      {gradient && (
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: onDarkInk ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.14)" }} />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: gradient ? (onDarkInk ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.3)") : `${accent}1a` }}>
          <Icon size={18} style={{ color: gradient ? ink : accent }} />
        </div>
        {trend !== undefined && (
          gradient ? (
            <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: onDarkInk ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.35)", color: ink }}>
              {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}{Math.abs(trend)}%
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${trend >= 0 ? A.emerald : A.rose}1f`, color: trend >= 0 ? P.emerald : P.rose }}>
              {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}{Math.abs(trend)}%
            </span>
          )
        )}
      </div>
      <div className="text-[22px] font-bold tracking-tight mb-0.5"
        style={{ color: gradient ? ink : P.navy, fontFamily: "'IBM Plex Sans',sans-serif" }}>{value}</div>
      <div className="text-[12.5px] font-medium"
        style={{ color: gradient ? ink : P.slate, opacity: gradient ? 0.85 : 1 }}>{label}</div>
      <div className="text-[11px] mt-0.5"
        style={{ color: gradient ? ink : P.slateLight, opacity: gradient ? 0.6 : 1 }}>{sub}</div>
    </div>
  );
}

export default KpiCard;
