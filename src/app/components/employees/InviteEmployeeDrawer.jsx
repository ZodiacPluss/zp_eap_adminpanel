import React, { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Info, Mail, Send } from "lucide-react";
import { SideDrawer } from "@/app/components/ui/SideDrawer";
import { Field, SelectField, fieldBase, fieldBorder } from "@/app/components/ui/FormField";
import { Switch } from "@/app/components/ui/Switch";
import { COUNTRY_CODES, DEPARTMENTS, EAP_PLANS, EMPLOYMENT_TYPES, ROLES_BY_DEPARTMENT } from "@/app/data/mockData";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_LIMIT = 300;

const EMPTY_FORM = {
  fullName: "",
  email: "",
  employeeId: "",
  countryCode: COUNTRY_CODES[0].code,
  phone: "",
  department: "",
  role: "",
  employmentType: EMPLOYMENT_TYPES[0],
  location: "",
  eapAccess: true,
  plan: EAP_PLANS[0],
  message: "",
};

/** The one flag the reference shows; other dialling codes fall back to their ISO code. */
function IndiaFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 rounded-[2px]" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.33" fill="#FF9933" />
      <rect y="10.67" width="24" height="5.33" fill="#138808" />
      <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.6" />
    </svg>
  );
}

function Section({ title, children, divider = true }) {
  return (
    <section className={`px-[35px] ${divider ? "border-t border-[var(--zp-border)] pt-5" : "pt-5"} pb-5`}>
      <h3 className="mb-3 text-[16px] font-semibold text-[var(--zp-navy)]">{title}</h3>
      {children}
    </section>
  );
}

function validate(form, existingEmails) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Enter the employee's full name.";
  const email = form.email.trim().toLowerCase();
  if (!email) errors.email = "Enter a work email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  else if (existingEmails.has(email)) errors.email = "An employee with this email already exists.";
  if (!form.department) errors.department = "Select a department.";
  if (!form.role) errors.role = "Select a role.";
  return errors;
}

// Field order, used to focus the first invalid field.
const FIELD_ORDER = ["fullName", "email", "department", "role"];

/**
 * Invite form in a right-hand drawer. Frontend-only for now: `onSubmit`
 * receives the validated values and the parent decides what to do with them.
 */
export default function InviteEmployeeDrawer({ open, onOpenChange, onSubmit, existingEmails }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const refs = { fullName: useRef(null), email: useRef(null), department: useRef(null), role: useRef(null) };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleOpenChange = (next) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({
      ...current,
      [key]: value,
      // A role only makes sense within its department.
      ...(key === "department" ? { role: "" } : null),
    }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, existingEmails);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }
    onSubmit({ ...form, fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), employeeId: form.employeeId.trim() });
    reset();
  };

  const invalid = (key) => Boolean(errors[key]);
  const describedBy = (key, id) => (errors[key] ? `${id}-error` : undefined);
  const country = COUNTRY_CODES.find((c) => c.code === form.countryCode);

  return (
    <SideDrawer open={open} onOpenChange={handleOpenChange} title="Invite Employee"
      description="Send an invitation to give your employee access to EAP services.">
        <form onSubmit={handleSubmit} noValidate>
          <Section title="Basic Information" divider={false}>
            <div className="flex flex-col gap-4">
              <Field id="invite-name" label="Full Name" required error={errors.fullName}>
                <input ref={refs.fullName} id="invite-name" type="text" autoComplete="off" placeholder="Enter full name"
                  value={form.fullName} onChange={update("fullName")} aria-invalid={invalid("fullName") || undefined} aria-describedby={describedBy("fullName", "invite-name")}
                  className={`${fieldBase} ${fieldBorder(invalid("fullName"))} px-3.5`} />
              </Field>
              <Field id="invite-email" label="Work Email" required error={errors.email}>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
                  <input ref={refs.email} id="invite-email" type="email" autoComplete="off" placeholder="name@company.com"
                    value={form.email} onChange={update("email")} aria-invalid={invalid("email") || undefined} aria-describedby={describedBy("email", "invite-email")}
                    className={`${fieldBase} ${fieldBorder(invalid("email"))} pl-10 pr-3.5`} />
                </div>
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3.5">
                <Field id="invite-employee-id" label="Employee ID" optional>
                  <input id="invite-employee-id" type="text" placeholder="e.g. EMP-1025" value={form.employeeId} onChange={update("employeeId")}
                    className={`${fieldBase} ${fieldBorder(false)} px-3.5`} />
                </Field>
                <Field id="invite-phone" label="Phone Number" optional>
                  <div className="flex h-[38px] rounded-md border border-[var(--zp-border-strong)] bg-[var(--zp-card)] focus-within:border-[var(--zp-brand)] focus-within:ring-[3px] focus-within:ring-[var(--zp-brand)]/15">
                    <label className="relative flex w-[88px] shrink-0 items-center gap-1.5 border-r border-[var(--zp-border-strong)] pl-2.5">
                      <span className="sr-only">Country code</span>
                      {country?.country === "IN" ? <IndiaFlag /> : <span className="text-[11px] font-semibold text-[var(--zp-slate)]">{country?.country}</span>}
                      <span className="text-[14px] text-[var(--zp-navy)]">{form.countryCode}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-[var(--zp-slate)]" aria-hidden="true" />
                      <select value={form.countryCode} onChange={update("countryCode")} className="absolute inset-0 cursor-pointer opacity-0">
                        {COUNTRY_CODES.map(({ code, country: iso }) => <option key={code} value={code}>{iso} {code}</option>)}
                      </select>
                    </label>
                    <input id="invite-phone" type="tel" inputMode="tel" placeholder="98765 43210" value={form.phone} onChange={update("phone")}
                      className="min-w-0 flex-1 bg-transparent px-2.5 text-[14px] text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate-light)]" />
                  </div>
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Organization Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px]">
              <Field id="invite-department" label="Department" required error={errors.department}>
                <SelectField ref={refs.department} id="invite-department" value={form.department} onChange={update("department")}
                  placeholder="Select department" options={DEPARTMENTS} invalid={invalid("department")} aria-describedby={describedBy("department", "invite-department")} />
              </Field>
              <Field id="invite-role" label="Role" required error={errors.role}>
                <SelectField ref={refs.role} id="invite-role" value={form.role} onChange={update("role")}
                  placeholder="Select role" options={ROLES_BY_DEPARTMENT[form.department] ?? []}
                  invalid={invalid("role")} aria-describedby={describedBy("role", "invite-role")} disabled={!form.department}
                  title={form.department ? undefined : "Choose a department first"} />
              </Field>
              <Field id="invite-employment" label="Employment Type">
                <SelectField id="invite-employment" value={form.employmentType} onChange={update("employmentType")} options={EMPLOYMENT_TYPES} />
              </Field>
              <Field id="invite-location" label="Work Location" optional>
                <input id="invite-location" type="text" placeholder="e.g. Bengaluru, India" value={form.location} onChange={update("location")}
                  className={`${fieldBase} ${fieldBorder(false)} px-3.5`} />
              </Field>
            </div>
          </Section>

          <Section title="EAP Access">
            <label className="flex cursor-pointer items-start gap-3.5 [&>span:first-child]:mt-0.5">
              <Switch checked={form.eapAccess} onCheckedChange={(eapAccess) => setForm((current) => ({ ...current, eapAccess }))} />
              <span>
                <span className="block text-[14.5px] font-medium text-[var(--zp-navy)]">Give this employee access to EAP services</span>
                <span className="block text-[12px] text-[var(--zp-slate)]">
                  {form.eapAccess
                    ? "An invitation email will be sent with instructions to activate their account."
                    : "The employee will be added without EAP access. You can invite them later."}
                </span>
              </span>
            </label>

            <label htmlFor="invite-plan" className="mb-1.5 mt-6 block text-[14px] text-[var(--zp-slate)]">Assigned Plan</label>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <SelectField id="invite-plan" value={form.plan} onChange={update("plan")} options={EAP_PLANS} disabled={!form.eapAccess}
                className="w-full sm:w-[262px]" />
              {/* TODO: link to the plan page once it exists. */}
              <button type="button" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--zp-brand-deep)] hover:underline">
                View Plan Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Section>

          <section className="border-t border-[var(--zp-border)] px-[35px] pb-5 pt-5">
            <label htmlFor="invite-message" className="mb-3 block text-[16px] font-semibold text-[var(--zp-navy)]">
              Personal Message <span className="text-[14px] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <textarea id="invite-message" rows={3} maxLength={MESSAGE_LIMIT} value={form.message} onChange={update("message")}
                placeholder="Add a personal message to include in the invitation email..."
                className={`${fieldBase} ${fieldBorder(false)} h-[86px] resize-none px-3.5 py-2.5 pb-6 text-[13.5px]`} />
              <span className="pointer-events-none absolute bottom-2 right-3 text-[12px] text-[var(--zp-slate)]" aria-live="polite">
                {form.message.length}/{MESSAGE_LIMIT}
              </span>
            </div>

            <div className="mt-[30px] flex justify-end gap-4">
              <button type="button" onClick={() => handleOpenChange(false)}
                className="h-[41px] rounded-md border border-[var(--zp-border-strong)] bg-[var(--zp-card)] px-6 text-[14.5px] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)]">
                Cancel
              </button>
              <button type="submit"
                className="inline-flex h-[41px] items-center gap-2.5 rounded-md bg-[var(--zp-brand)] px-5 text-[14.5px] font-medium text-[var(--zp-on-accent)] transition-colors hover:bg-[var(--zp-brand-deep)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
                <Send className="h-4 w-4" aria-hidden="true" />
                {form.eapAccess ? "Send Invitation" : "Add Employee"}
              </button>
            </div>

            <div className="mt-[30px] flex gap-3 rounded-lg bg-[var(--zp-brand)]/[0.06] p-3.5 text-[12.5px] leading-5 text-[var(--zp-slate)]">
              <Info className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.7} aria-hidden="true" />
              <p>The employee will receive an email with a secure link to activate their account. They can access EAP services confidentially.</p>
            </div>
          </section>
        </form>
    </SideDrawer>
  );
}
