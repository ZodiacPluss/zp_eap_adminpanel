import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { DEPARTMENT_LOCATIONS, DEPARTMENT_SORTS } from "@/app/data/departmentsData";

const selectClass =
  "h-[42px] w-full cursor-pointer appearance-none rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] pl-4 pr-10 text-[14px] text-[var(--zp-navy)] outline-none transition-colors hover:bg-[var(--zp-hover)] focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25";

function Select({ label, value, onChange, children, hideLabel = true }) {
  return (
    <label className="relative flex min-w-0 items-center gap-2.5">
      <span className={hideLabel ? "sr-only" : "shrink-0 text-[14px] text-[var(--zp-slate)]"}>{label}</span>
      <span className="relative min-w-0 flex-1">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>{children}</select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
      </span>
    </label>
  );
}

/** Search plus the department, location and sort controls above the table. */
export function DepartmentFilters({ departments, query, onQueryChange, departmentId, onDepartmentChange, location, onLocationChange, sort, onSortChange }) {
  return (
    <Card className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.95fr)]">
      <div className="relative min-w-0">
        <label htmlFor="department-search" className="sr-only">Search departments</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--zp-slate-light)]" aria-hidden="true" />
        <input id="department-search" type="search" value={query} onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search departments or managers..."
          className="h-[42px] w-full rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] pl-11 pr-4 text-[14px] text-[var(--zp-navy)] outline-none transition-shadow placeholder:text-[var(--zp-slate-light)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/20" />
      </div>

      <Select label="Department" value={departmentId} onChange={onDepartmentChange}>
        <option value="all">All Departments</option>
        {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
      </Select>

      <Select label="Location" value={location} onChange={onLocationChange}>
        <option value="all">All Locations</option>
        {DEPARTMENT_LOCATIONS.map((name) => <option key={name} value={name}>{name}</option>)}
      </Select>

      <Select label="Sort by" value={sort} onChange={onSortChange} hideLabel={false}>
        {DEPARTMENT_SORTS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
      </Select>
    </Card>
  );
}

export default DepartmentFilters;
