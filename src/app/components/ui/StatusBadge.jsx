import React from "react";
import { useAccents } from "@/app/theme/ThemeProvider";
import { cn } from "./utils";

/**
 * Status pills are tinted from the active palette rather than fixed Tailwind
 * shades, so the same five tones read correctly on both light and dark cards:
 * a translucent wash of the accent, the accent itself for the label.
 */
const TONES = {
  active: "emerald",
  resolved: "emerald",
  success: "emerald",
  complete: "emerald",
  live: "emerald",
  verified: "teal",
  published: "teal",
  invited: "teal",
  "on track": "teal",
  growing: "teal",
  building: "teal",
  Professional: "teal",
  pending: "amber",
  processing: "amber",
  review: "amber",
  open: "rose",
  "in-progress": "violet",
  scheduled: "violet",
  Enterprise: "violet",
  inactive: "neutral",
  deactivated: "rose",
  draft: "neutral",
  Starter: "neutral",
};

export function StatusBadge({ s, className, dot = false }) {
  const A = useAccents();
  const tone = TONES[s] ?? "neutral";
  const accent = tone === "neutral" ? A.slate : A[tone];

  return (
    <span
      className={cn("inline-flex items-center text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border capitalize transition-colors", className)}
      style={{
        background: `${accent}1f`,
        borderColor: `${accent}3d`,
        color: accent,
      }}>
      {dot && <span aria-hidden="true" className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />}
      {s}
    </span>
  );
}

export default StatusBadge;
