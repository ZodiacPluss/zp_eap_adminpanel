import React, { useCallback, useMemo, useState } from "react";
import { ArrowRight, Copy, Power } from "lucide-react";
import { EMPLOYEES, PROGRAMS, PROGRAM_FEATURES } from "@/app/data/mockData";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { ConfirmDialog } from "@/app/components/ui/dialog";
import { Toast } from "@/app/components/ui/Toast";
import ProgramDetail, { formatDate } from "@/app/components/programs/ProgramDetail";
import EditPlanDrawer from "@/app/components/programs/EditPlanDrawer";
import AssignEmployeesDrawer from "@/app/components/programs/AssignEmployeesDrawer";

const formatCount = (n) => n.toLocaleString("en-US");

const FEATURE_TONES = {
  brand: "bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]",
  emerald: "bg-[var(--zp-emerald)]/12 text-[var(--zp-emerald)]",
  violet: "bg-[var(--zp-violet)]/12 text-[var(--zp-violet)]",
  amber: "bg-[var(--zp-amber)]/12 text-[var(--zp-amber)]",
  rose: "bg-[var(--zp-rose)]/10 text-[var(--zp-rose)]",
};

function dialogIcon(Icon, danger) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger
      ? "bg-[var(--zp-rose)]/10 text-[var(--zp-rose)]"
      : "bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]"}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

// ─── Listing ──────────────────────────────────────────────────────────────────
function ProgramCard({ program, totalEmployees, onOpen }) {
  const assigned = program.assignedEmployeeIds.length;
  const features = PROGRAM_FEATURES.filter((f) => program.features.includes(f.id));
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">
          <button type="button" onClick={onOpen} className="rounded text-left hover:text-[var(--zp-brand-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
            {program.name}
          </button>
        </h2>
        <StatusBadge s={program.status} className="h-[26px] shrink-0 rounded-md border-0 px-2.5 text-[13px] font-medium" />
      </div>
      <p className="mt-1.5 text-[14.5px] leading-[21px] text-[var(--zp-slate)]">{program.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Included services">
        {features.map(({ id, title, icon: Icon, tone }) => (
          <li key={id} title={title} className={`flex h-8 w-8 items-center justify-center rounded-full ${FEATURE_TONES[tone]}`}>
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">{title}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-[13.5px]">
          <span className="text-[var(--zp-slate)]">Employees enrolled</span>
          <span className="font-medium text-[var(--zp-navy)]">{formatCount(assigned)} of {formatCount(totalEmployees)}</span>
        </div>
        <ProgressBar pct={(assigned / totalEmployees) * 100} color="var(--zp-brand)" className="mt-2 h-[5px] bg-[var(--zp-border-strong)]" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--zp-border)] pt-4 text-[13.5px]">
        <span className="text-[var(--zp-slate)]">Renews {formatDate(program.renewalDate)}</span>
        <button type="button" onClick={onOpen} className="inline-flex items-center gap-1.5 font-medium text-[var(--zp-brand-deep)] hover:underline">
          View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
/**
 * Programs: a list of the organization's EAP plans, and the detail view of one
 * plan. The plans live in local state for now; swap PROGRAMS for the plans API.
 */
export default function ProgramsPage({ onNavigate = () => {}, onContactSupport = () => {} }) {
  const [programs, setPrograms] = useState(PROGRAMS);
  const [selectedId, setSelectedId] = useState(null);
  const [dialog, setDialog] = useState(null); // "edit" | "assign" | "duplicate" | "deactivate" | null
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const program = programs.find((p) => p.id === selectedId) ?? null;
  const totalEmployees = EMPLOYEES.length;
  const closeDialog = () => setDialog(null);

  const updateProgram = (id, patch) =>
    setPrograms((current) => current.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const takenNames = useMemo(
    () => new Set(programs.filter((p) => p.id !== selectedId).map((p) => p.name.toLowerCase())),
    [programs, selectedId],
  );

  const handleSaveEdit = (values) => {
    updateProgram(program.id, values);
    closeDialog();
    setToast({ message: `${values.name} was updated.` });
  };

  const handleAssign = (ids) => {
    updateProgram(program.id, { assignedEmployeeIds: [...program.assignedEmployeeIds, ...ids] });
    closeDialog();
    setToast({ message: `${formatCount(ids.length)} ${ids.length === 1 ? "employee" : "employees"} assigned to ${program.name}.` });
  };

  const handleDuplicate = () => {
    const names = new Set(programs.map((p) => p.name));
    let name = `${program.name} (Copy)`;
    for (let n = 2; names.has(name); n++) name = `${program.name} (Copy ${n})`;
    const copy = {
      ...program,
      id: `${program.id}-copy-${Date.now()}`,
      name,
      status: "draft",
      enrollmentTrend: 0,
      assignedEmployeeIds: [],
    };
    setPrograms((current) => [...current, copy]);
    closeDialog();
    setToast({ message: `${name} was created as a draft.`, action: { label: "Open", onClick: () => setSelectedId(copy.id) } });
  };

  const handleToggleActive = () => {
    if (program.status === "active") {
      setDialog("deactivate");
      return;
    }
    updateProgram(program.id, { status: "active" });
    setToast({ message: `${program.name} is active again.` });
  };

  const handleDeactivate = () => {
    updateProgram(program.id, { status: "inactive" });
    closeDialog();
    setToast({ message: `${program.name} was deactivated.`, action: { label: "Undo", onClick: () => updateProgram(program.id, { status: "active" }) } });
  };

  const handleToggleFeature = (feature, on) => {
    const features = on
      ? PROGRAM_FEATURES.map((f) => f.id).filter((id) => id === feature.id || program.features.includes(id))
      : program.features.filter((id) => id !== feature.id);
    updateProgram(program.id, { features });
    setToast({ message: `${feature.title} ${on ? "added to" : "removed from"} ${program.name}.` });
  };

  const handleSaveSettings = (settings) => {
    updateProgram(program.id, { settings });
    setToast({ message: "Plan settings saved." });
  };

  return (
    <div className="zp-font">
      {program ? (
        // Keyed so tabs and the intro card start fresh for each plan.
        <ProgramDetail key={program.id}
          program={program}
          employees={EMPLOYEES}
          totalEmployees={totalEmployees}
          onBack={() => setSelectedId(null)}
          onEdit={() => setDialog("edit")}
          onAssign={() => setDialog("assign")}
          onDuplicate={() => setDialog("duplicate")}
          onUsageReport={() => onNavigate("reports")}
          onToggleActive={handleToggleActive}
          onToggleFeature={handleToggleFeature}
          onSaveSettings={handleSaveSettings}
          onContactSupport={onContactSupport}
        />
      ) : (
        <PageShell large title="Programs" sub="The EAP plans available to your organization.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} totalEmployees={totalEmployees} onOpen={() => setSelectedId(p.id)} />
            ))}
          </div>
        </PageShell>
      )}

      {program && (
        <>
          <EditPlanDrawer open={dialog === "edit"} onOpenChange={(open) => !open && closeDialog()}
            program={program} takenNames={takenNames} onSave={handleSaveEdit} />
          <AssignEmployeesDrawer open={dialog === "assign"} onOpenChange={(open) => !open && closeDialog()}
            program={program} employees={EMPLOYEES} onAssign={handleAssign} />
          <ConfirmDialog open={dialog === "duplicate"} onOpenChange={(open) => !open && closeDialog()}
            icon={dialogIcon(Copy)}
            title={`Duplicate ${program.name}?`}
            description="A draft copy is created with the same services and settings. No employees are assigned to the copy."
            confirmLabel="Duplicate Plan" onConfirm={handleDuplicate} />
          <ConfirmDialog open={dialog === "deactivate"} onOpenChange={(open) => !open && closeDialog()}
            icon={dialogIcon(Power, true)} destructive
            title={`Deactivate ${program.name}?`}
            description={`${formatCount(program.assignedEmployeeIds.length)} employees will lose access to these EAP services until the plan is reactivated.`}
            confirmLabel="Deactivate Plan" onConfirm={handleDeactivate} />
        </>
      )}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
