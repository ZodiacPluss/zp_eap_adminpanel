import React from "react";
import { Clock3, Bookmark } from "lucide-react";
import { ResourceArt } from "./ResourceArt";

/** Badge tint per resource type, taken from the palette. */
const TYPE_TONES = { Article: "teal", Video: "brand", Guide: "violet", Podcast: "emerald" };

/**
 * One library entry: artwork, type badge, copy, duration and a bookmark toggle.
 * The bookmark sits above the card's own click target so it does not open the
 * resource.
 */
export function ResourceCard({ resource, bookmarked, onToggleBookmark, onOpen, accents }) {
  const { title, description, type, meta, art, image } = resource;
  const accent = accents[TYPE_TONES[type]] ?? accents.brand;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--zp-border)] bg-[var(--zp-card)] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[124px] shrink-0 overflow-hidden">
        <ResourceArt image={image} art={art} alt={title} />
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm"
          style={{ background: "var(--zp-card)", color: accent, boxShadow: "0 1px 2px var(--zp-shadow)" }}>
          {type}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3.5 pt-3.5">
        <h3 className="text-[15px] font-semibold leading-[20px] text-[var(--zp-navy)]">
          {/* Stretched so the whole card is the click target, bar the bookmark. */}
          <button type="button" onClick={() => onOpen(resource)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline">
            {title}
          </button>
        </h3>
        <p className="mt-1.5 text-[13px] leading-[19px] text-[var(--zp-slate)]">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3.5">
          <span className="flex items-center gap-1.5 text-[12.5px] text-[var(--zp-slate)]">
            <Clock3 className="h-[15px] w-[15px]" strokeWidth={1.8} aria-hidden="true" />
            {meta}
          </span>
          <button type="button" onClick={() => onToggleBookmark(resource.id)}
            aria-pressed={bookmarked} aria-label={bookmarked ? `Remove ${title} from saved` : `Save ${title}`}
            className="relative z-10 -m-1.5 rounded-lg p-1.5 text-[var(--zp-slate)] transition-colors hover:bg-[var(--zp-hover)] hover:text-[var(--zp-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
            <Bookmark className="h-[17px] w-[17px]" strokeWidth={1.8}
              style={bookmarked ? { color: "var(--zp-brand)", fill: "currentColor" } : undefined} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;
