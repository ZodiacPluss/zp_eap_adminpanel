import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "./Card";

/**
 * The standing confidentiality note at the foot of the reporting pages.
 *
 * `inline` runs the title into the detail on one line (Reports); the default
 * stacks them (Departments, Resources). `tinted` fills the card with the brand
 * wash instead of leaving it white.
 */
export function PrivacyBanner({ title, detail, onLearnMore, learnMoreLabel = "Learn More", inline = false, tinted = false, arrow = true }) {
  return (
    <Card className={`flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${tinted ? "bg-[var(--zp-brand)]/[0.06]" : ""}`}>
      <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--zp-brand)]" strokeWidth={1.9} aria-hidden="true" />

      {inline ? (
        <p className="min-w-0 flex-1 text-[12.5px] leading-[19px] text-[var(--zp-slate)]">
          <span className="font-semibold text-[var(--zp-navy)]">{title}</span> {detail}
        </p>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-[var(--zp-navy)]">{title}</p>
          <p className="mt-0.5 text-[12.5px] leading-[19px] text-[var(--zp-slate)]">{detail}</p>
        </div>
      )}

      {onLearnMore && (
        <button type="button" onClick={onLearnMore}
          className="inline-flex shrink-0 items-center gap-1.5 self-start text-[12.5px] font-medium text-[var(--zp-brand-deep)] transition-colors hover:underline focus-visible:outline-none focus-visible:underline sm:self-auto">
          {learnMoreLabel}
          {arrow && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      )}
    </Card>
  );
}

export default PrivacyBanner;
