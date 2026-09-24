import React from "react";
import { useAccents } from "@/app/theme/ThemeProvider";

/**
 * Status pills are tinted from the active palette rather than fixed Tailwind
 * shades, so the same five tones read correctly on both light and dark cards:
 * a translucent wash of the accent, the accent itself for the label.
 */
const TONES = {
  active: "emerald",
  resolved: "emerald",
  success: "emerald",
  live: "emerald",
  verified: "teal",
  published: "teal",
  Professional: "teal",
  pending: "amber",
  processing: "amber",
  review: "amber",
  open: "rose",
  "in-progress": "violet",
  scheduled: "violet",
  Enterprise: "violet",
  inactive: "neutral",
  draft: "neutral",
  Starter: "neutral",
};

export function StatusBadge({ s }) {
  const A = useAccents();
  const tone = TONES[s] ?? "neutral";
  const accent = tone === "neutral" ? A.slate : A[tone];

  return (
    <span
      className="inline-flex items-center text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border capitalize transition-colors"
      style={{
        background: `${accent}1f`,
        borderColor: `${accent}3d`,
        color: accent,
      }}>
      {s}
    </span>
  );
}

export default StatusBadge;
