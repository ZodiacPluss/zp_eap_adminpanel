import React, { useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CALENDAR_EVENTS } from "@/app/data/mockData";
import { avatarGrad } from "@/app/data/designTokens";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { Card } from "@/app/components/ui/Card";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { useIsMobile } from "@/app/hooks/useResponsive";

export default function EAPCalendarPage() {
  const P = usePalette();
  const A = useAccents();
  const isMobile = useIsMobile();
  const [calView, setCalView] = useState("Month");
  const [calMonth] = useState({ name: "October", year: 2026 });
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const startOffset = 3; // Thu
  const totalDays = 31;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: 30 - startOffset + 1 + i, isCurrentMonth: false });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, isCurrentMonth: true });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, isCurrentMonth: false });

  const getEventForDay = (day) => {
    if (!day) return null;
    return CALENDAR_EVENTS.find(e => e.month === 10 && e.day === day);
  };
  const getSpanningEventForDay = (day) => {
    if (!day) return null;
    return CALENDAR_EVENTS.find(e => e.month === 10 && day >= e.day && day < e.day + e.span && e.span > 1);
  };
  const isSpanStart = (day) => {
    if (!day) return null;
    return CALENDAR_EVENTS.find(e => e.month === 10 && e.day === day && e.span > 1);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-[22px] font-bold text-[var(--zp-navy)] tracking-tight">Calendar</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-5" style={{ minHeight: 680 }}>
        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            <div className="p-5">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[var(--zp-on-accent)] text-[13.5px] font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: `linear-gradient(135deg,${P.brand},${P.tealDark})` }}>
                <Plus size={16} />+ Add New Event
              </button>
            </div>

            <div className="px-5 pb-2">
              <p className="text-[13px] font-bold text-[var(--zp-navy)]">You are going to</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
              {CALENDAR_EVENTS.map((ev, i) => (
                <div key={ev.id}
                  className="flex gap-3 cursor-pointer group"
                  onMouseEnter={() => setHoveredEvent(ev.id)}
                  onMouseLeave={() => setHoveredEvent(null)}>
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: `${A[ev.tone]}2e` }}>
                    <InitialsAvatar name={ev.title} idx={i} size="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[var(--zp-navy)] leading-snug group-hover:text-[var(--zp-brand)] transition-colors">{ev.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: P.slateLight }}>{ev.date}</p>
                    <p className="text-[11px]" style={{ color: P.slateLight }}>{ev.address}</p>
                    {ev.location && <p className="text-[11px]" style={{ color: P.slateLight }}>{ev.location}</p>}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex -space-x-1.5">
                        {[0, 1, 2].map(j => (
                          <div key={j} className="w-5 h-5 rounded-full border-2 border-[var(--zp-card)] flex items-center justify-center text-[7px] font-bold text-white"
                            style={{ background: avatarGrad(i + j) }}>
                            {String.fromCharCode(65 + j)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 ml-0.5"
                        style={{ color: P.brand, borderColor: P.brand }}>
                        {ev.attendees}+
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold mt-2 transition-all hover:bg-[var(--zp-hover)]"
                style={{ border: `1.5px solid ${P.border}`, color: P.slate }}>
                See More
              </button>
            </div>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <Card className="p-5 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg hover:bg-[var(--zp-hover)] transition-all" style={{ color: P.slate }}>
                  Today
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--zp-hover)] transition-all" style={{ color: P.slate }}>
                    <ChevronLeft size={14} />
                  </button>
                  <h2 className="text-[17px] font-bold text-[var(--zp-navy)] w-44 text-center">
                    {calMonth.name} {calMonth.year}
                  </h2>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--zp-hover)] transition-all" style={{ color: P.slate }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${P.border}` }}>
                {["Day", "Week", "Month"].map(v => (
                  <button key={v} onClick={() => setCalView(v)}
                    className="px-4 py-1.5 text-[12px] font-semibold transition-all"
                    style={{
                      background: calView === v ? P.brand : P.card,
                      color: calView === v ? P.onAccent : P.slate,
                    }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map(d => (
                <div key={d} className="text-center text-[11px] font-bold tracking-wider py-2" style={{ color: P.slateLight }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-6" style={{ border: `1px solid ${P.border}`, borderRadius: 12, overflow: "hidden" }}>
              {cells.map((cell, idx) => {
                const singleEv = getEventForDay(cell.isCurrentMonth ? cell.day : null);
                const spanEv = getSpanningEventForDay(cell.isCurrentMonth ? cell.day : null);
                const spanStartEv = isSpanStart(cell.isCurrentMonth ? cell.day : null);
                const isToday = cell.isCurrentMonth && cell.day === 3;

                return (
                  <div key={idx} className="relative flex flex-col"
                    style={{
                      borderRight: (idx + 1) % 7 !== 0 ? `1px solid ${P.border}` : "none",
                      borderBottom: idx < 35 ? `1px solid ${P.border}` : "none",
                      background: cell.isCurrentMonth ? P.card : P.bg,
                      minHeight: isMobile ? 60 : 90,
                    }}>
                    <div className="px-2 pt-1.5 pb-0.5">
                      <span className={`text-[12.5px] font-bold inline-flex w-6 h-6 items-center justify-center rounded-full
                        ${isToday ? "text-[var(--zp-on-accent)]" : cell.isCurrentMonth ? "text-[var(--zp-navy)]" : "text-[var(--zp-slate-light)]"}`}
                        style={isToday ? { background: P.brand } : {}}>
                        {cell.day}
                      </span>
                    </div>

                    {singleEv && singleEv.span === 1 && (
                      <div className="mx-1 mb-1 px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all hover:opacity-80 relative"
                        style={{ background: `${A[singleEv.tone]}2e`, color: P[singleEv.tone] }}
                        onMouseEnter={() => setHoveredEvent(singleEv.id)}
                        onMouseLeave={() => setHoveredEvent(null)}>
                        {singleEv.title}

                        {hoveredEvent === singleEv.id && (
                          <div className="absolute left-full top-0 ml-2 z-50 w-[240px] bg-[var(--zp-card)] rounded-2xl shadow-2xl overflow-hidden"
                            style={{ border: `1px solid ${P.border}` }}>
                            <div className="w-full h-28 flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg,${A[singleEv.tone]}33,${A[singleEv.tone]}22)` }}>
                              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-[var(--zp-on-accent)]"
                                style={{ background: P[singleEv.tone] }}>
                                {singleEv.title[0]}
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-[13.5px] font-bold text-[var(--zp-navy)]">{singleEv.title}</p>
                              {singleEv.org && <p className="text-[11px] mt-0.5" style={{ color: P.teal }}>{singleEv.org}</p>}
                              <p className="text-[11px] mt-1.5" style={{ color: P.slateLight }}>{singleEv.date}</p>
                              <p className="text-[11px]" style={{ color: P.slateLight }}>{singleEv.address}</p>
                              <div className="flex items-center gap-1 mt-2.5">
                                <div className="flex -space-x-1.5">
                                  {[0, 1, 2].map(j => (
                                    <div key={j} className="w-6 h-6 rounded-full border-2 border-[var(--zp-card)] flex items-center justify-center text-[8px] font-bold text-white"
                                      style={{ background: avatarGrad(j) }}>
                                      {String.fromCharCode(65 + j)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 ml-0.5"
                                  style={{ color: P.brand, borderColor: P.brand }}>
                                  {singleEv.attendees}+
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {spanStartEv && (
                      <div className="absolute left-1 right-0 mx-0 bottom-2 h-5 z-10 flex items-center px-2"
                        style={{
                          background: `${A[spanStartEv.tone]}2e`,
                          borderRadius: "4px 0 0 4px",
                          width: `calc(${spanStartEv.span * 100}% - 4px)`,
                        }}>
                        <span className="text-[10px] font-semibold truncate" style={{ color: P[spanStartEv.tone] }}>
                          {spanStartEv.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: P.overlay, backdropFilter: "blur(4px)" }}>
          <div className="bg-[var(--zp-card)] rounded-2xl shadow-2xl w-[420px] p-6" style={{ border: `1px solid ${P.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-[var(--zp-navy)]">Add New Event</h3>
              <button onClick={() => setShowAddModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[var(--zp-hover)]" style={{ color: P.slate }}>
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {[["Event Title", "e.g. Design Conference"], ["Organiser", "e.g. Zillul Agency"], ["Date & Time", "e.g. Oct 3 at 07:19 AM"], ["Location", "e.g. New York"]].map(([lbl, ph]) => (
                <div key={lbl}>
                  <label className="text-[11.5px] font-semibold text-[var(--zp-navy)] mb-1 block">{lbl}</label>
                  <input placeholder={ph} className="w-full px-3 py-2.5 rounded-xl text-[12.5px] focus:outline-none transition-all"
                    style={{ border: `1px solid ${P.border}`, color: P.navy, fontFamily: "inherit" }}
                    onFocus={e => (e.currentTarget.style.borderColor = P.brand)}
                    onBlur={e => (e.currentTarget.style.borderColor = P.border)} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[var(--zp-hover)] transition-all"
                style={{ border: `1px solid ${P.border}`, color: P.slate }}>
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[var(--zp-on-accent)] text-[13px] font-semibold transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${P.brand},${P.tealDark})` }}>
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
