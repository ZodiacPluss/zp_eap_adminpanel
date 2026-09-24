import React from "react";
import { UserCheck, CheckCircle, Clock, Star, Download } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fmtK, fmtINR } from "@/app/data/designTokens";
import { usePalette, useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { expertCats, experts } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { StatusBadge } from "@/app/components/ui/StatusBadge";

export default function ExpertsManagementPage() {
  const P = usePalette();
  const A = useAccents();
  const tipStyle = useTipStyle();
  return (
    <PageShell title="Expert Users" sub="Manage verified experts and monitor performance">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={UserCheck} label="Total Experts" value="1,247" sub="All specialties" trend={3.2} color={P.emerald} gradient />
        <KpiCard icon={CheckCircle} label="Verified" value="1,174" sub="94.1% verification rate" trend={1.8} color={P.teal} gradient />
        <KpiCard icon={Clock} label="Pending Review" value="73" sub="Avg 2.4 days" trend={-12} color={P.amber} gradient />
        <KpiCard icon={Star} label="Avg Rating" value="4.72" sub="184K reviews" trend={0.8} color={P.violet} gradient />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card className="col-span-1 xl:col-span-2 p-6">
          <SectionHeader title="Sessions by Specialty" sub="Weekly volume" />
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={expertCats} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} vertical={false} />
              <XAxis dataKey="cat" tick={{ fontSize: 10, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="sessions" name="Sessions" fill={A.emerald} radius={[5, 5, 0, 0]} />
              <Bar dataKey="experts" name="Experts" fill={`${A.emerald}59`} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Top Earners" sub="This month" />
          <div className="space-y-4 mt-1">
            {experts.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2.5">
                <div className="text-[11px] font-bold w-4 flex-shrink-0" style={{ color: P.slateLight, fontFamily: "'IBM Plex Sans',sans-serif" }}>{i + 1}</div>
                <InitialsAvatar name={e.name} size="w-8 h-8" idx={i + 2} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[var(--zp-navy)] truncate">{e.name}</div>
                  <div className="text-[10.5px]" style={{ color: P.slateLight }}>{e.spec}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[12px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{fmtINR(e.earned)}</div>
                  <div className="flex items-center gap-0.5 justify-end"><Star size={9} className="fill-amber-400 text-amber-400" /><span className="text-[10.5px]" style={{ color: P.slate }}>{e.rating}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <SectionHeader title="Expert Directory"
          right={<button className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}><Download size={13} />Export</button>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Expert", "Specialty", "Rating", "Sessions", "Earnings", "Status"]} />
            <tbody>
              {experts.map((e, i) => (
                <tr key={e.id} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < experts.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4"><div className="flex items-center gap-2.5"><InitialsAvatar name={e.name} size="w-9 h-9" idx={i + 2} /><div><div className="text-[12.5px] font-semibold text-[var(--zp-navy)]">{e.name}</div><div className="text-[10.5px] font-mono" style={{ color: P.slateLight }}>{e.id}</div></div></div></td>
                  <td className="py-3 pr-4 text-[12.5px]" style={{ color: P.slate }}>{e.spec}</td>
                  <td className="py-3 pr-4"><div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-[12.5px] font-bold text-[var(--zp-navy)]">{e.rating}</span></div></td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{e.sessions.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{fmtINR(e.earned)}</td>
                  <td className="py-3"><StatusBadge s={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}
