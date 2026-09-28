import React from "react";
import { ArrowRight, Quote } from "lucide-react";
import { FEATURED_RESOURCE, WELLBEING_QUOTE } from "@/app/data/resourcesData";
import { ResourceArt } from "./ResourceArt";

/** The editor's pick, with the standing wellbeing note beside it. */
export function FeaturedHero({ onRead }) {
  const { eyebrow, title, description, cta, overlay, art, image } = FEATURED_RESOURCE;

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1170fr)_minmax(0,415fr)]">
      <article className="relative isolate overflow-hidden rounded-2xl border border-[var(--zp-border)] bg-[var(--zp-card)] shadow-sm">
        <div className="absolute inset-0 -z-10">
          <ResourceArt image={image} art={art} alt={title} />
          {/* Keeps the copy legible over the artwork, left-weighted as in the design. */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,var(--zp-card) 26%,rgba(255,255,255,0.72) 46%,transparent 66%)" }} />
        </div>

        <div className="max-w-[460px] px-6 py-8 sm:px-9 sm:py-11">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--zp-slate)]">{eyebrow}</p>
          <h2 className="mt-2.5 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--zp-navy)] sm:text-[33px]">{title}</h2>
          <p className="mt-2.5 text-[14.5px] leading-[22px] text-[var(--zp-slate)]">{description}</p>
          <button type="button" onClick={onRead}
            className="mt-6 inline-flex h-[42px] items-center gap-2.5 rounded-lg bg-[var(--zp-brand)] px-5 text-[14.5px] font-medium text-[var(--zp-on-accent)] shadow-[0_1px_2px_var(--zp-shadow)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p aria-hidden="true"
          className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 text-right font-['Playfair_Display',serif] text-[22px] italic leading-[1.35] text-[#2f4a72] xl:block">
          {overlay.map((line) => <span key={line} className="block">{line}</span>)}
          <span aria-hidden="true" className="ml-auto mt-2 block h-[2px] w-[86px] rounded-full bg-[#2f4a72]/60" />
        </p>
      </article>

      <figure className="flex flex-col justify-center rounded-2xl border border-[var(--zp-emerald)]/15 bg-[var(--zp-emerald)]/[0.08] px-7 py-9 text-center">
        <Quote className="mx-auto h-7 w-7 text-[var(--zp-emerald)]" strokeWidth={1.6} aria-hidden="true" />
        <blockquote className="mt-4 text-[18px] leading-[1.45] text-[var(--zp-navy)] sm:text-[19px]">
          {WELLBEING_QUOTE.lines.map((line, index) => (
            <span key={line} className="block">
              {index === 0 && "“"}{line}{index === WELLBEING_QUOTE.lines.length - 1 && "”"}
            </span>
          ))}
        </blockquote>
        <span aria-hidden="true" className="mx-auto mt-5 block h-[3px] w-12 rounded-full bg-[var(--zp-emerald)]/60" />
      </figure>
    </section>
  );
}

export default FeaturedHero;
