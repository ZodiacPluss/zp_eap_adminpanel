import React from "react";
import { Link2, ChevronRight, LifeBuoy, ArrowRight } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { QUICK_LINKS, SUPPORT_CALLOUT } from "@/app/data/resourcesData";

/** Shortcuts into the parts of the programme that sit outside the library. */
export function QuickLinksCard({ onSelect }) {
  return (
    <Card className="px-5 pb-2.5 pt-5">
      <h2 className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">
        <Link2 className="h-[18px] w-[18px] text-[var(--zp-brand)]" strokeWidth={1.9} aria-hidden="true" />
        Quick Links
      </h2>

      <ul className="mt-3">
        {QUICK_LINKS.map(({ id, label, icon: Icon }) => (
          <li key={id} className="border-b border-[var(--zp-border)] last:border-b-0">
            <button type="button" onClick={() => onSelect(label)}
              className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-[11px] text-left transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
              <Icon className="h-[17px] w-[17px] shrink-0 text-[var(--zp-brand)]" strokeWidth={1.8} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-[13.5px] text-[var(--zp-navy)]">{label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--zp-slate-light)]" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** The crisis callout that sits under the quick links. */
export function SupportCallout({ onSelect }) {
  return (
    <Card className="px-5 py-5 text-center">
      <span aria-hidden="true" className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--zp-amber)]/15">
        <LifeBuoy className="h-[21px] w-[21px] text-[var(--zp-amber)]" strokeWidth={1.9} />
      </span>
      <h2 className="mt-3 text-[15.5px] font-semibold text-[var(--zp-navy)]">{SUPPORT_CALLOUT.title}</h2>
      <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] leading-[19px] text-[var(--zp-slate)]">{SUPPORT_CALLOUT.detail}</p>
      <button type="button" onClick={() => onSelect(SUPPORT_CALLOUT.cta)}
        className="mt-4 inline-flex h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] text-[13.5px] font-medium text-[var(--zp-brand-deep)] shadow-[0_1px_2px_var(--zp-shadow)] transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
        {SUPPORT_CALLOUT.cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </Card>
  );
}

export default QuickLinksCard;
