import React from "react";
import { MessageSquare, Clock, CheckCircle, Star, Filter } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RPie, Pie, Cell, ResponsiveContainer } from "recharts";
import { usePalette, useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { weekSessions, tickets } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";

export default function SupportInboxPage() {
  const P = usePalette();
  const A = useAccents();
  const tipStyle = useTipStyle();
  return (
    <PageShell title="Support Center" sub="Manage tickets, agent assignments, and SLA compliance">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={MessageSquare} label="Open Tickets" value="23" sub="High priority: 4" trend={-18.2} color={P.rose} gradient />
        <KpiCard icon={Clock} label="Avg Response" value="1.4h" sub="SLA target: 2h" trend={12.4} color={P.emerald} gradient />
        <KpiCard icon={CheckCircle} label="Resolved (7d)" value="184" sub="96.2% resolution rate" trend={8.1} color={P.teal} gradient />
        <KpiCard icon={Star} label="CSAT" value="4.4 / 5" sub="Based on 142 reviews" trend={3.2} color={P.amber} gradient />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card className="col-span-1 xl:col-span-2 p-6">
          <SectionHeader title="Ticket Volume" sub="This week — opened vs. resolved" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekSessions.map(d => ({ d: d.d, opened: Math.round(d.total / 155), resolved: Math.round(d.done / 155) }))}
              margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="opened" name="Opened" fill={`${A.rose}73`} radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill={A.emerald} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Ticket Categories" />
          <ResponsiveContainer width="100%" height={155}>
            <RPie>
              <Pie data={[
                { name: "Billing", value: 38, color: P.rose },
                { name: "App Bug", value: 28, color: P.amber },
                { name: "EAP", value: 18, color: P.violet },
                { name: "Expert", value: 12, color: P.emerald },
                { name: "Other", value: 4, color: P.slateLight },
              ]} cx="50%" cy="50%" outerRadius={66} paddingAngle={2} dataKey="value" stroke="none">
                {[A.rose, A.amber, A.violet, A.emerald, A.slateLight].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
            </RPie>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
            {[["Billing", "38%", P.rose], ["App Bug", "28%", P.amber], ["EAP", "18%", P.violet], ["Expert", "12%", P.emerald], ["Other", "4%", P.slateLight]].map(([n, p, c]) => (
              <div key={n} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                <span className="text-[10.5px]" style={{ color: P.slate }}>{n} {p}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <SectionHeader title="Ticket Queue"
          right={<div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}><Filter size={13} />Filter</button>
            <button className="text-[12px] px-4 py-2 rounded-xl text-[var(--zp-on-accent)] font-semibold" style={{ background: P.teal }}>+ New Ticket</button>
          </div>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Ticket ID", "User", "Type", "Subject", "Priority", "Agent", "Status", "Date"]} />
            <tbody>
              {tickets.map((t, i) => (
                <tr key={t.id} className="hover:bg-[var(--zp-hover)] transition-colors cursor-pointer"
                  style={{ borderBottom: i < tickets.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4 text-[10.5px] font-mono" style={{ color: P.slateLight }}>{t.id}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-semibold text-[var(--zp-navy)]">{t.user}</td>
                  <td className="py-3 pr-4"><span className="text-[10.5px] px-2 py-0.5 rounded-full" style={{ background: P.surface, color: P.slate }}>{t.type}</span></td>
                  <td className="py-3 pr-4 text-[12px] max-w-[180px] truncate" style={{ color: P.slate }}>{t.subject}</td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 text-[11px] capitalize" style={{ color: P.slate }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: { high: P.rose, medium: P.amber, low: P.emerald }[t.priority] }} />
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[12px]" style={{ color: t.agent ? P.slate : P.slateLight }}>{t.agent ?? <em>Unassigned</em>}</td>
                  <td className="py-3 pr-4"><StatusBadge s={t.status} /></td>
                  <td className="py-3 text-[11px]" style={{ color: P.slateLight }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}
