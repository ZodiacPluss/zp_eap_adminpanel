import React from "react";
import { Target, Eye, Zap, Award } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { usePalette, useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { retentionData, revenueMonthly, expertCats } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { ProgressBar } from "@/app/components/ui/ProgressBar";

export default function AnalyticsInsightsPage() {
  const P = usePalette();
  const A = useAccents();
  const tipStyle = useTipStyle();
  return (
    <PageShell title="Analytics" sub="Deep platform insights, retention, and engagement data">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={Target} label="D7 Retention" value="82%" sub="+2% vs last month" trend={2.5} color={P.teal} gradient />
        <KpiCard icon={Eye} label="D30 Retention" value="65%" sub="+2% vs last month" trend={3.2} color={P.emerald} gradient />
        <KpiCard icon={Zap} label="Avg Session" value="41.3 min" sub="+3.4 min" trend={8.9} color={P.violet} gradient />
        <KpiCard icon={Award} label="NPS Score" value="72" sub="World-class (>50)" trend={4.3} color={P.amber} gradient />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card className="p-6">
          <SectionHeader title="User Retention Cohorts" sub="D7 / D30 / D90 rates" />
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={retentionData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Line type="monotone" dataKey="d7" name="Day 7" stroke={A.teal} strokeWidth={2.5} dot={{ r: 3.5, fill: A.teal, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="d30" name="Day 30" stroke={A.emerald} strokeWidth={2.5} dot={{ r: 3.5, fill: A.emerald, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="d90" name="Day 90" stroke={A.amber} strokeWidth={2.5} dot={{ r: 3.5, fill: A.amber, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Total Revenue Trend" sub="All streams combined — Jul 2025–Jul 2026" />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={revenueMonthly.map(r => ({ ...r, total: r.sub + r.sess + r.eap }))} margin={{ top: 2, right: 2, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="grev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={A.teal} stopOpacity={0.2} /><stop offset="95%" stopColor={A.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`₹${(v / 1000).toFixed(1)}K`, ""]} contentStyle={tipStyle} />
              <Area type="monotone" dataKey="total" name="Total Revenue" stroke={A.teal} strokeWidth={2.5} fill="url(#grev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="col-span-1 xl:col-span-2 p-6">
          <SectionHeader title="Category Performance" sub="Sessions vs expert count" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expertCats} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} vertical={false} />
              <XAxis dataKey="cat" tick={{ fontSize: 10, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
              <Tooltip contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="sessions" name="Sessions" fill={A.teal} radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="experts" name="Experts" fill={A.emerald} radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Platform Health" />
          <div className="space-y-4">
            {[
              { l: "iOS App Rating", v: "4.8★", p: 96, c: P.amber },
              { l: "Android Rating", v: "4.6★", p: 92, c: P.amber },
              { l: "Session Completion", v: "94%", p: 94, c: P.teal },
              { l: "Expert Satisfaction", v: "91%", p: 91, c: P.emerald },
              { l: "Support CSAT", v: "88%", p: 88, c: P.violet },
              { l: "System Uptime", v: "99.97%", p: 99.97, c: P.emerald },
            ].map(m => (
              <div key={m.l}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span style={{ color: P.slate }}>{m.l}</span>
                  <span className="font-bold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{m.v}</span>
                </div>
                <ProgressBar pct={m.p} color={m.c} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
