import React from "react";
import { CalendarDays, Camera, CheckCircle2, Clock3, Edit3, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { toLiteral } from "@/app/theme/palette";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";

function DetailRow({ label, value }) {
  const P = usePalette();
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 last:border-b-0" style={{ borderColor: P.border }}>
      <span className="text-[12px]" style={{ color: P.slateLight }}>{label}</span>
      <span className="text-right text-[12.5px] font-medium text-[var(--zp-navy)]">{value}</span>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, tone }) {
  const P = usePalette();
  const A = useAccents();
  // Tinted with an alpha suffix below, so it has to be a literal hex.
  const accent = toLiteral(tone ?? A.teal, A);
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}12`, color: accent }}>
        <Icon size={17} aria-hidden="true" />
      </div>
      <div>
        <div className="text-[11px]" style={{ color: P.slateLight }}>{label}</div>
        <div className="text-[12px] font-semibold text-[var(--zp-navy)]">{value}</div>
      </div>
    </div>
  );
}

export default function AdminProfilePage({ profile, onEdit }) {
  const P = usePalette();
  const A = useAccents();
  const profileDetails = [
    ["Full Name", profile.name],
    ["Email Address", profile.email],
    ["Phone Number", profile.phone],
    ["Role", profile.role],
    ["Timezone", profile.timezone],
    ["Language", profile.language],
  ];

  return (
    <PageShell title="My Profile" sub="Manage your personal information and account settings">
      <Card className="mb-5 p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-[var(--zp-on-accent)]" style={{ background: `linear-gradient(135deg,${P.teal},${P.tealDark})` }}>
              RG
              <button type="button" aria-label="Change profile photo" className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--zp-card)] bg-[var(--zp-card)] text-[var(--zp-teal-dark)] shadow-sm transition-colors hover:bg-[var(--zp-hover)]">
                <Camera size={14} aria-hidden="true" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--zp-navy)]">{profile.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: P.slateLight }}>
                <Mail size={13} aria-hidden="true" /> {profile.email}
                <span className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ background: `${A.teal}14`, color: P.teal }}>{profile.role}</span>
              </div>
              <p className="mt-2 text-[12px]" style={{ color: P.slate }}>Director &amp; CEO · Full access to all features and settings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" style={{ borderColor: P.border }}>
            <StatItem icon={CalendarDays} label="Member Since" value="12 Jan 2024" />
            <StatItem icon={CheckCircle2} label="Account Status" value="Active" tone={P.emerald} />
            <StatItem icon={Clock3} label="Last Login" value="15 Sep 2025, 10:24 AM" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b pb-4" style={{ borderColor: P.border }}>
            <h3 className="flex items-center gap-2 text-[14px] font-bold text-[var(--zp-navy)]"><UserRound size={17} style={{ color: P.teal }} />Personal Information</h3>
            <button type="button" onClick={onEdit} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-[var(--zp-hover)]" style={{ borderColor: P.border, color: P.slate }}>
              <Edit3 size={13} aria-hidden="true" /> Edit
            </button>
          </div>
          {profileDetails.map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
          <div className="flex items-start justify-between gap-4 border-t pt-3" style={{ borderColor: P.border }}>
            <span className="text-[12px]" style={{ color: P.slateLight }}>About</span>
            <span className="max-w-[260px] text-right text-[12.5px] font-medium text-[var(--zp-navy)]">{profile.about}</span>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 border-b pb-4 text-[14px] font-bold text-[var(--zp-navy)]" style={{ borderColor: P.border }}><ShieldCheck size={17} style={{ color: P.teal }} />Security</h3>
            <DetailRow label="Password" value="••••••••" />
            <div className="flex items-center justify-between gap-4 pt-3">
              <div><div className="text-[12px] text-[var(--zp-navy)]">Two-Factor Authentication</div><div className="text-[11px]" style={{ color: P.slateLight }}>Not enabled</div></div>
              <button type="button" className="rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-[var(--zp-hover)]" style={{ borderColor: P.border, color: P.slate }}>Enable 2FA</button>
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 border-b pb-4 text-[14px] font-bold text-[var(--zp-navy)]" style={{ borderColor: P.border }}><LockKeyhole size={17} style={{ color: P.teal }} />Access</h3>
            <p className="text-[12px] leading-relaxed" style={{ color: P.slate }}>Your account has full administrative access across the ZodiacPluss workspace.</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
