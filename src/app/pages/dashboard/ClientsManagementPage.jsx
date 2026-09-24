import React, { useState } from "react";
import { Users, Activity, UserPlus, TrendingDown, Search, Filter, Download, MoreHorizontal } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { fmtK } from "@/app/data/designTokens";
import { usePalette, useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { monthlyGrowth, clients } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { useIsMobile } from "@/app/hooks/useResponsive";

export default function ClientsManagementPage() {
  const P = usePalette();
  const A = useAccents();
  const tipStyle = useTipStyle();
  const isMobile = useIsMobile();
  const [q, setQ] = useState("");
  const rows = clients.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  const plans = [
    { plan: "Premium+", count: 3840, pct: 15.4, color: P.violet },
    { plan: "Premium", count: 8920, pct: 35.8, color: P.teal },
    { plan: "Basic", count: 7640, pct: 30.7, color: P.emerald },
    { plan: "EAP", count: 4491, pct: 18.0, color: P.amber },
  ];
  return (
    <PageShell title="Client Users" sub="Manage all registered client accounts">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={Users} label="Total Clients" value="24,891" sub="All time" trend={5.8} color={P.teal} gradient />
        <KpiCard icon={Activity} label="Active (30d)" value="18,420" sub="74% of total" trend={3.1} color={P.emerald} gradient />
        <KpiCard icon={UserPlus} label="New Today" value="312" sub="+18% vs yesterday" trend={18} color={P.violet} gradient />
        <KpiCard icon={TrendingDown} label="Churned (30d)" value="284" sub="1.1% churn rate" trend={-4.2} color={P.amber} gradient />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card className="col-span-1 xl:col-span-2 p-6">
          <SectionHeader title="Client Growth" sub="Monthly total clients" />
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyGrowth} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gcl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={A.teal} stopOpacity={0.2} /><stop offset="95%" stopColor={A.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="c" name="Clients" stroke={A.teal} strokeWidth={2.5} fill="url(#gcl)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Subscription Plans" sub="Active breakdown" />
          <div className="space-y-4 mt-1">
            {plans.map(p => (
              <div key={p.plan}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-semibold text-[var(--zp-navy)]">{p.plan}</span>
                  <span style={{ color: P.slate, fontFamily: "'IBM Plex Sans',sans-serif" }}>{p.count.toLocaleString()} · {p.pct}%</span>
                </div>
                <ProgressBar pct={p.pct * 2.5} color={p.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <div className={`flex ${isMobile ? "flex-col items-stretch gap-3" : "flex-wrap items-start justify-between"} mb-5`}>
          <div><h2 className="text-[14.5px] font-bold text-[var(--zp-navy)]">Client Directory</h2><p className="text-[11.5px]" style={{ color: P.slateLight }}>{rows.length} users shown</p></div>
          <div className={`flex flex-wrap gap-2 ${isMobile ? "w-full" : "ml-auto"}`}>
            <div className={`relative ${isMobile ? "flex-1" : ""}`}>
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: P.slateLight }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
                className={`pl-8 pr-3 py-2 text-[12px] rounded-xl focus:outline-none ${isMobile ? "w-full" : "w-44"}`}
                style={{ border: `1px solid ${P.border}`, background: P.surface }} />
            </div>
            {[["Filter", Filter], ["Export", Download]].map(([l, Icon]) => (
              <button key={l} className="flex items-center justify-center gap-1.5 text-[12px] px-3 py-2 rounded-xl hover:bg-[var(--zp-hover)] transition-all flex-1 sm:flex-initial"
                style={{ border: `1px solid ${P.border}`, color: P.slate }}>
                <Icon size={13} />{l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["ID", "Name", "Plan", "Zodiac", "Sessions", "Status", "Joined", ""]} />
            <tbody>
              {rows.map((u, i) => (
                <tr key={u.id} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < rows.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4 text-[10.5px] font-mono" style={{ color: P.slateLight }}>{u.id}</td>
                  <td className="py-3 pr-4"><div className="flex items-center gap-2.5"><InitialsAvatar name={u.name} idx={i} /><div><div className="text-[12.5px] font-semibold text-[var(--zp-navy)]">{u.name}</div><div className="text-[10.5px]" style={{ color: P.slateLight }}>{u.email}</div></div></div></td>
                  <td className="py-3 pr-4"><span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: P.tealLight, color: P.teal }}>{u.plan}</span></td>
                  <td className="py-3 pr-4 text-[12.5px]" style={{ color: P.slate }}>{u.sign}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{u.sessions}</td>
                  <td className="py-3 pr-4"><StatusBadge s={u.status} /></td>
                  <td className="py-3 pr-4 text-[11px]" style={{ color: P.slateLight }}>{u.joined}</td>
                  <td className="py-3"><button style={{ color: P.slateLight }} className="hover:text-[var(--zp-navy)]"><MoreHorizontal size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}
