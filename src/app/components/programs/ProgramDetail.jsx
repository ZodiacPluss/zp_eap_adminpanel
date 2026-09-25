import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUp, ChartColumn, ChevronRight, Copy, Ellipsis, Headset, Layers, Lock, PencilLine,
  Power, RotateCcw, Search, UserPlus, Users, X,
} from "lucide-react";
import { PROGRAM_FEATURES } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressRing } from "@/app/components/ui/ProgressRing";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { Pagination } from "@/app/components/ui/Pagination";
import { Switch } from "@/app/components/ui/Switch";
import { primaryButton, secondaryButton } from "@/app/components/ui/dialog";
import { EngagementMeter } from "@/app/components/employees/EngagementMeter";
import { useDismiss } from "@/app/hooks/useDismiss";
import { cn } from "@/app/components/ui/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features & Services" },
  { id: "employees", label: "Assigned Employees" },
  { id: "settings", label: "Settings" },
];

// Static class names per tone so Tailwind can see them.
const TONES = {
  brand: "bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]",
  emerald: "bg-[var(--zp-emerald)]/12 text-[var(--zp-emerald)]",
  violet: "bg-[var(--zp-violet)]/12 text-[var(--zp-violet)]",
  amber: "bg-[var(--zp-amber)]/12 text-[var(--zp-amber)]",
  rose: "bg-[var(--zp-rose)]/10 text-[var(--zp-rose)]",
};

const SETTINGS = [
  { key: "autoRenew", title: "Renew automatically", detail: "Keep the plan running when it reaches its renewal date." },
  { key: "selfEnrollment", title: "Allow self-enrolment", detail: "Employees can join this plan from the ZodiacPluss app without an invitation." },
  { key: "familyAccess", title: "Include family members", detail: "Dependants can use counselling and work-life services." },
  { key: "featureAnnouncements", title: "Announce new services", detail: "Email assigned employees when a service is added to the plan." },
];

export const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const formatCount = (n) => n.toLocaleString("en-US");
const avatarIndex = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

// ─── Header pieces ────────────────────────────────────────────────────────────
function Breadcrumb({ programName, onBack }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-[18px]">
      <ol className="flex items-center gap-3 text-[15px]">
        <li>
          <button type="button" onClick={onBack} className="rounded text-[var(--zp-slate)] transition-colors hover:text-[var(--zp-brand-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
            Programs
          </button>
        </li>
        <li aria-hidden="true"><ChevronRight className="h-4 w-4 text-[var(--zp-slate)]" /></li>
        <li aria-current="page" className="font-medium text-[var(--zp-navy)]">{programName}</li>
      </ol>
    </nav>
  );
}

function PlanActionsMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = React.useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="More plan actions"
        className={cn(secondaryButton, "h-[45px] w-[47px] px-0", open && "bg-[var(--zp-hover)]")}>
        <Ellipsis className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-[210px] rounded-xl border border-[var(--zp-border)] bg-[var(--zp-card)] p-1 shadow-[0_16px_40px_var(--zp-shadow)]">
          {actions.map(({ label, icon: Icon, onClick, danger }) => (
            <button key={label} type="button" role="menuitem" onClick={() => { close(); onClick(); }}
              className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-left text-[14px] font-medium transition-colors ${danger
                ? "text-[var(--zp-rose)] hover:bg-[var(--zp-rose)]/10"
                : "text-[var(--zp-navy)] hover:bg-[var(--zp-hover)]"}`}>
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanTabs({ tab, onChange }) {
  return (
    <Card className="mb-[19px] overflow-x-auto">
      <div role="tablist" aria-label="Plan sections" className="flex">
        {TABS.map(({ id, label }) => {
          const selected = tab === id;
          return (
            <button key={id} type="button" role="tab" id={`plan-tab-${id}`} aria-selected={selected} aria-controls={`plan-panel-${id}`}
              onClick={() => onChange(id)}
              className={`h-[50px] shrink-0 border-b-[3px] px-[27px] text-[15.5px] transition-colors focus-visible:outline-none focus-visible:bg-[var(--zp-hover)] ${selected
                ? "border-[var(--zp-brand)] font-medium text-[var(--zp-brand-deep)]"
                : "border-transparent text-[var(--zp-slate)] hover:text-[var(--zp-navy)]"}`}>
              {label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function IntroCard({ onDismiss }) {
  return (
    <Card className="relative flex items-center gap-5 overflow-hidden px-[22px] py-6">
      <span className="flex h-[71px] w-[71px] shrink-0 items-center justify-center rounded-full bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]">
        <Layers className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Support for every step of the journey</h2>
        <p className="mt-1 text-[15px] leading-[22px] text-[var(--zp-slate)]">Help your people manage challenges, build resilience and live healthier, happier lives.</p>
      </div>
      {/* Soft ribbon between the message and the quote, as in the design; purely decorative. */}
      <span aria-hidden="true"
        className="pointer-events-none -my-6 hidden w-[86px] shrink-0 self-stretch bg-[var(--zp-brand)]/[0.06] [clip-path:polygon(12%_0,88%_0,62%_50%,90%_100%,10%_100%,38%_50%)] lg:block" />
      <figure className="relative hidden w-[190px] shrink-0 pr-4 lg:block">
        <blockquote className="text-[15.5px] leading-[22px] text-[var(--zp-slate)]">“A healthier tomorrow, together.”</blockquote>
        <span aria-hidden="true" className="mt-3 block h-px w-[26px] bg-[var(--zp-slate-light)]" />
      </figure>
      <button type="button" onClick={onDismiss} aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-md p-1 text-[var(--zp-slate-light)] transition-colors hover:bg-[var(--zp-hover)] hover:text-[var(--zp-navy)]">
        <X className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    </Card>
  );
}

function DetailItem({ label, children, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-[14px] text-[var(--zp-slate)]">{label}</dt>
      <dd className="mt-1 text-[15.5px] text-[var(--zp-navy)]">{children}</dd>
    </div>
  );
}

// Column rules only where the items sit side by side.
const splitCol = "md:border-l md:border-[var(--zp-border)] md:pl-[22px]";

function PlanDetailsCard({ program, assignedCount, totalEmployees }) {
  return (
    <Card className="px-[26px] pb-4 pt-4">
      <h2 className="border-b border-[var(--zp-border)] pb-2.5 text-[20px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Plan Details</h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-[var(--zp-border)] py-3.5 md:grid-cols-[26fr_24fr_27fr_23fr] md:gap-x-0">
        <DetailItem label="Plan Name">{program.name}</DetailItem>
        <DetailItem label="Status" className={splitCol}>
          <StatusBadge s={program.status} dot className="h-[26px] rounded-md border-0 px-2.5 text-[14px] font-medium" />
        </DetailItem>
        <DetailItem label="Start Date" className={splitCol}>{formatDate(program.startDate)}</DetailItem>
        <DetailItem label="Renewal Date" className={splitCol}>{formatDate(program.renewalDate)}</DetailItem>
      </dl>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pt-3.5 md:grid-cols-[62fr_18.5fr_19.5fr] md:gap-x-0">
        <div className="col-span-2 md:col-span-1 md:pr-6">
          <dt className="text-[14px] text-[var(--zp-slate)]">Description</dt>
          <dd className="mt-1 text-[14px] leading-[21px] text-[var(--zp-slate)]">{program.description || "No description yet."}</dd>
        </div>
        <DetailItem label="Plan Type" className={splitCol}>{program.planType}</DetailItem>
        <DetailItem label="Assigned Employees" className={splitCol}>{formatCount(assignedCount)} of {formatCount(totalEmployees)}</DetailItem>
      </dl>
    </Card>
  );
}

function FeatureItem({ feature }) {
  const { icon: Icon, title, description, tone } = feature;
  return (
    <li className="flex items-center gap-4">
      <span className={`flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full ${TONES[tone]}`}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[16px] font-medium leading-[22px] text-[var(--zp-navy)]">{title}</p>
        <p className="text-[14.5px] leading-[22px] text-[var(--zp-slate)]">{description}</p>
      </div>
    </li>
  );
}

function PrivacyBanner() {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-[var(--zp-brand)]/[0.06] px-5 py-3.5">
      <Lock className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[var(--zp-brand-deep)]" strokeWidth={1.7} aria-hidden="true" />
      <div>
        <p className="text-[16px] font-medium text-[var(--zp-navy)]">Confidential &amp; Private</p>
        <p className="mt-0.5 text-[14px] leading-[21px] text-[var(--zp-slate)]">
          Employee access and usage are confidential. You can view only aggregated engagement statistics, not individual session details.
        </p>
      </div>
    </div>
  );
}

function KeyFeaturesCard({ features }) {
  return (
    <Card className="px-[26px] pb-4 pt-4">
      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Key Features</h2>
      {features.length ? (
        <ul className="mt-[14px] grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {features.map((feature) => <FeatureItem key={feature.id} feature={feature} />)}
        </ul>
      ) : (
        <p className="mt-4 text-[14.5px] text-[var(--zp-slate)]">No services are included yet. Add them from Features &amp; Services.</p>
      )}
      <div className="mt-6"><PrivacyBanner /></div>
    </Card>
  );
}

// ─── Other tabs ───────────────────────────────────────────────────────────────
function FeaturesTab({ program, onToggleFeature }) {
  const included = new Set(program.features);
  return (
    <Card className="px-[26px] py-5">
      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Features &amp; Services</h2>
      <p className="mt-1 text-[14.5px] text-[var(--zp-slate)]">
        {included.size} of {PROGRAM_FEATURES.length} services are included in this plan.
      </p>
      <ul className="mt-4 divide-y divide-[var(--zp-border)]">
        {PROGRAM_FEATURES.map((feature) => (
          <li key={feature.id}>
            <label className="flex cursor-pointer items-center justify-between gap-6 py-4">
              <FeatureItemInline feature={feature} />
              <span className="flex items-center gap-3 text-[13.5px] text-[var(--zp-slate)]">
                <span className="hidden sm:inline">{included.has(feature.id) ? "Included" : "Not included"}</span>
                <Switch checked={included.has(feature.id)} onCheckedChange={(on) => onToggleFeature(feature, on)} aria-label={`Include ${feature.title}`} />
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FeatureItemInline({ feature }) {
  const { icon: Icon, title, description, tone } = feature;
  return (
    <span className="flex min-w-0 items-center gap-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${TONES[tone]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15.5px] font-medium text-[var(--zp-navy)]">{title}</span>
        <span className="block text-[14px] text-[var(--zp-slate)]">{description}</span>
      </span>
    </span>
  );
}

const PAGE_SIZE = 8;

function AssignedEmployeesTab({ assignedEmployees, onAssign }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? assignedEmployees.filter((e) => e.name.toLowerCase().includes(needle) || e.email.includes(needle) || e.department.toLowerCase().includes(needle))
      : assignedEmployees;
  }, [assignedEmployees, query]);
  useEffect(() => { setPage(1); }, [query]);

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-[var(--zp-border)] px-[26px] py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Assigned Employees</h2>
          <p className="text-[14px] text-[var(--zp-slate)]">{formatCount(assignedEmployees.length)} employees can use this plan.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-0 flex-1 sm:w-[220px] sm:flex-none">
            <span className="sr-only">Search assigned employees</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees..."
              className="h-10 w-full rounded-lg border border-[var(--zp-border-strong)] bg-[var(--zp-card)] pl-9 pr-3 text-[13.5px] text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate)] focus:border-[var(--zp-brand)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/15" />
          </label>
          <button type="button" onClick={onAssign} className={primaryButton}>
            <UserPlus className="h-4 w-4" aria-hidden="true" /> Assign Employees
          </button>
        </div>
      </div>
      <div className="overflow-x-auto px-[26px]">
        <table className="w-full min-w-[640px] table-fixed">
          <colgroup><col style={{ width: "40%" }} /><col style={{ width: "22%" }} /><col style={{ width: "16%" }} /><col style={{ width: "22%" }} /></colgroup>
          <TableHeader cols={["Employee", "Department", "EAP Access", "Engagement"]} className="h-[46px] pb-0 align-middle text-[13px] font-normal normal-case tracking-normal" />
          <tbody>
            {rows.map((employee) => (
              <tr key={employee.id} className="border-b border-[var(--zp-border)] last:border-b-0">
                <td className="py-[6px] pr-4">
                  <div className="flex items-center gap-4">
                    <InitialsAvatar name={employee.name} idx={avatarIndex(employee.name)} size="h-[38px] w-[38px]" soft />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium leading-[18px] text-[var(--zp-navy)]">{employee.name}</p>
                      <p className="truncate text-[13px] leading-[18px] text-[var(--zp-slate)]">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="pr-4 text-[14px] text-[var(--zp-navy)]">{employee.department}</td>
                <td className="pr-4"><StatusBadge s={employee.status} dot className="h-6 rounded-[5px] border-0 px-2.5 text-[13px] font-medium" /></td>
                <td><EngagementMeter level={employee.engagement} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="py-12 text-center text-[14px] text-[var(--zp-slate)]">
            {assignedEmployees.length ? "No assigned employees match your search." : "No one is assigned to this plan yet."}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3 border-t border-[var(--zp-border)] px-[26px] py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[var(--zp-slate)]">
          Showing {matches.length ? formatCount((current - 1) * PAGE_SIZE + 1) : 0}–{formatCount((current - 1) * PAGE_SIZE + rows.length)} of {formatCount(matches.length)}
        </p>
        <Pagination page={current} pageCount={pageCount} onPageChange={setPage} label="Assigned employee pages" />
      </div>
    </Card>
  );
}

function SettingsTab({ program, onSave }) {
  const [draft, setDraft] = useState(program.settings);
  useEffect(() => { setDraft(program.settings); }, [program.settings]);
  const dirty = SETTINGS.some(({ key }) => draft[key] !== program.settings[key]);

  return (
    <Card className="px-[26px] py-5">
      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Settings</h2>
      <p className="mt-1 text-[14.5px] text-[var(--zp-slate)]">Control how this plan renews and who can use it.</p>
      <ul className="mt-3 divide-y divide-[var(--zp-border)]">
        {SETTINGS.map(({ key, title, detail }) => (
          <li key={key}>
            <label className="flex cursor-pointer items-center justify-between gap-6 py-4">
              <span>
                <span className="block text-[15.5px] font-medium text-[var(--zp-navy)]">{title}</span>
                <span className="block text-[14px] text-[var(--zp-slate)]">{detail}</span>
              </span>
              <Switch checked={draft[key]} onCheckedChange={(on) => setDraft((d) => ({ ...d, [key]: on }))} />
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end gap-3">
        <button type="button" disabled={!dirty} onClick={() => setDraft(program.settings)} className={cn(secondaryButton, "disabled:cursor-not-allowed disabled:opacity-50")}>
          Discard
        </button>
        <button type="button" disabled={!dirty} onClick={() => onSave(draft)} className={primaryButton}>Save Settings</button>
      </div>
    </Card>
  );
}

// ─── Right column ─────────────────────────────────────────────────────────────
function PlanOverviewCard({ assignedCount, totalEmployees, trend }) {
  const pct = totalEmployees ? Math.round((assignedCount / totalEmployees) * 100) : 0;
  return (
    <Card className="px-[19px] pb-[25px] pt-[15px]">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Plan Overview</h2>
      <div className="mt-[17px] flex items-center gap-6 pl-1.5">
        <ProgressRing value={pct} size={117} stroke={8} label={`${pct}% of employees enrolled`}>
          <span className="text-[30px] font-semibold tracking-[-0.02em] text-[var(--zp-navy)]">{pct}%</span>
        </ProgressRing>
        <div>
          <p className="text-[17px] font-semibold text-[var(--zp-navy)]">{formatCount(assignedCount)} of {formatCount(totalEmployees)}</p>
          <p className="text-[15px] text-[var(--zp-slate)]">employees enrolled</p>
          {trend ? (
            <>
              <p className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-[var(--zp-emerald)]">
                <ArrowUp className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />{trend}%
              </p>
              <p className="text-[14.5px] text-[var(--zp-slate)]">vs. last quarter</p>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function QuickActionsCard({ actions }) {
  return (
    <Card className="px-[19px] pb-[19px] pt-[15px]">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Quick Actions</h2>
      <ul className="mt-[14px] flex flex-col gap-[7px]">
        {actions.map(({ label, icon: Icon, onClick, danger }) => (
          <li key={label}>
            <button type="button" onClick={onClick}
              className={`flex h-[47px] w-full items-center gap-[22px] rounded-lg border px-[17px] text-left text-[15px] font-medium transition-colors active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] ${danger
                ? "border-[var(--zp-rose)]/40 bg-[var(--zp-rose)]/[0.07] text-[var(--zp-rose)] hover:bg-[var(--zp-rose)]/[0.12] focus-visible:ring-[var(--zp-rose)]/20"
                : "border-[var(--zp-border)] text-[var(--zp-navy)] hover:border-[var(--zp-border-strong)] hover:bg-[var(--zp-hover)] focus-visible:ring-[var(--zp-brand)]/20"}`}>
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function NeedHelpCard({ onContactSupport }) {
  return (
    <Card className="px-[19px] pb-[19px] pt-[18px]">
      <div className="flex gap-4">
        <Headset className="mt-0.5 h-7 w-7 shrink-0 text-[var(--zp-brand)]" strokeWidth={1.6} aria-hidden="true" />
        <div>
          <h2 className="text-[16.5px] font-semibold text-[var(--zp-navy)]">Need Help?</h2>
          <p className="mt-1 text-[14.5px] leading-[20px] text-[var(--zp-slate)]">Our team can help you customize this plan for your organization.</p>
        </div>
      </div>
      <button type="button" onClick={onContactSupport}
        className={cn(secondaryButton, "mt-[18px] h-11 w-full text-[15px] text-[var(--zp-brand-deep)] shadow-[0_1px_2px_var(--zp-shadow)]")}>
        Contact Support <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </Card>
  );
}

// ─── Detail view ──────────────────────────────────────────────────────────────
/**
 * One plan, as in the Programs design. All mutations go through callbacks so the
 * parent owns the plan data (and later, the API calls).
 */
export default function ProgramDetail({
  program, employees, totalEmployees, onBack, onEdit, onAssign, onDuplicate, onUsageReport, onToggleActive,
  onToggleFeature, onSaveSettings, onContactSupport,
}) {
  const [tab, setTab] = useState("overview");
  const [introVisible, setIntroVisible] = useState(true);

  const assignedEmployees = useMemo(() => {
    const ids = new Set(program.assignedEmployeeIds);
    return employees.filter((e) => ids.has(e.id));
  }, [employees, program.assignedEmployeeIds]);
  const features = PROGRAM_FEATURES.filter((f) => program.features.includes(f.id));
  const active = program.status === "active";

  const statusAction = active
    ? { label: "Deactivate Plan", icon: Power, onClick: onToggleActive, danger: true }
    : { label: "Reactivate Plan", icon: RotateCcw, onClick: onToggleActive };
  const quickActions = [
    { label: "Assign to Employees", icon: Users, onClick: onAssign },
    { label: "Edit Plan", icon: PencilLine, onClick: onEdit },
    { label: "Duplicate Plan", icon: Copy, onClick: onDuplicate },
    { label: "View Usage Report", icon: ChartColumn, onClick: onUsageReport },
    statusAction,
  ];

  return (
    <PageShell large
      eyebrow={<Breadcrumb programName={program.name} onBack={onBack} />}
      title={program.name}
      titleAddon={<StatusBadge s={program.status} className="h-[30px] rounded-lg border-0 px-3.5 text-[15px] font-medium" />}
      sub={program.summary}
      action={
        <div className="flex gap-[18px]">
          <button type="button" onClick={onEdit} className={cn(secondaryButton, "h-[45px] px-[22px] text-[15.5px] shadow-[0_1px_2px_var(--zp-shadow)]")}>
            <PencilLine className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" /> Edit Plan
          </button>
          <PlanActionsMenu actions={[
            { label: "Duplicate Plan", icon: Copy, onClick: onDuplicate },
            { label: "View Usage Report", icon: ChartColumn, onClick: onUsageReport },
            statusAction,
          ]} />
        </div>
      }>
      <PlanTabs tab={tab} onChange={setTab} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_337px]">
        <div id={`plan-panel-${tab}`} role="tabpanel" aria-labelledby={`plan-tab-${tab}`} className="flex min-w-0 flex-col gap-5">
          {tab === "overview" && (
            <>
              {introVisible && <IntroCard onDismiss={() => setIntroVisible(false)} />}
              <PlanDetailsCard program={program} assignedCount={assignedEmployees.length} totalEmployees={totalEmployees} />
              <KeyFeaturesCard features={features} />
            </>
          )}
          {tab === "features" && <FeaturesTab program={program} onToggleFeature={onToggleFeature} />}
          {tab === "employees" && <AssignedEmployeesTab assignedEmployees={assignedEmployees} onAssign={onAssign} />}
          {tab === "settings" && <SettingsTab program={program} onSave={onSaveSettings} />}

          <div>
            <button type="button" onClick={onBack} className={cn(secondaryButton, "h-[43px] text-[15.5px] shadow-[0_1px_2px_var(--zp-shadow)]")}>
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" /> Back to Programs
            </button>
          </div>
        </div>

        <aside className="grid grid-cols-1 content-start gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Plan summary">
          <PlanOverviewCard assignedCount={assignedEmployees.length} totalEmployees={totalEmployees} trend={program.enrollmentTrend} />
          <QuickActionsCard actions={quickActions} />
          <NeedHelpCard onContactSupport={onContactSupport} />
        </aside>
      </div>
    </PageShell>
  );
}
