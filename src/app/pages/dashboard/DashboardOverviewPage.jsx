import React, { useState } from "react";
import { ArrowRight, ArrowUp, CalendarDays, ChevronDown, ChevronRight, CirclePlay, Moon, Sun } from "lucide-react";
import { MILESTONES, PARTNERSHIP_BENEFITS, PROGRAM_HEALTH, UPCOMING_ACTIONS } from "@/app/data/mockData";
import { Card } from "@/app/components/ui/Card";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressRing } from "@/app/components/ui/ProgressRing";

const formatCount = (n) => n.toLocaleString("en-US");

const primaryButton =
  "inline-flex items-center justify-center gap-3 rounded-lg bg-[var(--zp-navy)] font-medium text-[var(--zp-card)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25";

// Static class names per accent so Tailwind can see them.
const TONE_CLASSES = {
  amber: "bg-[var(--zp-amber)]/12 text-[var(--zp-amber)]",
  slate: "bg-[var(--zp-slate)]/10 text-[var(--zp-slate)]",
  emerald: "bg-[var(--zp-emerald)]/12 text-[var(--zp-emerald)]",
};

function greetingFor(date) {
  const hour = date.getHours();
  if (hour < 12) return { text: "Good morning", Icon: Sun };
  if (hour < 17) return { text: "Good afternoon", Icon: Sun };
  return { text: "Good evening", Icon: Moon };
}

function Trend({ value, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-[var(--zp-emerald)] ${className}`}>
      <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
      {value}%
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ firstName, onInvite }) {
  const { text, Icon } = greetingFor(new Date());

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,528fr)_minmax(0,786fr)] xl:gap-0">
      <div className="xl:pl-5 xl:pt-2.5">
        <p className="flex items-center gap-2 text-[15px] font-medium text-[var(--zp-navy)]">
          <Icon className="h-4 w-4 text-[var(--zp-amber)]" strokeWidth={2} aria-hidden="true" />
          {text}, {firstName}
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--zp-navy)] sm:text-[34px]">
          A healthier workplace <br className="hidden sm:block" />
          builds brighter futures.
        </h1>
        <p className="mt-3 text-[15px] leading-[24.5px] text-[var(--zp-slate)] sm:text-[16px]">
          Your EAP program is creating positive change. <br className="hidden sm:block" />
          Here&apos;s what&apos;s happening across your organization.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 sm:gap-5">
          <button type="button" onClick={onInvite} className={`${primaryButton} h-[43px] px-[26px] text-[15px]`}>
            Invite Employees
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          {/* TODO: open the overview video once it is available. */}
          <button type="button"
            className="inline-flex h-[43px] items-center gap-3 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] px-5 text-[15px] font-medium text-[var(--zp-navy)] shadow-[0_1px_2px_var(--zp-shadow)] transition-colors hover:bg-[var(--zp-hover)]">
            <CirclePlay className="h-[22px] w-[22px] text-[var(--zp-navy)]" strokeWidth={1.5} aria-hidden="true" />
            Watch Overview
          </button>
        </div>
      </div>

      {/* Scenery is a CSS stand-in until the photograph is added — see .zp-dash-hero-photo. */}
      <figure className="zp-dash-hero-photo relative aspect-[4/3] overflow-hidden rounded-[14px] sm:aspect-[786/300] xl:aspect-[786/256]">
        <blockquote className="absolute left-[41px] top-[20%] max-w-[60%] pl-[0.45em] -indent-[0.45em] font-['Playfair_Display',serif] text-[18px] leading-[1.26] text-[#3a3f4b] sm:text-[21px]">
          “People do their <br />best work when <br />they feel supported.”
        </blockquote>
        <figcaption className="absolute bottom-[14%] left-[50px] text-[9px] font-semibold uppercase tracking-[0.55em] text-[#555a66]">
          <span aria-hidden="true" className="mb-[22px] block h-px w-[26px] bg-[#8a8f99]" />
          ZodiacPluss
        </figcaption>
        <p className="absolute bottom-[9%] right-10 hidden text-right text-[8px] font-medium uppercase leading-[16px] tracking-[0.5em] text-white/90 sm:block">
          People<br />Wellbeing<br />Progress
          <span aria-hidden="true" className="ml-auto mt-[13px] block h-px w-5 bg-white/70" />
        </p>
      </figure>
    </section>
  );
}

// ─── Program health ───────────────────────────────────────────────────────────
function HealthRing({ score, change }) {
  return (
    <ProgressRing value={score} gradient label={`Program health ${score}%`}>
      <span className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-[var(--zp-navy)]">{score}%</span>
      <span className="mt-3 text-[14px] font-medium text-[var(--zp-navy)]">Program Health</span>
      <Trend value={change} className="mt-2.5 text-[15px]" />
      <span className="mt-1.5 text-[12px] text-[var(--zp-slate-light)]">vs. last month</span>
    </ProgressRing>
  );
}

function RangeSelect({ value, options, onChange }) {
  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">Period</span>
      <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--zp-slate)]" strokeWidth={1.7} aria-hidden="true" />
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-[27px] appearance-none rounded-md bg-[var(--zp-surface)] pl-9 pr-8 text-[12px] font-medium text-[var(--zp-navy)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-[var(--zp-slate)]" aria-hidden="true" />
    </label>
  );
}

function ProgramHealthCard() {
  const { score, change, ranges, metrics } = PROGRAM_HEALTH;
  // Held here so the period can drive the API query once it is connected.
  const [range, setRange] = useState(ranges[0]);

  return (
    <Card className="px-5 pb-[23px] pt-4 sm:pl-[21px] sm:pr-[35px]">
      <SectionHeader large title="Program Health" sub="A real-time view of your organization's EAP journey."
        right={<RangeSelect value={range} options={ranges} onChange={setRange} />} />

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-[64px] sm:pl-3 sm:pt-[3px]">
        <HealthRing score={score} change={change} />

        <ul className="w-full min-w-0 flex-1">
          {metrics.map(({ label, value, change: delta, icon: Icon }) => (
            <li key={label} className="flex items-center gap-[34px]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--zp-brand)]/[0.07] text-[var(--zp-brand-deep)]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3 border-b border-[var(--zp-border)] py-[6px] [li:last-child_&]:border-b-0">
                <div className="min-w-0">
                  <p className="text-[19px] font-semibold leading-[22px] tracking-[-0.01em] text-[var(--zp-navy)]">{formatCount(value)}</p>
                  <p className="truncate text-[13.5px] leading-[20px] text-[var(--zp-slate-light)]">{label}</p>
                </div>
                <Trend value={delta} className="text-[14px]" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ─── Key milestones ───────────────────────────────────────────────────────────
function KeyMilestonesCard() {
  const lastIndex = MILESTONES.length - 1;

  return (
    <Card className="px-5 pb-[9px] pt-4 sm:pr-9">
      <SectionHeader large title="Key Milestones" sub="Track progress across your EAP program." />

      <ol className="-mt-3">
        {MILESTONES.map(({ title, detail, note, status, reached }, index) => (
          <li key={title} className="relative grid grid-cols-[32px_minmax(0,1fr)_auto] gap-x-3 pb-[11px] last:pb-0 sm:grid-cols-[54px_minmax(0,1fr)_auto] sm:gap-x-[25px]">
            {/* Connector to the next marker: solid for the completed stretch. */}
            {index < lastIndex && (
              <span aria-hidden="true"
                className={`absolute left-[15px] top-[10px] h-full w-[2px] sm:left-[26px] ${index === 0 ? "bg-[var(--zp-brand)]/60" : "bg-[var(--zp-brand)]/20"}`} />
            )}
            <span aria-hidden="true" className="relative flex h-[18px] items-center justify-center">
              <span className={reached
                ? "h-[14px] w-[14px] rounded-full bg-[var(--zp-brand)] ring-4 ring-[var(--zp-brand)]/15"
                : "h-[11px] w-[11px] rounded-full bg-[var(--zp-brand)]/35"} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-[18px] text-[var(--zp-navy)]">{title}</p>
              <p className="text-[13px] leading-[18px] text-[var(--zp-slate)]">{detail}</p>
              <p className="text-[12.5px] leading-[18px] text-[var(--zp-slate-light)]">{note}</p>
            </div>
            <StatusBadge s={status} className="mt-[-1px] h-[21px] w-[72px] justify-center self-start rounded-[5px] border-0 px-0 text-[11.5px] font-medium" />
          </li>
        ))}
      </ol>
    </Card>
  );
}

// ─── Partnership ──────────────────────────────────────────────────────────────
function PartnershipCard({ onExplore }) {
  return (
    <Card className="relative overflow-hidden bg-[linear-gradient(105deg,color-mix(in_srgb,var(--zp-brand)_12%,var(--zp-card))_0%,color-mix(in_srgb,var(--zp-brand)_6%,var(--zp-card))_48%,var(--zp-card)_78%)]">
      {/* Wide arc and building: CSS stand-ins until the photograph is added — see .zp-dash-partner-art. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[14%] -top-[70%] hidden aspect-square w-[62%] rounded-full bg-[var(--zp-card)]/55 md:block" />
      <div aria-hidden="true" className="zp-dash-partner-art pointer-events-none absolute bottom-0 left-[38%] hidden h-[64%] w-[30%] md:block" />

      <div className="relative grid grid-cols-1 gap-6 px-[22px] pb-[10px] pt-[18px] md:grid-cols-[minmax(0,1fr)_minmax(0,240px)] md:gap-4 md:pr-[34px]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--zp-slate)]">Our Partnership</p>
          <h2 className="mt-[5px] text-[24px] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--zp-navy)] sm:text-[28px]">
            Stronger people. <br />Brighter workplaces.
          </h2>
          <p className="mt-1.5 max-w-[340px] text-[13px] leading-[19px] text-[var(--zp-slate-light)]">
            Together, we&apos;re building healthier, more resilient teams for a better tomorrow.
          </p>
          <button type="button" onClick={onExplore} className={`${primaryButton} mt-[9px] h-8 px-5 text-[13px]`}>
            Explore Programs
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-col gap-[18px] self-center pb-2.5">
          {PARTNERSHIP_BENEFITS.map(({ title, detail, icon: Icon }) => (
            <li key={title} className="flex items-center gap-[19px]">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--zp-card)] text-[var(--zp-brand)] shadow-[0_2px_8px_var(--zp-shadow)]">
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-[18px] text-[var(--zp-navy)]">{title}</p>
                <p className="text-[11.5px] leading-[18px] text-[var(--zp-slate-light)]">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ─── Upcoming actions ─────────────────────────────────────────────────────────
function UpcomingActionsCard({ onOpen }) {
  return (
    <Card className="px-5 pb-2 pt-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Upcoming Actions</h2>
        {/* TODO: link to the full actions list once that page exists. */}
        <button type="button" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--zp-brand-deep)] hover:underline">
          View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <ul className="mt-1">
        {UPCOMING_ACTIONS.map(({ id, title, detail, icon: Icon, tone, target }) => (
          <li key={id}>
            <button type="button" onClick={() => onOpen(target)}
              className="group flex w-full items-center gap-[25px] rounded-lg text-left">
              <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-3 border-b border-[var(--zp-border)] py-[7px] [li:last-child_&]:border-b-0">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold leading-[17px] text-[var(--zp-navy)] group-hover:text-[var(--zp-brand-deep)]">{title}</span>
                  <span className="block truncate text-[12px] leading-[17px] text-[var(--zp-slate-light)]">{detail}</span>
                </span>
                <ChevronRight className="mr-1.5 h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardOverviewPage({ profile, onNavigate = () => {} }) {
  const firstName = (profile?.name || "there").split(" ")[0];

  return (
    <div className="zp-font flex flex-col gap-[18px]">
      <HeroSection firstName={firstName} onInvite={() => onNavigate("employees")} />

      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,707fr)_minmax(0,583fr)] xl:gap-[22px]">
        <ProgramHealthCard />
        <KeyMilestonesCard />
      </div>

      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,917fr)_minmax(0,374fr)] xl:gap-[21px]">
        <PartnershipCard onExplore={() => onNavigate("programs")} />
        <UpcomingActionsCard onOpen={onNavigate} />
      </div>
    </div>
  );
}
