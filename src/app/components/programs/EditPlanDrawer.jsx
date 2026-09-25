import React, { useEffect, useRef, useState } from "react";
import { SideDrawer } from "@/app/components/ui/SideDrawer";
import { Field, SelectField, fieldBase, fieldBorder } from "@/app/components/ui/FormField";
import { primaryButton, secondaryButton } from "@/app/components/ui/dialog";
import { PLAN_TYPES } from "@/app/data/mockData";

const DESCRIPTION_LIMIT = 400;

const toForm = (program) => ({
  name: program?.name ?? "",
  summary: program?.summary ?? "",
  description: program?.description ?? "",
  planType: program?.planType ?? PLAN_TYPES[0],
  startDate: program?.startDate ?? "",
  renewalDate: program?.renewalDate ?? "",
});

function validate(form, takenNames) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter a plan name.";
  else if (takenNames.has(form.name.trim().toLowerCase())) errors.name = "Another plan already uses this name.";
  if (!form.summary.trim()) errors.summary = "Add a one-line summary.";
  if (!form.startDate) errors.startDate = "Choose a start date.";
  if (!form.renewalDate) errors.renewalDate = "Choose a renewal date.";
  else if (form.startDate && form.renewalDate <= form.startDate) errors.renewalDate = "Renewal must be after the start date.";
  return errors;
}

const ORDER = ["name", "summary", "startDate", "renewalDate"];

/** Edits a plan's details. `onSave` receives only the changed plan fields. */
export default function EditPlanDrawer({ open, onOpenChange, program, takenNames, onSave }) {
  const [form, setForm] = useState(() => toForm(program));
  const [errors, setErrors] = useState({});
  const refs = { name: useRef(null), summary: useRef(null), startDate: useRef(null), renewalDate: useRef(null) };

  // Start from the plan's current values every time the drawer opens.
  useEffect(() => {
    if (open) {
      setForm(toForm(program));
      setErrors({});
    }
  }, [open, program]);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, takenNames);
    setErrors(nextErrors);
    const firstInvalid = ORDER.find((key) => nextErrors[key]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }
    onSave({ ...form, name: form.name.trim(), summary: form.summary.trim(), description: form.description.trim() });
  };

  const input = (key, id, props = {}) => (
    <input ref={refs[key]} id={id} value={form[key]} onChange={update(key)} aria-invalid={Boolean(errors[key]) || undefined}
      aria-describedby={errors[key] ? `${id}-error` : undefined} className={`${fieldBase} ${fieldBorder(Boolean(errors[key]))} px-3.5`} {...props} />
  );

  return (
    <SideDrawer open={open} onOpenChange={onOpenChange} title="Edit Plan" description="Update how this plan is described and when it runs.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-[35px] py-6">
        <Field id="plan-name" label="Plan Name" required error={errors.name}>
          {input("name", "plan-name", { type: "text", autoComplete: "off" })}
        </Field>
        <Field id="plan-summary" label="Summary" required error={errors.summary} hint="Shown under the plan title.">
          {input("summary", "plan-summary", { type: "text", autoComplete: "off" })}
        </Field>
        <Field id="plan-description" label="Description" optional>
          <div className="relative">
            <textarea id="plan-description" rows={4} maxLength={DESCRIPTION_LIMIT} value={form.description} onChange={update("description")}
              className={`${fieldBase} ${fieldBorder(false)} h-[110px] resize-none px-3.5 py-2.5 pb-6 text-[13.5px]`} />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[12px] text-[var(--zp-slate)]">{form.description.length}/{DESCRIPTION_LIMIT}</span>
          </div>
        </Field>
        <Field id="plan-type" label="Plan Type">
          <SelectField id="plan-type" value={form.planType} onChange={update("planType")} options={PLAN_TYPES} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3.5">
          <Field id="plan-start" label="Start Date" required error={errors.startDate}>
            {input("startDate", "plan-start", { type: "date" })}
          </Field>
          <Field id="plan-renewal" label="Renewal Date" required error={errors.renewalDate}>
            {input("renewalDate", "plan-renewal", { type: "date", min: form.startDate || undefined })}
          </Field>
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <button type="button" onClick={() => onOpenChange(false)} className={secondaryButton}>Cancel</button>
          <button type="submit" className={primaryButton}>Save Changes</button>
        </div>
      </form>
    </SideDrawer>
  );
}
