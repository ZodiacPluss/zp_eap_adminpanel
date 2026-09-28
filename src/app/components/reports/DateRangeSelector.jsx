import React, { useRef, useState } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { useDismiss } from "@/app/hooks/useDismiss";
import { DATE_RANGE_PRESETS } from "@/app/data/reportsData";

const DATE_LABEL = { year: "numeric", month: "short", day: "numeric" };

/** "2024-01-01" → "Jan 1, 2024", parsed as a plain date so the timezone cannot shift it. */
export function formatRangeLabel(from, to) {
  const format = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", DATE_LABEL);
  };
  return `${format(from)} - ${format(to)}`;
}

/** Preset windows plus a custom from/to pair. Emits `{ id, label, from, to }`. */
export function DateRangeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState({ from: value.from, to: value.to });
  const ref = useRef(null);
  const close = React.useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const applyCustom = () => {
    if (!custom.from || !custom.to || custom.from > custom.to) return;
    onChange({ id: "custom", label: formatRangeLabel(custom.from, custom.to), ...custom });
    close();
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open}
        className="flex h-[42px] w-full items-center gap-2.5 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] px-4 text-[14px] font-medium text-[var(--zp-navy)] shadow-[0_1px_2px_var(--zp-shadow)] transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25 sm:w-auto">
        <CalendarDays className="h-[18px] w-[18px] shrink-0 text-[var(--zp-slate)]" strokeWidth={1.7} aria-hidden="true" />
        <span className="flex-1 truncate text-left">{value.label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />
      </button>

      {open && (
        <div role="dialog" aria-label="Select date range"
          className="absolute right-0 top-[50px] z-50 w-[290px] overflow-hidden rounded-xl border border-[var(--zp-border)] bg-[var(--zp-card)] shadow-[0_20px_40px_var(--zp-shadow)]">
          <ul className="py-1">
            {DATE_RANGE_PRESETS.map((preset) => (
              <li key={preset.id}>
                <button type="button" onClick={() => { onChange(preset); close(); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)]">
                  <span className="flex-1">{preset.label}</span>
                  {preset.id === value.id && <Check className="h-4 w-4 text-[var(--zp-brand)]" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--zp-border)] p-4">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--zp-slate-light)]">Custom range</p>
            <div className="flex items-center gap-2">
              {["from", "to"].map((key) => (
                <label key={key} className="min-w-0 flex-1">
                  <span className="sr-only">{key === "from" ? "Start date" : "End date"}</span>
                  <input type="date" value={custom[key]} max={key === "from" ? custom.to : undefined} min={key === "to" ? custom.from : undefined}
                    onChange={(e) => setCustom((c) => ({ ...c, [key]: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] px-2 text-[12px] text-[var(--zp-navy)] outline-none focus:ring-2 focus:ring-[var(--zp-brand)]/25" />
                </label>
              ))}
            </div>
            <button type="button" onClick={applyCustom} disabled={!custom.from || !custom.to || custom.from > custom.to}
              className="mt-3 h-9 w-full rounded-lg bg-[var(--zp-brand)] text-[13px] font-medium text-[var(--zp-on-accent)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeSelector;
