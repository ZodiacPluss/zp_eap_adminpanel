import React, { useRef } from "react";
import { Ellipsis, ChevronsUpDown, Building2 } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { useAccents } from "@/app/theme/ThemeProvider";
import { PARTICIPATION_TARGET, WELLBEING_TARGET, WELLBEING_MAX } from "@/app/data/departmentsData";

const avatarIndex = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

/**
 * Sortable headers cycle through their own sorts; the rest are plain labels.
 * Only name has a reverse in the sort list, so the others are single-entry.
 */
const COLS = [
  { key: "name", label: "Department", sorts: ["name-asc", "name-desc"] },
  { key: "employees", label: "Employees", sorts: ["employees-desc"] },
  { key: "participation", label: "EAP Participation", sorts: ["participation-desc"] },
  { key: "wellbeing", label: "Avg. Wellbeing Score", sorts: ["wellbeing-desc"] },
  { key: "manager", label: "Manager" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
];

/** Clicking a header takes its first sort, or steps to the next one if already there. */
const nextSort = (sorts, current) => sorts[(sorts.indexOf(current) + 1) % sorts.length];

const headerCell = "pb-3.5 pr-6 text-left text-[13px] font-medium text-[var(--zp-slate)] last:pr-0";

function Meter({ pct, accent }) {
  return <ProgressBar pct={pct} color={accent} className="h-[9px] w-full min-w-[74px] max-w-[112px] bg-[var(--zp-border-strong)]" />;
}

function DepartmentRow({ department, menuOpen, onOpenMenu }) {
  const A = useAccents();
  const buttonRef = useRef(null);
  const { name, description, employees, participation, wellbeingScore, manager, status, icon: Icon, tone } = department;
  const accent = A[tone] ?? A.brand;
  // Meters read green once the department is at or above target, amber below it.
  const participationAccent = participation >= PARTICIPATION_TARGET ? A.emerald : A.amber;
  const wellbeingAccent = wellbeingScore >= WELLBEING_TARGET ? A.emerald : A.amber;

  return (
    <tr className="border-b border-[var(--zp-border)] transition-colors last:border-b-0 hover:bg-[var(--zp-hover)]">
      <td className="py-[11px] pr-6">
        <div className="flex items-center gap-3.5">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${accent}1f` }}>
            <Icon className="h-[19px] w-[19px]" strokeWidth={1.9} style={{ color: accent }} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold leading-[19px] text-[var(--zp-navy)]">{name}</p>
            <p className="truncate text-[12.5px] leading-[18px] text-[var(--zp-slate)]">{description}</p>
          </div>
        </div>
      </td>
      <td className="pr-6 text-[14px] text-[var(--zp-navy)]">{employees}</td>
      <td className="pr-6">
        <div className="flex items-center gap-3">
          <span className="w-9 shrink-0 text-[14px] text-[var(--zp-navy)]">{participation}%</span>
          <Meter pct={participation} accent={participationAccent} />
        </div>
      </td>
      <td className="pr-6">
        <div className="flex items-center gap-3">
          <span className="w-8 shrink-0 text-[14px] text-[var(--zp-navy)]">{wellbeingScore.toFixed(1)}</span>
          <Meter pct={(wellbeingScore / WELLBEING_MAX) * 100} accent={wellbeingAccent} />
        </div>
      </td>
      <td className="pr-6">
        <div className="flex items-center gap-2.5">
          <InitialsAvatar name={manager} idx={avatarIndex(manager)} size="h-[34px] w-[34px]" soft />
          <span className="truncate text-[14px] text-[var(--zp-navy)]">{manager}</span>
        </div>
      </td>
      <td className="pr-6">
        <StatusBadge s={status.toLowerCase()} tone={status === "Active" ? "emerald" : "rose"}
          className="h-[26px] rounded-md border-0 px-2.5 text-[12.5px] font-medium" />
      </td>
      <td className="text-right">
        <button ref={buttonRef} type="button" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={`Actions for ${name}`}
          onClick={() => onOpenMenu(department, buttonRef)}
          className={`ml-auto flex h-[34px] w-[34px] items-center justify-center rounded-lg border text-[var(--zp-slate)] transition-colors hover:border-[var(--zp-border-strong)] hover:bg-[var(--zp-hover)] hover:text-[var(--zp-navy)] ${menuOpen ? "border-[var(--zp-border-strong)] bg-[var(--zp-hover)]" : "border-transparent"}`}>
          <Ellipsis className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--zp-brand)]/[0.08]">
        <Building2 className="h-6 w-6 text-[var(--zp-brand)]" strokeWidth={1.7} />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold text-[var(--zp-navy)]">No departments match your filters</h3>
      <p className="mt-1.5 max-w-[360px] text-[13px] text-[var(--zp-slate)]">
        Try a different search term, or clear the filters to see the whole directory.
      </p>
      <button type="button" onClick={onClear}
        className="mt-5 h-[40px] rounded-lg bg-[var(--zp-brand)] px-5 text-[13.5px] font-medium text-[var(--zp-on-accent)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
        Clear filters
      </button>
    </div>
  );
}

/** The directory table. Header cells that map to a sort are buttons. */
export function DepartmentTable({ departments, sort, onSortChange, menuFor, onOpenMenu, onClearFilters }) {
  if (departments.length === 0) {
    return <Card><EmptyState onClear={onClearFilters} /></Card>;
  }

  return (
    <Card className="px-4 pb-2 pt-5 sm:px-6">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--zp-border)]">
              {COLS.map((col) => (
                <th key={col.key} scope="col" className={`${headerCell} ${col.align === "right" ? "text-right" : ""}`}>
                  {col.sorts ? (
                    <button type="button" onClick={() => onSortChange(nextSort(col.sorts, sort))}
                      aria-pressed={col.sorts.includes(sort)}
                      className={`inline-flex items-center gap-1.5 transition-colors hover:text-[var(--zp-navy)] focus-visible:outline-none focus-visible:underline ${col.sorts.includes(sort) ? "text-[var(--zp-navy)]" : ""}`}>
                      {col.label}
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <DepartmentRow key={department.id} department={department}
                menuOpen={menuFor === department.id} onOpenMenu={onOpenMenu} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DepartmentTable;
