import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Check, ChevronDown, ChevronRight, Clock, Ellipsis, FileText,
  Filter, Info, Plus, Search, Send, Trash2, Upload, UserCheck, UserX, Users,
} from "lucide-react";
import { DEPARTMENTS, EMPLOYEES, EMPLOYEE_STATS } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { TableHeader } from "@/app/components/ui/TableHeader";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressRing } from "@/app/components/ui/ProgressRing";
import { Pagination } from "@/app/components/ui/Pagination";
import { useDismiss } from "@/app/hooks/useDismiss";
import { Toast } from "@/app/components/ui/Toast";
import InviteEmployeeDrawer from "@/app/components/employees/InviteEmployeeDrawer";
import { ENGAGEMENT, EngagementMeter } from "@/app/components/employees/EngagementMeter";

// ─── Presentation helpers ─────────────────────────────────────────────────────
const TABS = [
  { id: "all", label: "All Employees" },
  { id: "active", label: "Active" },
  { id: "invited", label: "Invited" },
  { id: "deactivated", label: "Deactivated" },
];

const SORTS = [
  { id: "default", label: "Default order" },
  { id: "name-asc", label: "Employee name (A–Z)" },
  { id: "name-desc", label: "Employee name (Z–A)" },
  { id: "department", label: "Department" },
  { id: "recent", label: "Last activity" },
];

const PAGE_SIZES = [8, 10, 25, 50];
const NO_FILTERS = { department: "all", engagement: "all" };
const COLUMNS = ["Employee", "Department", "Role", "EAP Access", "Engagement", "Last Activity", "Actions"];
const COLUMN_WIDTHS = ["23%", "14%", "16.3%", "12.5%", "15.4%", "13.7%", "5.1%"];

const formatCount = (n) => n.toLocaleString("en-US");

function formatLastActivity({ status, lastActiveDays: days }) {
  if (status === "invited") return "Not yet";
  if (days == null) return "—";
  if (days === 0) return "Today";
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (days < 30) return Math.floor(days / 7) === 1 ? "1 week ago" : `${Math.floor(days / 7)} weeks ago`;
  return Math.floor(days / 30) === 1 ? "1 month ago" : `${Math.floor(days / 30)} months ago`;
}

const avatarIndex = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

function sortEmployees(list, sort) {
  const byName = (a, b) => a.name.localeCompare(b.name);
  switch (sort) {
    case "name-asc": return [...list].sort(byName);
    case "name-desc": return [...list].sort((a, b) => byName(b, a));
    case "department": return [...list].sort((a, b) => a.department.localeCompare(b.department) || byName(a, b));
    // Most recent first; employees with no activity go last.
    case "recent": return [...list].sort((a, b) => (a.lastActiveDays ?? Infinity) - (b.lastActiveDays ?? Infinity));
    default: return list;
  }
}

function downloadCsv(rows) {
  const header = ["Employee ID", "Name", "Email", "Department", "Role", "EAP Access", "Engagement", "Last Activity"];
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((e) => [e.employeeId, e.name, e.email, e.department, e.role, e.status,
    e.engagement ? ENGAGEMENT[e.engagement].label : "", formatLastActivity(e)].map(escape).join(","));
  const blob = new Blob([[header.map(escape).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--zp-border-strong)] bg-[var(--zp-card)] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)]";
const popoverPanel =
  "absolute right-0 top-full z-30 mt-2 rounded-xl border border-[var(--zp-border)] bg-[var(--zp-card)] shadow-[0_16px_40px_var(--zp-shadow)]";

// ─── Statistics ───────────────────────────────────────────────────────────────
const STAT_TONES = {
  brand: "bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]",
  emerald: "bg-[var(--zp-emerald)]/12 text-[var(--zp-emerald)]",
  teal: "bg-[var(--zp-teal)]/10 text-[var(--zp-teal)]",
  rose: "bg-[var(--zp-rose)]/10 text-[var(--zp-rose)]",
};

function Stat({ icon: Icon, tone, value, label, trend }) {
  const up = trend >= 0;
  return (
    <div className="flex items-start gap-[18px] px-6 pb-[19px] pt-[22px] xl:[&:not(:first-child)]:before:absolute xl:[&:not(:first-child)]:before:inset-y-[22px] xl:[&:not(:first-child)]:before:left-0 xl:[&:not(:first-child)]:before:w-px xl:[&:not(:first-child)]:before:bg-[var(--zp-border)] relative">
      <span className={`flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full ${STAT_TONES[tone]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[21px] font-semibold leading-[26px] tracking-[-0.01em] text-[var(--zp-navy)]">{formatCount(value)}</p>
        <p className="text-[14px] leading-5 text-[var(--zp-slate)]">{label}</p>
        <p className={`mt-[13px] inline-flex items-center gap-1 text-[14px] font-semibold ${up ? "text-[var(--zp-emerald)]" : "text-[var(--zp-rose)]"}`}>
          {up ? <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />}
          {Math.abs(trend)}%
        </p>
        <p className="text-[13px] leading-5 text-[var(--zp-slate)]">vs. last month</p>
      </div>
    </div>
  );
}

function EmployeeStats({ counts, onViewDetails }) {
  const { trends, adoption } = EMPLOYEE_STATS;
  const adoptionPct = counts.all ? Math.round((adoption.engaged / counts.all) * 100) : 0;

  return (
    <Card className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.8fr)]">
      <Stat icon={Users} tone="brand" value={counts.all} label="Total Employees" trend={trends.total} />
      <Stat icon={UserCheck} tone="emerald" value={counts.active} label="Active" trend={trends.active} />
      <Stat icon={Clock} tone="teal" value={counts.invited} label="Invited" trend={trends.invited} />
      <Stat icon={UserX} tone="rose" value={counts.deactivated} label="Deactivated" trend={trends.deactivated} />

      <div className="relative border-t border-[var(--zp-border)] px-6 pb-[13px] pt-[14px] sm:col-span-2 xl:col-span-1 xl:border-t-0 xl:pl-[30px] xl:before:absolute xl:before:inset-y-[22px] xl:before:left-0 xl:before:w-px xl:before:bg-[var(--zp-border)]">
        <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[var(--zp-navy)]">
          EAP Adoption
          <Info className="h-4 w-4 text-[var(--zp-slate)]" strokeWidth={1.8} aria-label="Share of employees who have used at least one EAP service" />
        </h2>
        <div className="mt-[7px] flex items-start gap-7 xl:pl-[31px]">
          <ProgressRing value={adoptionPct} size={86} stroke={7} label={`EAP adoption ${adoptionPct}%`}>
            <span className="text-[20px] font-semibold text-[var(--zp-navy)]">{adoptionPct}%</span>
          </ProgressRing>
          <div className="pt-[3px]">
            <p className="text-[16px] font-semibold leading-5 text-[var(--zp-navy)]">{formatCount(adoption.engaged)} of {formatCount(counts.all)}</p>
            <p className="mt-0.5 text-[15px] text-[var(--zp-slate)]">employees have engaged</p>
            <button type="button" onClick={onViewDetails}
              className="mt-3.5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--zp-brand-deep)] hover:underline">
              View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Toolbar popovers ─────────────────────────────────────────────────────────
function Popover({ label, icon: Icon, badge, open, onToggle, onClose, children }) {
  const ref = useRef(null);
  useDismiss(ref, open, onClose);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={onToggle} aria-expanded={open} aria-haspopup="dialog"
        className={`${outlineButton} h-[35px] px-3.5 text-[13.5px] ${open ? "ring-[3px] ring-[var(--zp-brand)]/15" : ""}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        {label}
        {badge ? <span className="rounded-full bg-[var(--zp-brand)] px-1.5 text-[11px] font-semibold leading-[18px] text-[var(--zp-on-accent)]">{badge}</span> : null}
      </button>
      {open && children}
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[12px] font-medium text-[var(--zp-slate)]">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-[var(--zp-border-strong)] bg-[var(--zp-card)] pl-3 pr-8 text-[13px] text-[var(--zp-navy)] outline-none focus:border-[var(--zp-brand)]">
          {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── Row action menu ──────────────────────────────────────────────────────────
function RowActionMenu({ menu, onRemove, onClose }) {
  const ref = useRef(null);
  useDismiss([ref, menu.anchorRef], true, onClose);

  // The menu is fixed to the viewport, so it closes rather than drifting on scroll.
  useEffect(() => {
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  // Portalled: the page's enter animation leaves a transform on an ancestor,
  // which would otherwise make `fixed` relative to it instead of the viewport.
  return createPortal(
    <div ref={ref} role="menu" aria-label={`Actions for ${menu.employee.name}`}
      className="zp-font fixed z-40 w-[184px] rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] p-1 shadow-[0_12px_32px_var(--zp-shadow)]"
      style={{ top: menu.top, left: menu.left }}>
      <button type="button" role="menuitem" autoFocus onClick={() => onRemove(menu.employee)}
        className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-left text-[14px] font-medium text-[var(--zp-rose)] transition-colors hover:bg-[var(--zp-rose)]/10 focus-visible:bg-[var(--zp-rose)]/10 focus-visible:outline-none">
        <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        Remove Employee
      </button>
    </div>,
    document.body,
  );
}

// ─── Employee table ───────────────────────────────────────────────────────────
function EmployeeRow({ employee, menuOpen, onOpenMenu }) {
  const buttonRef = useRef(null);

  return (
    <tr className="border-b border-[var(--zp-border)] last:border-b-0">
      <td className="py-[6px] pr-4">
        <div className="flex items-center gap-[18px]">
          <InitialsAvatar name={employee.name} idx={avatarIndex(employee.name)} size="h-[38px] w-[38px]" soft />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium leading-[18px] text-[var(--zp-navy)]">{employee.name}</p>
            <p className="truncate text-[13px] leading-[18px] text-[var(--zp-slate)]">{employee.email}</p>
          </div>
        </div>
      </td>
      <td className="pr-4 text-[14px] text-[var(--zp-navy)]">{employee.department}</td>
      <td className="pr-4 text-[14px] text-[var(--zp-navy)]">{employee.role}</td>
      <td className="pr-4">
        <StatusBadge s={employee.status} dot className="h-6 rounded-[5px] border-0 px-2.5 text-[13px] font-medium" />
      </td>
      <td className="pr-4">
        <EngagementMeter level={employee.engagement} />
      </td>
      <td className="pr-4 text-[13.5px] text-[var(--zp-slate)]">{formatLastActivity(employee)}</td>
      <td>
        <button ref={buttonRef} type="button" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={`Actions for ${employee.name}`}
          onClick={() => onOpenMenu(employee, buttonRef)}
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg border text-[var(--zp-navy)] transition-colors hover:border-[var(--zp-border-strong)] hover:bg-[var(--zp-hover)] ${menuOpen ? "border-[var(--zp-border-strong)] bg-[var(--zp-hover)]" : "border-transparent"}`}>
          <Ellipsis className="h-5 w-5" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

// ─── Side cards ───────────────────────────────────────────────────────────────
function QuickActionsCard({ onInvite, onUpload, onDepartments, onExport }) {
  const actions = [
    { label: "Invite Employees", icon: Send, onClick: onInvite },
    { label: "Bulk Upload (CSV)", icon: Upload, onClick: onUpload },
    { label: "Manage Departments", icon: Users, onClick: onDepartments },
    { label: "Export Employee List", icon: FileText, onClick: onExport },
  ];
  return (
    <Card className="px-[18px] pb-[21px] pt-4">
      <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">Quick Actions</h2>
      <ul className="mt-[15px] flex flex-col gap-[7px]">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <li key={label}>
            <button type="button" onClick={onClick}
              className="flex h-11 w-full items-center gap-3.5 rounded-lg border border-[var(--zp-border)] px-3.5 text-left text-[13px] font-medium text-[var(--zp-navy)] transition-colors hover:border-[var(--zp-border-strong)] hover:bg-[var(--zp-hover)]">
              <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--zp-navy)]" strokeWidth={1.7} aria-hidden="true" />
              <span className="flex-1 truncate">{label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--zp-navy)]" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PrivacyCard() {
  return (
    <Card className="flex gap-3.5 px-[21px] py-5">
      <Info className="mt-px h-5 w-5 shrink-0 text-[var(--zp-slate)]" strokeWidth={1.7} aria-hidden="true" />
      <div>
        <h2 className="text-[14.5px] font-semibold text-[var(--zp-navy)]">Employee privacy</h2>
        <p className="mt-1.5 text-[13px] leading-[17px] text-[var(--zp-slate)]">
          Employees can access EAP services confidentially. You can only view engagement statistics, not session details.
        </p>
        {/* TODO: link to the privacy policy once it is published. */}
        <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--zp-brand-deep)] hover:underline">
          Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeesManagementPage({ onNavigate = () => {}, searchRequest }) {
  // Mock data for now; replace with the employees API response when it lands.
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState(searchRequest?.query ?? "");
  // A search submitted from the header while this page is already open.
  useEffect(() => {
    if (searchRequest) {
      setQuery(searchRequest.query);
      setTab("all");
    }
  }, [searchRequest]);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [openPopover, setOpenPopover] = useState(null); // "filter" | "sort" | null
  const [menu, setMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const closePopover = useCallback(() => setOpenPopover(null), []);
  const closeMenu = useCallback(() => setMenu(null), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const counts = useMemo(() => {
    const result = { all: employees.length, active: 0, invited: 0, deactivated: 0 };
    employees.forEach((e) => { result[e.status] += 1; });
    return result;
  }, [employees]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = employees.filter((e) =>
      (tab === "all" || e.status === tab)
      && (filters.department === "all" || e.department === filters.department)
      && (filters.engagement === "all" || (filters.engagement === "none" ? !e.engagement : e.engagement === filters.engagement))
      && (!needle || e.name.toLowerCase().includes(needle) || e.email.includes(needle) || e.employeeId.toLowerCase().includes(needle)));
    return sortEmployees(matches, sort);
  }, [employees, tab, query, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstShown = visible.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastShown = (currentPage - 1) * pageSize + pageRows.length;

  // Any change to what is listed starts again from the first page.
  useEffect(() => { setPage(1); }, [tab, query, filters, sort, pageSize]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "all").length;
  const existingEmails = useMemo(() => new Set(employees.map((e) => e.email)), [employees]);

  const openRowMenu = (employee, anchorRef) => {
    if (menu?.employee.id === employee.id) return closeMenu();
    const rect = anchorRef.current.getBoundingClientRect();
    const width = 184;
    setMenu({
      employee,
      anchorRef,
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.left - 32, window.innerWidth - width - 8)),
    });
  };

  const removeEmployee = (employee) => {
    const index = employees.findIndex((e) => e.id === employee.id);
    setEmployees((current) => current.filter((e) => e.id !== employee.id));
    closeMenu();
    setToast({
      message: `${employee.name} was removed.`,
      action: {
        label: "Undo",
        onClick: () => setEmployees((current) => [...current.slice(0, index), employee, ...current.slice(index)]),
      },
    });
  };

  const addEmployee = (form) => {
    const nextNumber = Math.max(...employees.map((e) => Number(e.employeeId.replace(/\D/g, "")) || 0)) + 1;
    const employee = {
      id: `emp-new-${Date.now()}`,
      employeeId: form.employeeId || `EMP-${nextNumber}`,
      name: form.fullName,
      email: form.email,
      department: form.department,
      role: form.role,
      status: form.eapAccess ? "invited" : "deactivated",
      engagement: null,
      lastActiveDays: null,
    };
    setEmployees((current) => [employee, ...current]);
    setDrawerOpen(false);
    setTab("all");
    setToast({
      message: form.eapAccess
        ? `Invitation ready for ${form.email}. It will be sent once the email service is connected.`
        : `${form.fullName} was added without EAP access.`,
    });
  };

  const handleFileChosen = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) setToast({ message: `“${file.name}” received. Importing will be available once the employee API is connected.` });
  };

  const handleExport = () => {
    downloadCsv(visible);
    setToast({ message: `Exported ${formatCount(visible.length)} employees to CSV.` });
  };

  const openUpload = () => fileInputRef.current?.click();

  return (
    <div className="zp-font">
      <PageShell large title="Employees" sub="Manage your team's access to EAP and track their overall engagement."
        action={
          <div className="flex gap-3.5">
            <button type="button" onClick={openUpload} className={`${outlineButton} h-10 px-4 text-[14.5px]`}>
              <Upload className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              Import
            </button>
            <button type="button" onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--zp-brand)] px-[18px] text-[14.5px] font-medium text-[var(--zp-on-accent)] transition-colors hover:bg-[var(--zp-brand-deep)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
              <Plus className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              Add Employee
            </button>
          </div>
        }>
        <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChosen} />

        <EmployeeStats counts={counts} onViewDetails={() => onNavigate("reports")} />

        <div className="mt-[19px] grid grid-cols-1 gap-[19px] xl:grid-cols-[minmax(0,1fr)_262px]">
          <Card className="min-w-0">
            {/* Tabs + search / filter / sort */}
            <div className="flex flex-col gap-3 border-b border-[var(--zp-border)] px-5 pt-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:pl-[25px] lg:pr-[19px] lg:pt-0">
              <div role="tablist" aria-label="Employee status" className="-mb-px flex gap-6 overflow-x-auto lg:gap-[26px]">
                {TABS.map(({ id, label }) => {
                  const selected = tab === id;
                  return (
                    <button key={id} type="button" role="tab" aria-selected={selected} onClick={() => setTab(id)}
                      className={`flex h-[54px] shrink-0 items-center gap-2 border-b-[3px] text-[15px] transition-colors ${selected
                        ? "border-[var(--zp-brand)] font-semibold text-[var(--zp-navy)]"
                        : "border-transparent font-medium text-[var(--zp-slate)] hover:text-[var(--zp-navy)]"}`}>
                      {label}
                      <span className={`rounded-full px-2 text-[13px] font-medium leading-[22px] ${selected
                        ? "bg-[var(--zp-brand)]/12 text-[var(--zp-brand-deep)]"
                        : "bg-[var(--zp-surface)] text-[var(--zp-slate)]"}`}>
                        {formatCount(counts[id])}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pb-3 lg:flex-nowrap lg:gap-[14px] lg:pb-0">
                <label className="relative w-full min-w-0 sm:w-auto sm:flex-1 lg:w-[192px] lg:flex-none">
                  <span className="sr-only">Search employees</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees..."
                    className="h-[35px] w-full rounded-lg border border-[var(--zp-border-strong)] bg-[var(--zp-card)] pl-9 pr-3 text-[13.5px] text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate)] focus:border-[var(--zp-brand)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/15" />
                </label>

                <Popover label="Filter" icon={Filter} badge={activeFilterCount} open={openPopover === "filter"}
                  onToggle={() => setOpenPopover((v) => (v === "filter" ? null : "filter"))} onClose={closePopover}>
                  <div role="dialog" aria-label="Filter employees" className={`${popoverPanel} flex w-[260px] flex-col gap-3 p-4`}>
                    <FilterSelect id="filter-department" label="Department" value={filters.department}
                      onChange={(department) => setFilters((f) => ({ ...f, department }))}
                      options={[["all", "All departments"], ...DEPARTMENTS.map((d) => [d, d])]} />
                    <FilterSelect id="filter-status" label="EAP access" value={tab} onChange={setTab}
                      options={[["all", "Any status"], ["active", "Active"], ["invited", "Invited"], ["deactivated", "Deactivated"]]} />
                    <FilterSelect id="filter-engagement" label="Engagement" value={filters.engagement}
                      onChange={(engagement) => setFilters((f) => ({ ...f, engagement }))}
                      options={[["all", "Any engagement"], ["high", "High"], ["medium", "Medium"], ["low", "Low"], ["none", "No engagement yet"]]} />
                    <button type="button" onClick={() => { setFilters(NO_FILTERS); setTab("all"); }}
                      disabled={!activeFilterCount && tab === "all"}
                      className="self-start text-[13px] font-medium text-[var(--zp-brand-deep)] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline">
                      Clear filters
                    </button>
                  </div>
                </Popover>

                <Popover label="Sort" icon={ArrowUpDown} open={openPopover === "sort"}
                  onToggle={() => setOpenPopover((v) => (v === "sort" ? null : "sort"))} onClose={closePopover}>
                  <ul role="listbox" aria-label="Sort employees" className={`${popoverPanel} w-[220px] p-1`}>
                    {SORTS.map(({ id, label }) => (
                      <li key={id} role="option" aria-selected={sort === id}>
                        <button type="button" onClick={() => { setSort(id); closePopover(); }}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13.5px] text-[var(--zp-navy)] hover:bg-[var(--zp-hover)]">
                          {label}
                          {sort === id && <Check className="h-4 w-4 text-[var(--zp-brand)]" aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Popover>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-5 lg:pl-[25px] lg:pr-[19px]">
              <table className="w-full min-w-[860px] table-fixed">
                <colgroup>{COLUMN_WIDTHS.map((width, i) => <col key={COLUMNS[i]} style={{ width }} />)}</colgroup>
                <TableHeader cols={COLUMNS} className="h-[46px] pb-0 align-middle text-[13px] font-normal normal-case tracking-normal" />
                <tbody>
                  {pageRows.map((employee) => (
                    <EmployeeRow key={employee.id} employee={employee} menuOpen={menu?.employee.id === employee.id} onOpenMenu={openRowMenu} />
                  ))}
                </tbody>
              </table>
              {pageRows.length === 0 && (
                <p className="py-12 text-center text-[14px] text-[var(--zp-slate)]">No employees match these filters.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-[var(--zp-border)] px-5 py-4 md:flex-row md:items-center md:justify-between lg:pl-[25px] lg:pr-[19px]">
              <p className="text-[13px] text-[var(--zp-slate)]">
                Showing {formatCount(firstShown)}–{formatCount(lastShown)} of {formatCount(visible.length)} employees
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} label="Employee pages" />
                <label className="flex items-center gap-3 text-[13px] text-[var(--zp-slate)]">
                  Rows per page
                  <span className="relative">
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                      className="h-[34px] w-[84px] appearance-none rounded-lg border border-[var(--zp-border-strong)] bg-[var(--zp-card)] pl-3 pr-8 text-[13px] text-[var(--zp-navy)] outline-none focus:border-[var(--zp-brand)]">
                      {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
                  </span>
                </label>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 content-start gap-5 md:grid-cols-2 xl:grid-cols-1">
            <QuickActionsCard onInvite={() => setDrawerOpen(true)} onUpload={openUpload}
              onDepartments={() => onNavigate("departments")} onExport={handleExport} />
            <PrivacyCard />
          </div>
        </div>
      </PageShell>

      {menu && <RowActionMenu menu={menu} onRemove={removeEmployee} onClose={closeMenu} />}
      <InviteEmployeeDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onSubmit={addEmployee} existingEmails={existingEmails} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
