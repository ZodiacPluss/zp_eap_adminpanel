import React from "react";
import { ChevronDown } from "lucide-react";

/** Shared look of text inputs, selects and textareas in the redesigned forms. */
export const fieldBase =
  "h-[38px] w-full rounded-md border bg-[var(--zp-card)] text-[14px] text-[var(--zp-navy)] outline-none transition-shadow placeholder:text-[var(--zp-slate-light)] focus:border-[var(--zp-brand)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/15 disabled:cursor-not-allowed disabled:opacity-60";
export const fieldBorder = (invalid) => (invalid ? "border-[var(--zp-rose)]" : "border-[var(--zp-border-strong)]");

/** Label + control + error message. The error is linked via `${id}-error`. */
export function Field({ id, label, required, optional, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-[var(--zp-navy)]">
        {label}
        {optional && <span className="font-normal"> (Optional)</span>}
        {required && <span className="text-[var(--zp-rose)]"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[12px] text-[var(--zp-slate)]">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-[12px] text-[var(--zp-rose)]">{error}</p>}
    </div>
  );
}

/** Native select styled like the text fields. `options` are strings or [value, label] pairs. */
export const SelectField = React.forwardRef(function SelectField({ id, value, onChange, placeholder, options, invalid, className = "", ...rest }, ref) {
  return (
    <div className={`relative ${className}`}>
      <select ref={ref} id={id} value={value} onChange={onChange} aria-invalid={invalid || undefined}
        className={`${fieldBase} ${fieldBorder(invalid)} appearance-none pl-3.5 pr-9 ${value ? "" : "text-[var(--zp-slate)]"}`} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => {
          const [optionValue, optionLabel] = Array.isArray(option) ? option : [option, option];
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate)]" aria-hidden="true" />
    </div>
  );
});
