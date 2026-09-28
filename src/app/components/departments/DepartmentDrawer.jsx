import React, { useEffect, useRef, useState } from "react";
import { Plus, Save } from "lucide-react";
import { SideDrawer } from "@/app/components/ui/SideDrawer";
import { Field, SelectField, fieldBase, fieldBorder } from "@/app/components/ui/FormField";
import { DEPARTMENT_LOCATIONS, DEPARTMENT_STATUSES } from "@/app/data/departmentsData";

const EMPTY_FORM = {
  name: "",
  description: "",
  location: "",
  manager: "",
  status: DEPARTMENT_STATUSES[0],
};

// Field order, used to focus the first invalid field.
const FIELD_ORDER = ["name", "description", "location", "manager"];

function validate(form, takenNames) {
  const errors = {};
  const name = form.name.trim();
  if (!name) errors.name = "Enter a department name.";
  else if (takenNames.has(name.toLowerCase())) errors.name = "A department with this name already exists.";
  if (!form.description.trim()) errors.description = "Add a short description.";
  if (!form.location) errors.location = "Select a location.";
  if (!form.manager.trim()) errors.manager = "Enter the department manager's name.";
  return errors;
}

/**
 * Create or edit a department. `department` switches the drawer to edit mode;
 * leave it undefined to add a new one. Submitting hands the caller a plain
 * object, so a POST/PATCH can replace `onSubmit` unchanged.
 */
export function DepartmentDrawer({ open, onOpenChange, department, existingNames = new Set(), onSubmit }) {
  const editing = Boolean(department);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const refs = useRef({});

  // Reset to the edited row (or a blank form) each time the drawer opens.
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(department
      ? { name: department.name, description: department.description, location: department.location, manager: department.manager, status: department.status }
      : EMPTY_FORM);
  }, [open, department]);

  const update = (key) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // The row being edited keeps its own name available.
    const taken = new Set(existingNames);
    if (editing) taken.delete(department.name.toLowerCase());
    const found = validate(form, taken);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) return refs.current[firstInvalid]?.focus();

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      location: form.location,
      manager: form.manager.trim(),
      status: form.status,
    });
    onOpenChange(false);
  };

  const register = (key) => (node) => { refs.current[key] = node; };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit Department" : "Add Department"}
      description={editing
        ? "Update this department's details and how it is managed."
        : "Create a department so its employees can be grouped and reported on."}
    >
      <form onSubmit={handleSubmit} noValidate>
        <section className="space-y-4 px-[35px] pb-5 pt-5">
          <Field id="department-name" label="Department Name" required error={errors.name}>
            <input ref={register("name")} id="department-name" value={form.name} onChange={update("name")}
              placeholder="e.g. Customer Success" aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? "department-name-error" : undefined}
              className={`${fieldBase} ${fieldBorder(errors.name)} px-3.5`} />
          </Field>

          <Field id="department-description" label="Description" required error={errors.description}
            hint="A short line describing what the department does.">
            <textarea ref={register("description")} id="department-description" rows={3} value={form.description} onChange={update("description")}
              placeholder="e.g. Onboarding and account support" aria-invalid={Boolean(errors.description) || undefined}
              aria-describedby={errors.description ? "department-description-error" : undefined}
              className={`${fieldBase} ${fieldBorder(errors.description)} h-[78px] resize-none px-3.5 py-2.5`} />
          </Field>

          <Field id="department-location" label="Location" required error={errors.location}>
            <SelectField ref={register("location")} id="department-location" value={form.location} onChange={update("location")}
              placeholder="Select a location" options={DEPARTMENT_LOCATIONS} invalid={Boolean(errors.location)} />
          </Field>

          <Field id="department-manager" label="Department Manager" required error={errors.manager}>
            <input ref={register("manager")} id="department-manager" value={form.manager} onChange={update("manager")}
              placeholder="e.g. Rahul Kapoor" aria-invalid={Boolean(errors.manager) || undefined}
              aria-describedby={errors.manager ? "department-manager-error" : undefined}
              className={`${fieldBase} ${fieldBorder(errors.manager)} px-3.5`} />
          </Field>

          <Field id="department-status" label="Status"
            hint="Inactive departments stay in the directory but are excluded from new programme rollouts.">
            <SelectField id="department-status" value={form.status} onChange={update("status")} options={DEPARTMENT_STATUSES} />
          </Field>

          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={() => onOpenChange(false)}
              className="h-[41px] rounded-md border border-[var(--zp-border-strong)] bg-[var(--zp-card)] px-6 text-[14.5px] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)]">
              Cancel
            </button>
            <button type="submit"
              className="inline-flex h-[41px] items-center gap-2.5 rounded-md bg-[var(--zp-brand)] px-5 text-[14.5px] font-medium text-[var(--zp-on-accent)] transition-colors hover:bg-[var(--zp-brand-deep)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
              {editing ? <Save className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              {editing ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </section>
      </form>
    </SideDrawer>
  );
}

export default DepartmentDrawer;
