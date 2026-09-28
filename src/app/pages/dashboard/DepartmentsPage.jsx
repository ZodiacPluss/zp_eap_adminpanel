import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Download, Plus } from "lucide-react";
import { PageShell } from "@/app/components/ui/PageShell";
import { MetricCard } from "@/app/components/ui/MetricCard";
import { PrivacyBanner } from "@/app/components/ui/PrivacyBanner";
import { Toast } from "@/app/components/ui/Toast";
import {
  DEPARTMENTS_PRIVACY_NOTICE, DEPARTMENTS_SUMMARY, DEPARTMENT_ROWS, DEPARTMENT_SORTS,
  filterDepartments,
} from "@/app/data/departmentsData";
import { DepartmentFilters } from "@/app/components/departments/DepartmentFilters";
import { DepartmentTable } from "@/app/components/departments/DepartmentTable";
import { DepartmentActionMenu, MENU_WIDTH } from "@/app/components/departments/DepartmentActionMenu";
import { DepartmentDrawer } from "@/app/components/departments/DepartmentDrawer";

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

/** CSV of exactly what the table is showing, so the export respects the filters. */
function buildDepartmentsCsv(rows) {
  const header = ["Department", "Description", "Employees", "EAP participation %", "Avg. wellbeing score", "Manager", "Location", "Status"];
  return [header, ...rows.map((row) => [
    row.name, row.description, row.employees, row.participation, row.wellbeingScore, row.manager, row.location, row.status,
  ])].map((line) => line.map(csvCell).join(",")).join("\n");
}

function downloadCsv(filename, contents) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** A slug that stays unique against the rows already in the table. */
function makeId(name, taken) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "department";
  let id = base;
  let suffix = 2;
  while (taken.has(id)) id = `${base}-${suffix++}`;
  return id;
}

export default function DepartmentsPage({ onNavigate = () => {}, searchRequest }) {
  // Mock data for now; replace with the departments API response when it lands.
  const [departments, setDepartments] = useState(DEPARTMENT_ROWS);
  const [query, setQuery] = useState(searchRequest?.query ?? "");
  const [departmentId, setDepartmentId] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState(DEPARTMENT_SORTS[0].id);
  const [menu, setMenu] = useState(null);
  const [drawer, setDrawer] = useState(null); // { department? } while open
  const [toast, setToast] = useState(null);

  const dismissToast = useCallback(() => setToast(null), []);
  const closeMenu = useCallback(() => setMenu(null), []);

  // A search submitted from the header while this page is already open.
  useEffect(() => {
    if (!searchRequest) return;
    setQuery(searchRequest.query);
    setDepartmentId("all");
    setLocation("all");
  }, [searchRequest]);

  const visible = useMemo(
    () => filterDepartments(departments, { query, departmentId, location, sort }),
    [departments, query, departmentId, location, sort],
  );

  // A department that is filtered out should not keep an open menu anchored to it.
  useEffect(() => {
    if (menu && !visible.some((row) => row.id === menu.department.id)) closeMenu();
  }, [visible, menu, closeMenu]);

  const existingNames = useMemo(
    () => new Set(departments.map((row) => row.name.toLowerCase())),
    [departments],
  );

  const clearFilters = () => {
    setQuery("");
    setDepartmentId("all");
    setLocation("all");
  };

  const openRowMenu = (department, anchorRef) => {
    if (menu?.department.id === department.id) return closeMenu();
    const rect = anchorRef.current.getBoundingClientRect();
    setMenu({
      department,
      anchorRef,
      top: rect.bottom + 6,
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  };

  const setStatus = (department, status) => {
    setDepartments((current) => current.map((row) => (row.id === department.id ? { ...row, status } : row)));
    setToast({ message: `${department.name} is now ${status.toLowerCase()}.` });
  };

  const handleAction = (action, department) => {
    closeMenu();
    switch (action) {
      case "edit": return setDrawer({ department });
      case "employees": return onNavigate("employees");
      case "reports": return onNavigate("reports");
      case "activate": return setStatus(department, "Active");
      case "deactivate": return setStatus(department, "Inactive");
      default: return setToast({ message: `${department.name} details are coming soon.` });
    }
  };

  const handleSubmit = (values) => {
    const editing = drawer?.department;
    if (editing) {
      setDepartments((current) => current.map((row) => (row.id === editing.id ? { ...row, ...values } : row)));
      setToast({ message: `${values.name} updated.` });
      return;
    }
    // New departments start empty; their metrics fill in as employees join.
    const id = makeId(values.name, new Set(departments.map((row) => row.id)));
    setDepartments((current) => [
      ...current,
      { id, employees: 0, participation: 0, wellbeingScore: 0, icon: Building2, tone: "teal", ...values },
    ]);
    setToast({ message: `${values.name} added to the directory.` });
  };

  const handleExport = () => {
    downloadCsv(`zodiacpluss-departments-${new Date().toISOString().slice(0, 10)}.csv`, buildDepartmentsCsv(visible));
    setToast({ message: `Exported ${visible.length} ${visible.length === 1 ? "department" : "departments"} as CSV.` });
  };

  return (
    <PageShell
      large
      title="Departments"
      sub="Manage and view how different departments are engaging with the EAP program."
      action={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button type="button" onClick={handleExport}
            className="flex h-[42px] items-center justify-center gap-2.5 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] px-5 text-[14px] font-medium text-[var(--zp-navy)] shadow-[0_1px_2px_var(--zp-shadow)] transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25">
            <Download className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden="true" />
            Export
          </button>
          <button type="button" onClick={() => setDrawer({})}
            className="flex h-[42px] items-center justify-center gap-2.5 rounded-lg bg-[var(--zp-brand)] px-5 text-[14px] font-medium text-[var(--zp-on-accent)] shadow-[0_1px_2px_var(--zp-shadow)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
            <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
            Add Department
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {DEPARTMENTS_SUMMARY.map((metric) => <MetricCard key={metric.id} {...metric} />)}
        </div>

        <DepartmentFilters
          departments={departments}
          query={query} onQueryChange={setQuery}
          departmentId={departmentId} onDepartmentChange={setDepartmentId}
          location={location} onLocationChange={setLocation}
          sort={sort} onSortChange={setSort}
        />

        <DepartmentTable
          departments={visible}
          sort={sort}
          onSortChange={setSort}
          menuFor={menu?.department.id}
          onOpenMenu={openRowMenu}
          onClearFilters={clearFilters}
        />

        <PrivacyBanner {...DEPARTMENTS_PRIVACY_NOTICE} tinted
          onLearnMore={() => setToast({ message: "Confidentiality documentation is coming soon." })} />
      </div>

      {menu && <DepartmentActionMenu menu={menu} onAction={handleAction} onClose={closeMenu} />}

      <DepartmentDrawer
        open={Boolean(drawer)}
        onOpenChange={(open) => !open && setDrawer(null)}
        department={drawer?.department}
        existingNames={existingNames}
        onSubmit={handleSubmit}
      />

      <Toast toast={toast} onDismiss={dismissToast} />
    </PageShell>
  );
}
