import React, { useState } from "react";
import { UserPlus, MessageSquare, Download, UserCheck, Plus } from "lucide-react";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { readableInk } from "@/app/theme/palette";
import { useIsMobile } from "@/app/hooks/useResponsive";

export default function QuickActionButton() {
  const P = usePalette();
  const A = useAccents();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const actions = [
    // Literal hex: `readableInk` measures the luminance of each fill.
    { label: "New User", icon: UserPlus, color: A.teal },
    { label: "New Ticket", icon: MessageSquare, color: A.violet },
    { label: "Export Report", icon: Download, color: A.emerald },
    { label: "Add Expert", icon: UserCheck, color: A.amber },
  ];
  return (
    <div className={`fixed ${isMobile ? "bottom-4 right-4" : "bottom-8 right-8"} z-50 flex flex-col items-end gap-2`}>
      {open && actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <div key={a.label} className="flex items-center gap-2.5 group"
            style={{ animation: `fadeSlideUp 0.18s ease both`, animationDelay: `${i * 40}ms` }}>
            <div className="text-[11.5px] font-semibold bg-[var(--zp-card)] px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: P.navy, border: `1px solid ${P.border}` }}>{a.label}</div>
            <button className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all"
              style={{ background: a.color, color: readableInk(a.color) }}>
              <Icon size={17} />
            </button>
          </div>
        );
      })}
      <button onClick={() => setOpen(v => !v)}
        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
        style={{ background: `linear-gradient(135deg,${P.teal},${P.tealDark})`, color: P.onAccent }}>
        <div className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          <Plus size={22} />
        </div>
      </button>
    </div>
  );
}
