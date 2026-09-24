import React, { useState } from "react";
import { MonitorSmartphone, Layers, FileText, Cpu, Rocket, UserCheck, Phone, Globe, Star, MoreHorizontal, Plus, PenSquare, Trash2 } from "lucide-react";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { appReleases, featureFlags, contentItems } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressBar } from "@/app/components/ui/ProgressBar";

export default function OperationsReleasePage() {
  const P = usePalette();
  const A = useAccents();
  const [flags, setFlags] = useState(featureFlags);
  const toggleFlag = (name) => setFlags(prev => prev.map(f => f.name === name ? { ...f, status: !f.status } : f));

  return (
    <PageShell title="Business Operations" sub="App releases, feature flags, and content management">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={MonitorSmartphone} label="App Versions Live" value="4" sub="2 iOS · 2 Android" trend={0} color={P.teal} gradient />
        <KpiCard icon={Layers} label="Feature Flags" value="6" sub="4 active · 2 disabled" trend={0} color={P.emerald} gradient />
        <KpiCard icon={FileText} label="Content Items" value="284" sub="18 scheduled" trend={8.2} color={P.violet} gradient />
        <KpiCard icon={Cpu} label="System Uptime" value="99.97%" sub="Last 30 days" trend={0.02} color={P.amber} gradient />
      </div>

      <Card className="p-6 mb-4">
        <SectionHeader title="App Releases" sub="Current live versions across platforms"
          right={<button className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-xl text-[var(--zp-on-accent)] font-semibold" style={{ background: P.teal }}><Rocket size={13} />New Release</button>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Application", "Version", "Users", "Rating", "Release Date", "Status", ""]} />
            <tbody>
              {appReleases.map((r, i) => (
                <tr key={r.app} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < appReleases.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: r.app.includes("Expert") ? `${A.emerald}18` : r.app.includes("Admin") ? `${A.violet}18` : `${A.teal}18` }}>
                        {r.app.includes("Admin") ? <Globe size={15} style={{ color: P.violet }} />
                          : r.app.includes("Expert") ? <UserCheck size={15} style={{ color: P.emerald }} />
                            : <Phone size={15} style={{ color: P.teal }} />}
                      </div>
                      <span className="text-[12.5px] font-semibold text-[var(--zp-navy)]">{r.app}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><code className="text-[11.5px] font-mono px-2 py-0.5 rounded-lg" style={{ background: P.surface, color: P.navy }}>{r.version}</code></td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{r.users}</td>
                  <td className="py-3 pr-4">
                    {r.rating ? (
                      <div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-[12.5px] font-bold text-[var(--zp-navy)]">{r.rating}</span></div>
                    ) : <span className="text-[11px]" style={{ color: P.slateLight }}>N/A</span>}
                  </td>
                  <td className="py-3 pr-4 text-[11px]" style={{ color: P.slateLight }}>{r.date}</td>
                  <td className="py-3 pr-4"><StatusBadge s={r.status} /></td>
                  <td className="py-3"><button style={{ color: P.slateLight }} className="hover:text-[var(--zp-navy)]"><MoreHorizontal size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 mb-4">
        <SectionHeader title="Feature Flags" sub="Toggle features in real-time across environments"
          right={<button className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-xl text-[var(--zp-on-accent)] font-semibold" style={{ background: P.teal }}><Plus size={13} />Add Flag</button>} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {flags.map(f => (
            <div key={f.name} className="flex items-start gap-3 p-4 rounded-xl transition-all hover:bg-[var(--zp-hover)]"
              style={{ border: `1px solid ${P.border}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-bold text-[var(--zp-navy)] truncate">{f.name}</span>
                  <code className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: f.env === "Production" ? `${A.teal}18` : f.env === "Staging" ? `${A.amber}18` : P.surface, color: f.env === "Production" ? P.teal : f.env === "Staging" ? P.amber : P.slate }}>{f.env}</code>
                </div>
                <p className="text-[11.5px] leading-snug" style={{ color: P.slateLight }}>{f.desc}</p>
                {f.status && f.rollout > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10.5px] mb-1" style={{ color: P.slateLight }}>
                      <span>Rollout</span><span className="font-semibold">{f.rollout}%</span>
                    </div>
                    <ProgressBar pct={f.rollout} color={P.teal} />
                  </div>
                )}
              </div>
              <button onClick={() => toggleFlag(f.name)}
                className="relative w-11 h-6 rounded-full flex-shrink-0 mt-0.5 transition-colors duration-200"
                style={{ background: f.status ? P.teal : P.borderStrong }}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[var(--zp-card)] rounded-full shadow-sm transition-transform duration-200 ${f.status ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeader title="Content Management" sub="Articles, videos, and courses"
          right={<button className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-xl text-[var(--zp-on-accent)] font-semibold" style={{ background: P.teal }}><PenSquare size={13} />New Content</button>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Title", "Type", "Category", "Views", "Status", "Date", ""]} />
            <tbody>
              {contentItems.map((c, i) => (
                <tr key={c.title} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < contentItems.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4 max-w-[220px]"><div className="text-[12.5px] font-semibold text-[var(--zp-navy)] truncate">{c.title}</div></td>
                  <td className="py-3 pr-4"><span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${A.violet}15`, color: P.violet }}>{c.type}</span></td>
                  <td className="py-3 pr-4 text-[12px]" style={{ color: P.slate }}>{c.category}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{c.views > 0 ? c.views.toLocaleString() : "—"}</td>
                  <td className="py-3 pr-4"><StatusBadge s={c.status} /></td>
                  <td className="py-3 pr-4 text-[11px]" style={{ color: P.slateLight }}>{c.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button style={{ color: P.slateLight }} className="hover:text-[var(--zp-navy)] transition-colors p-1"><PenSquare size={13} /></button>
                      <button style={{ color: P.slateLight }} className="hover:text-[var(--zp-rose)] transition-colors p-1"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}
