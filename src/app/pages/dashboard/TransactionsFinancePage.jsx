import React from "react";
import { TrendingUp, Wallet, CreditCard, ArrowUpRight, Download } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RPie, Pie, Cell, ResponsiveContainer } from "recharts";
import { fmtINR } from "@/app/data/designTokens";
import { usePalette, useAccents, useTipStyle } from "@/app/theme/ThemeProvider";
import { revenueMonthly, transactions } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";

export default function TransactionsFinancePage() {
  const P = usePalette();
  const A = useAccents();
  const tipStyle = useTipStyle();
  return (
    <PageShell title="Finance" sub="Revenue, payouts, and transaction management">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard icon={TrendingUp} label="Revenue (Jul)" value="₹1.84Cr" sub="92% of ₹2Cr target" trend={12.1} color={P.emerald} gradient />
        <KpiCard icon={Wallet} label="Subscriptions" value="₹1.08Cr" sub="59% of total" trend={8.4} color={P.teal} gradient />
        <KpiCard icon={CreditCard} label="Session Revenue" value="₹55.8L" sub="30% of total" trend={14.2} color={P.violet} gradient />
        <KpiCard icon={ArrowUpRight} label="Expert Payouts" value="₹38.4L" sub="Processed this month" trend={9.8} color={P.amber} gradient />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card className="col-span-1 xl:col-span-2 p-6">
          <SectionHeader title="Revenue by Source" sub="Jan–Jul 2026 · stacked by stream" />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueMonthly} margin={{ top: 2, right: 2, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.grid} vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: A.slateLight }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`₹${(v / 1000).toFixed(1)}K`, ""]} contentStyle={tipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="sub" name="Subscription" fill={A.teal} stackId="a" />
              <Bar dataKey="sess" name="Session" fill={A.emerald} stackId="a" />
              <Bar dataKey="eap" name="EAP" fill={A.amber} stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <SectionHeader title="Revenue Mix" sub="July 2026" />
          <ResponsiveContainer width="100%" height={155}>
            <RPie>
              <Pie data={[{ v: 108200, c: A.teal }, { v: 55800, c: A.emerald }, { v: 35100, c: A.amber }]}
                cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={4} dataKey="v" stroke="none">
                {[A.teal, A.emerald, A.amber].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${(v / 1000).toFixed(1)}K`, ""]} contentStyle={tipStyle} />
            </RPie>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {[{ n: "Subscription", p: "54.6%", a: "₹1.08Cr", c: P.teal }, { n: "Session", p: "28.2%", a: "₹55.8L", c: P.emerald }, { n: "EAP", p: "17.2%", a: "₹35.1L", c: P.amber }].map(d => (
              <div key={d.n} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.c }} /><span className="text-[12px]" style={{ color: P.slate }}>{d.n}</span></div>
                <div className="text-right"><div className="text-[12px] font-bold text-[var(--zp-navy)]">{d.a}</div><div className="text-[10px]" style={{ color: P.slateLight }}>{d.p}</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <SectionHeader title="Recent Transactions"
          right={<button className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}><Download size={13} />Export</button>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Txn ID", "User / Company", "Type", "Amount", "Method", "Status", "Date"]} />
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4 text-[10.5px] font-mono" style={{ color: P.slateLight }}>{t.id}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-semibold text-[var(--zp-navy)]">{t.user}</td>
                  <td className="py-3 pr-4 text-[12px]" style={{ color: P.slate }}>{t.type}</td>
                  <td className="py-3 pr-4 text-[12.5px] font-bold" style={{ color: t.amount < 0 ? P.rose : P.navy, fontFamily: "'IBM Plex Sans',sans-serif" }}>{fmtINR(t.amount)}</td>
                  <td className="py-3 pr-4 text-[12px]" style={{ color: P.slate }}>{t.method}</td>
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
