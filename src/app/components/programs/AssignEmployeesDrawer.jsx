import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SideDrawer } from "@/app/components/ui/SideDrawer";
import { InitialsAvatar } from "@/app/components/ui/InitialsAvatar";
import { primaryButton, secondaryButton } from "@/app/components/ui/dialog";

const avatarIndex = (name) => [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
const checkbox = "h-4 w-4 shrink-0 cursor-pointer rounded accent-[var(--zp-brand)]";

/**
 * Pick employees to add to a plan. Deactivated employees cannot be assigned,
 * and people already on the plan are not listed.
 */
export default function AssignEmployeesDrawer({ open, onOpenChange, program, employees, onAssign }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(new Set());
    }
  }, [open]);

  const assigned = useMemo(() => new Set(program?.assignedEmployeeIds ?? []), [program]);
  const candidates = useMemo(() => employees.filter((e) => e.status !== "deactivated" && !assigned.has(e.id)), [employees, assigned]);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return candidates;
    return candidates.filter((e) => e.name.toLowerCase().includes(needle) || e.email.includes(needle)
      || e.department.toLowerCase().includes(needle) || e.employeeId.toLowerCase().includes(needle));
  }, [candidates, query]);

  const allShownSelected = matches.length > 0 && matches.every((e) => selected.has(e.id));

  const toggle = (id) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleAllShown = () => setSelected((current) => {
    const next = new Set(current);
    matches.forEach((e) => (allShownSelected ? next.delete(e.id) : next.add(e.id)));
    return next;
  });

  return (
    <SideDrawer open={open} onOpenChange={onOpenChange} title="Assign to Employees"
      description={`Give more of your team access to ${program?.name ?? "this plan"}.`}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-[var(--zp-border)] px-[35px] py-4">
          <label className="relative block">
            <span className="sr-only">Search employees</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, department or ID..."
              className="h-[38px] w-full rounded-md border border-[var(--zp-border-strong)] bg-[var(--zp-card)] pl-9 pr-3 text-[14px] text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate-light)] focus:border-[var(--zp-brand)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/15" />
          </label>
          <div className="mt-3 flex items-center justify-between text-[13px] text-[var(--zp-slate)]">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" className={checkbox} checked={allShownSelected} onChange={toggleAllShown} disabled={!matches.length} />
              Select all shown ({matches.length.toLocaleString("en-US")})
            </label>
            <span>{candidates.length.toLocaleString("en-US")} not yet assigned</span>
          </div>
        </div>

        <ul className="flex-1 px-[35px] py-2" aria-label="Employees">
          {matches.map((employee) => (
            <li key={employee.id}>
              <label className="flex cursor-pointer items-center gap-3.5 rounded-lg px-1 py-2 hover:bg-[var(--zp-hover)]">
                <input type="checkbox" className={checkbox} checked={selected.has(employee.id)} onChange={() => toggle(employee.id)} />
                <InitialsAvatar name={employee.name} idx={avatarIndex(employee.name)} size="h-8 w-8" soft />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-[var(--zp-navy)]">{employee.name}</span>
                  <span className="block truncate text-[12.5px] text-[var(--zp-slate)]">{employee.email} · {employee.department}</span>
                </span>
              </label>
            </li>
          ))}
          {!matches.length && <li className="py-10 text-center text-[14px] text-[var(--zp-slate)]">No employees match your search.</li>}
        </ul>

        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-[var(--zp-border)] bg-[var(--zp-card)] px-[35px] py-4">
          <span className="text-[13px] text-[var(--zp-slate)]">{selected.size.toLocaleString("en-US")} selected</span>
          <div className="flex gap-3">
            <button type="button" onClick={() => onOpenChange(false)} className={secondaryButton}>Cancel</button>
            <button type="button" disabled={!selected.size} onClick={() => onAssign([...selected])} className={primaryButton}>
              Assign {selected.size ? selected.size.toLocaleString("en-US") : ""}
            </button>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}
