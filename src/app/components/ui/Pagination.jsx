import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Page numbers to show: first, last, and the current page's neighbours, with gaps as "…". */
export function pageItems(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 3) [2, 3].forEach((p) => pages.add(p));
  if (page >= pageCount - 2) [pageCount - 2, pageCount - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…", p] : [p]));
}

const base = "flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const idle = "border-[var(--zp-border-strong)] bg-[var(--zp-card)] text-[var(--zp-navy)] hover:bg-[var(--zp-hover)]";

export function Pagination({ page, pageCount, onPageChange, label = "Pagination" }) {
  return (
    <nav aria-label={label} className="flex items-center gap-2">
      <button type="button" className={`${base} ${idle}`} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      {pageItems(page, pageCount).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-[13px] text-[var(--zp-slate)]" aria-hidden="true">…</span>
        ) : (
          <button key={item} type="button" onClick={() => onPageChange(item)} aria-current={item === page ? "page" : undefined}
            className={`${base} ${item === page
              ? "border-[var(--zp-brand)] bg-[var(--zp-brand)]/10 font-semibold text-[var(--zp-brand-deep)]"
              : idle}`}>
            {item}
          </button>
        ),
      )}
      <button type="button" className={`${base} ${idle}`} onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="Next page">
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
