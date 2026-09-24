import React, { useState } from "react";
import { UserCog, Settings, FileText, Shield, GitBranch, Download, RefreshCw } from "lucide-react";
import { usePalette } from "@/app/theme/ThemeProvider";
import { adminTeam } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";

export default function SettingsConfigPage({ profile, onSave }) {
  const P = usePalette();
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, digest: true });
  const [twofa, setTwofa] = useState(true);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [saved, setSaved] = useState(false);
  const updateProfile = (field, value) => {
    setSaved(false);
    setDraftProfile(current => ({ ...current, [field]: value }));
  };
  const handleSave = (event) => {
    event.preventDefault();
    onSave(draftProfile);
    setSaved(true);
  };
  const Toggle = ({ on, fn }) => (
    <button onClick={fn} className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200" style={{ background: on ? P.teal : P.borderStrong }}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[var(--zp-card)] rounded-full shadow-sm transition-transform duration-200 ${on ? "translate-x-5" : ""}`} />
    </button>
  );
  return (
    <PageShell title="Settings" sub="Platform configuration, admin preferences, and integrations">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-4">Admin Profile</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-[var(--zp-on-accent)]" style={{ background: `linear-gradient(135deg,${P.teal},${P.tealDark})` }}>RG</div>
              <div className="flex-1">
                 <div className="text-[15px] font-bold text-[var(--zp-navy)]">{draftProfile.name}</div>
                 <div className="text-[11.5px]" style={{ color: P.slateLight }}>{draftProfile.email}</div>
                 <div className="text-[11px] font-semibold mt-0.5" style={{ color: P.teal }}>{draftProfile.role} · Director &amp; CEO</div>
              </div>
              <button className="text-[12px] px-4 py-2 rounded-xl" style={{ border: `1px solid ${P.border}`, color: P.slate }}>Edit Profile</button>
            </div>
             <form onSubmit={handleSave} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
               {[['Full Name', 'name'], ['Role', 'role'], ['Email', 'email'], ['Phone', 'phone'], ['Timezone', 'timezone'], ['Language', 'language']].map(([label, field]) => (
                 <div key={field}>
                   <label className="mb-1 block text-[9.5px] font-bold uppercase tracking-wide" style={{ color: P.slateLight }} htmlFor={`profile-${field}`}>{label}</label>
                   <input id={`profile-${field}`} value={draftProfile[field]} onChange={event => updateProfile(field, event.target.value)} className="w-full rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--zp-teal)]/25" style={{ border: `1px solid ${P.border}`, background: P.surface, color: P.navy }} />
                </div>
              ))}
               <div className="flex items-center gap-3 sm:col-span-2">
                 <button type="submit" className="mt-1 rounded-xl px-5 py-2.5 text-[12.5px] font-semibold text-[var(--zp-on-accent)] transition-all" style={{ background: `linear-gradient(135deg,${P.teal},${P.tealDark})` }}>Save Changes</button>
                 {saved && <span className="text-[12px] font-medium text-emerald-600" role="status">Changes saved</span>}
               </div>
             </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-4">Notifications</h3>
            <div className="space-y-4">
              {[
                { k: "email", l: "Email Notifications", s: "System alerts and weekly reports" },
                { k: "push", l: "Push Notifications", s: "Browser and mobile push alerts" },
                { k: "sms", l: "SMS Alerts", s: "Critical events via SMS" },
                { k: "digest", l: "Weekly Digest", s: "Summary every Monday 9 AM" },
              ].map(n => (
                <div key={n.k} className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--zp-navy)]">{n.l}</div>
                    <div className="text-[11px]" style={{ color: P.slateLight }}>{n.s}</div>
                  </div>
                  <Toggle on={notifs[n.k]} fn={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-4">Security</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[13px] font-semibold text-[var(--zp-navy)]">Two-Factor Authentication</div>
                <div className="text-[11px]" style={{ color: P.slateLight }}>Secured via Google Authenticator</div>
              </div>
              <Toggle on={twofa} fn={() => setTwofa(!twofa)} />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 text-[12px] font-semibold rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}>Change Password</button>
              <button className="flex-1 py-2.5 text-[12px] font-semibold rounded-xl hover:bg-[var(--zp-hover)] transition-all" style={{ border: `1px solid ${P.border}`, color: P.slate }}>Active Sessions</button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-3">Platform Info</h3>
            {[["Version", "v3.14.2"], ["Environment", "Production"], ["Last Deploy", "Jul 15, 2026"], ["Uptime (30d)", "99.97%"], ["Active Servers", "12 instances"], ["DB Region", "ap-south-1"], ["CDN", "Cloudflare"], ["Auth Provider", "Firebase"]].map(([l, v]) => (
              <div key={l} className="flex justify-between items-center py-2.5" style={{ borderBottom: `1px solid ${P.border}` }}>
                <span className="text-[11px]" style={{ color: P.slateLight }}>{l}</span>
                <span className="text-[12px] font-semibold text-[var(--zp-navy)]" style={{ fontFamily: "'IBM Plex Sans',sans-serif" }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-3">Admin Team</h3>
            <div className="space-y-3">
              {adminTeam.map((a, i) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <div className="relative">
                    <InitialsAvatar name={a.name} idx={i} />
                    {a.status === "active" && <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[var(--zp-card)]" style={{ background: P.emerald }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[var(--zp-navy)] truncate">{a.name}</div>
                    <div className="text-[10.5px]" style={{ color: P.slateLight }}>{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[14px] font-bold text-[var(--zp-navy)] mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[[Download, "Export Full Report"], [RefreshCw, "Sync All Data"], [FileText, "View Audit Log"], [Shield, "Manage Permissions"], [GitBranch, "API Integrations"]].map(([Icon, label]) => (
                <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] text-left transition-all hover:bg-[var(--zp-hover)]" style={{ color: P.slate }}>
                  <Icon size={13} style={{ color: P.teal }} />{label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
