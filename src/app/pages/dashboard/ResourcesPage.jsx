import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, SearchX } from "lucide-react";
import { PageShell } from "@/app/components/ui/PageShell";
import { Card } from "@/app/components/ui/Card";
import { Toast } from "@/app/components/ui/Toast";
import { useAccents } from "@/app/theme/ThemeProvider";
import {
  CATEGORIES, POPULAR_TOPICS, RESOURCE_ITEMS, SAFETY_NOTICE, SORT_OPTIONS, filterResources,
} from "@/app/data/resourcesData";
import { FeaturedHero } from "@/app/components/resources/FeaturedHero";
import { ResourceFilterBar } from "@/app/components/resources/ResourceFilterBar";
import { CategoryFilters } from "@/app/components/resources/CategoryFilters";
import { ResourceCard } from "@/app/components/resources/ResourceCard";
import { QuickLinksCard, SupportCallout } from "@/app/components/resources/QuickLinksCard";
import { PopularTopics } from "@/app/components/resources/PopularTopics";
import { PrivacyBanner } from "@/app/components/ui/PrivacyBanner";

function SectionHeading({ title, actionLabel, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">{title}</h2>
      {actionLabel && (
        <button type="button" onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1.5 text-[13.5px] font-medium text-[var(--zp-brand-deep)] transition-colors hover:underline focus-visible:outline-none focus-visible:underline">
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function EmptyResults({ onClear }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--zp-brand)]/[0.08]">
        <SearchX className="h-6 w-6 text-[var(--zp-brand)]" strokeWidth={1.7} />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold text-[var(--zp-navy)]">No resources match your filters</h3>
      <p className="mt-1.5 max-w-[360px] text-[13px] text-[var(--zp-slate)]">
        Try a different search term, or clear the filters to browse the whole library.
      </p>
      <button type="button" onClick={onClear}
        className="mt-5 h-[40px] rounded-lg bg-[var(--zp-brand)] px-5 text-[13.5px] font-medium text-[var(--zp-on-accent)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25">
        Clear filters
      </button>
    </Card>
  );
}

export default function ResourcesPage({ searchRequest }) {
  const A = useAccents();
  const [query, setQuery] = useState(searchRequest?.query ?? "");
  const [categoryId, setCategoryId] = useState(null);
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState(SORT_OPTIONS[0].id);
  // The library opens on the editor's picks; browsing the rest is opt-in.
  const [showAll, setShowAll] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  // A search submitted from the header while this page is already open.
  useEffect(() => {
    if (!searchRequest) return;
    setQuery(searchRequest.query);
    setCategoryId(null);
    setType("All Types");
  }, [searchRequest]);

  const filtersActive = Boolean(query.trim() || categoryId || type !== "All Types");
  const browsing = filtersActive || showAll;

  const matches = useMemo(
    () => filterResources(RESOURCE_ITEMS, { query, categoryId, type, sort }),
    [query, categoryId, type, sort],
  );
  const visible = browsing ? matches : matches.filter((resource) => resource.featured);

  const clearFilters = () => {
    setQuery("");
    setCategoryId(null);
    setType("All Types");
    setShowAll(false);
  };

  const toggleBookmark = (id) => {
    const saved = bookmarks.has(id);
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setToast({ message: saved ? "Removed from your saved resources." : "Saved to your resources." });
  };

  const selectCategory = (id) => {
    setCategoryId(id);
    setShowAll(false);
  };

  const headingTitle = filtersActive
    ? `${visible.length} ${visible.length === 1 ? "resource" : "resources"}`
    : showAll ? "All Resources" : "Featured Resources";
  const headingAction = filtersActive ? "Clear filters" : showAll ? "Show less" : "View All";

  return (
    <PageShell
      large
      title="Resources"
      sub="Curated resources to support your employees' mental, emotional and personal wellbeing."
    >
      <div className="space-y-5">
        <FeaturedHero onRead={() => setToast({ message: "Opening “Small Steps, Big Impact”." })} />

        <ResourceFilterBar
          query={query} onQueryChange={setQuery}
          categoryId={categoryId} onCategoryChange={selectCategory}
          type={type} onTypeChange={setType}
          sort={sort} onSortChange={setSort}
        />

        <CategoryFilters categories={CATEGORIES} selectedId={categoryId} onSelect={selectCategory} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1235fr)_minmax(0,350fr)]">
          <section className="xl:col-start-1 xl:row-start-1">
            <SectionHeading
              title={headingTitle}
              actionLabel={headingAction}
              onAction={() => (filtersActive ? clearFilters() : setShowAll((v) => !v))}
            />
            {visible.length === 0 ? (
              <EmptyResults onClear={clearFilters} />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {visible.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    accents={A}
                    bookmarked={bookmarks.has(resource.id)}
                    onToggleBookmark={toggleBookmark}
                    onOpen={(item) => setToast({ message: `Opening “${item.title}”.` })}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="xl:col-start-1 xl:row-start-2">
            <SectionHeading
              title="Popular Topics"
              actionLabel="View All"
              onAction={() => { setCategoryId(null); setShowAll(true); }}
            />
            <PopularTopics topics={POPULAR_TOPICS} onSelect={selectCategory} />
          </section>

          <div className="space-y-5 self-start xl:col-start-2 xl:row-start-1">
            <QuickLinksCard onSelect={(label) => setToast({ message: `${label} is coming soon.` })} />
          </div>

          <div className="self-start xl:col-start-2 xl:row-start-2">
            <SupportCallout onSelect={(label) => setToast({ message: `${label} is coming soon.` })} />
          </div>
        </div>

        <PrivacyBanner {...SAFETY_NOTICE}
          onLearnMore={() => setToast({ message: "Confidentiality documentation is coming soon." })} />
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </PageShell>
  );
}
