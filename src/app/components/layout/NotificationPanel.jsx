import React, { useState } from "react";
import { X } from "lucide-react";
import { NOTIFICATIONS } from "@/app/data/mockData";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { useIsMobile } from "@/app/hooks/useResponsive";

export default function NotificationPanel({ onClose }) {
  const P = usePalette();
  const A = useAccents();
  const isMobile = useIsMobile();
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const unread = notes.filter(n => !n.read).length;
  const markAll = () => setNotes(prev => prev.map(n => ({ ...n, read: true })));
  const markOne = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: P.overlay, backdropFilter: "blur(4px)" }} onClick={onClose}>
        <div className="mt-auto rounded-t-3xl max-h-[85vh] flex flex-col animate-slideUp"
          style={{ background: P.card, boxShadow: `0 -12px 48px ${P.shadow}` }} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
            <div>
              <h3 className="text-[16px] font-bold text-[var(--zp-navy)]">Notifications</h3>
              {unread > 0 && <p className="text-[11px] text-[var(--zp-slate-light)]">{unread} unread</p>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && <button onClick={markAll} className="text-[11px] font-semibold hover:underline" style={{ color: P.teal }}>Mark all read</button>}
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--zp-hover)] transition-all" style={{ color: P.slate }}><X size={14} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.map(n => {
              const Icon = n.icon;
              const accent = A[n.tone] ?? A.teal;
              return (
                <div key={n.id} className={`flex gap-3 px-5 py-3.5 cursor-pointer transition-all hover:bg-[var(--zp-hover)] ${!n.read ? "bg-[var(--zp-brand-soft)]" : ""}`}
                  style={{ borderBottom: `1px solid ${P.border}` }} onClick={() => markOne(n.id)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${accent}24` }}><Icon size={15} style={{ color: accent }} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[12.5px] font-semibold text-[var(--zp-navy)] leading-snug ${!n.read ? "" : "font-medium"}`}>{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: P.teal }} />}
                    </div>
                    <p className="text-[11px] leading-snug mt-0.5" style={{ color: P.slateLight }}>{n.body}</p>
                    <span className="text-[10px] mt-1 block" style={{ color: P.slateLight }}>{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 text-center" style={{ borderTop: `1px solid ${P.border}` }}>
            <button className="text-[12px] font-semibold hover:underline" style={{ color: P.teal }}>View all notifications</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-12 right-0 w-[380px] rounded-2xl overflow-hidden z-50"
      style={{ background: P.card, border: `1px solid ${P.border}`, boxShadow: `0 20px 48px ${P.shadow}` }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <div>
          <h3 className="text-[14px] font-bold text-[var(--zp-navy)]">Notifications</h3>
          {unread > 0 && <p className="text-[11px] text-[var(--zp-slate-light)]">{unread} unread</p>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAll} className="text-[11px] font-semibold hover:underline" style={{ color: P.teal }}>Mark all read</button>
          )}
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--zp-hover)] transition-all" style={{ color: P.slate }}>
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {notes.map(n => {
          const Icon = n.icon;
          const accent = A[n.tone] ?? A.teal;
          return (
            <div key={n.id}
              className={`flex gap-3 px-5 py-3.5 cursor-pointer transition-all hover:bg-[var(--zp-hover)] ${!n.read ? "bg-[var(--zp-brand-soft)]" : ""}`}
              style={{ borderBottom: `1px solid ${P.border}` }}
              onClick={() => markOne(n.id)}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${accent}24` }}>
                <Icon size={15} style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[12.5px] font-semibold text-[var(--zp-navy)] leading-snug ${!n.read ? "" : "font-medium"}`}>{n.title}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: P.teal }} />}
                </div>
                <p className="text-[11px] leading-snug mt-0.5" style={{ color: P.slateLight }}>{n.body}</p>
                <span className="text-[10px] mt-1 block" style={{ color: P.slateLight }}>{n.time}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 text-center" style={{ borderTop: `1px solid ${P.border}` }}>
        <button className="text-[12px] font-semibold hover:underline" style={{ color: P.teal }}>View all notifications</button>
      </div>
    </div>
  );
}
