import React from "react";
import { UserPlus, Crown, CheckCircle, Shield, Activity, Filter, Trash2, UserCog } from "lucide-react";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { adminTeam } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { KpiCard } from "@/app/components/ui/KpiCard";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressBar } from "@/app/components/ui/ProgressBar";

export default function AdminTeamManagementPage() {
  const P = usePalette();
  const A = useAccents();
  // Literal hex: these are tinted with an alpha suffix.
  const deptColors = { Executive: A.teal, Finance: A.emerald, Support: A.violet, Product: A.amber, Marketing: A.rose };
  return (
    <PageShell title="Admin Team" sub="Manage admin accounts, roles, and access permissions"
      action={<button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[var(--zp-on-accent)] text-[12.5px] font-semibold" style={{ background: `linear-gradient(135deg,${P.teal},${P.tealDark})` }}><UserPlus size={14} />Invite Admin</button>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Crown} label="Total Admins" value="6" sub="1 Super Admin" trend={0} color={P.teal} gradient />
        <KpiCard icon={CheckCircle} label="Active Now" value="4" sub="Online in last 30 min" trend={0} color={P.emerald} gradient />
        <KpiCard icon={Shield} label="Departments" value="5" sub="Exec, Finance, Support…" trend={0} color={P.violet} gradient />
        <KpiCard icon={Activity} label="Actions Today" value="142" sub="Across all admins" trend={12.4} color={P.amber} gradient />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card className="p-6">
          <SectionHeader title="Department Breakdown" sub="Admin distribution by department" />
          <div className="space-y-3 mt-2">
            {[
              { dept: "Executive", count: 1, pct: 17, color: P.teal },
              { dept: "Support", count: 2, pct: 33, color: P.violet },
              { dept: "Finance", count: 1, pct: 17, color: P.emerald },
              { dept: "Product", count: 1, pct: 17, color: P.amber },
              { dept: "Marketing", count: 1, pct: 17, color: P.rose },
            ].map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-semibold text-[var(--zp-navy)]">{d.dept}</span>
                  <span style={{ color: P.slate }}>{d.count} admin{d.count > 1 ? "s" : ""} · {d.pct}%</span>
                </div>
                <ProgressBar pct={d.pct * 2} color={d.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader title="Permission Sets" sub="Access levels across the team" />
          <div className="space-y-3">
            {[
              { label: "Full Access (Super Admin)", count: 1, color: P.teal },
              { label: "Finance & Reports", count: 1, color: P.emerald },
              { label: "Support & Users", count: 2, color: P.violet },
              { label: "Content & Experts", count: 1, color: P.amber },
              { label: "Analytics Only", count: 1, color: P.rose },
            ].map(p => (
              <div key={p.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-[12.5px] font-medium text-[var(--zp-navy)]">{p.label}</span>
                </div>
                <span className="text-[12px] font-bold" style={{ color: P.slate, fontFamily: "'IBM Plex Sans',sans-serif" }}>{p.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeader title="Admin Directory" sub={`${adminTeam.length} team members`}
          right={<div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}><Filter size={13} />Filter</button>
          </div>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader cols={["Admin", "Role", "Department", "Email", "Last Login", "Status", ""]} />
            <tbody>
              {adminTeam.map((a, i) => (
                <tr key={a.id} className="hover:bg-[var(--zp-hover)] transition-colors"
                  style={{ borderBottom: i < adminTeam.length - 1 ? `1px solid ${P.border}` : "none" }}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <InitialsAvatar name={a.name} idx={i} />
                        {a.status === "active" && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--zp-card)]" style={{ background: P.emerald }} />}
                      </div>
                      <div>
                        <div className="text-[12.5px] font-semibold text-[var(--zp-navy)] flex items-center gap-1.5">
                          {a.name}
                          {a.role === "Super Admin" && <Crown size={11} style={{ color: P.amber }} />}
                        </div>
                        <div className="text-[10.5px] font-mono" style={{ color: P.slateLight }}>{a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${deptColors[a.dept] || A.slate}18`, color: deptColors[a.dept] || A.slate }}>{a.role}</span>
                  </td>
                  <td className="py-3 pr-4 text-[12px]" style={{ color: P.slate }}>{a.dept}</td>
                  <td className="py-3 pr-4 text-[11.5px]" style={{ color: P.slateLight }}>{a.email}</td>
                  <td className="py-3 pr-4 text-[11.5px]" style={{ color: P.slateLight }}>{a.lastLogin}</td>
                  <td className="py-3 pr-4"><StatusBadge s={a.status} /></td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button style={{ color: P.slateLight }} className="hover:text-[var(--zp-navy)] p-1 transition-colors"><UserCog size={14} /></button>
                      <button style={{ color: P.slateLight }} className="hover:text-[var(--zp-rose)] p-1 transition-colors"><Trash2 size={14} /></button>
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
