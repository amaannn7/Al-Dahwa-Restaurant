"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { getCategory, itemsInCategory, visibleCategories, type MenuItem } from "@/data/menu";
import { MenuItemCard } from "./MenuItemCard";

/** Lower-case, strip Arabic diacritics/tatweel and unify common letter forms. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const haystack = (i: MenuItem) =>
  normalize([i.name.en, i.name.ar, i.description.en, i.description.ar, getCategory(i.category)?.name.en ?? "", getCategory(i.category)?.name.ar ?? "", ...(i.variations?.options.flatMap((o) => [o.name.en, o.name.ar]) ?? [])].join(" "));

/** Full digital menu: sticky category rail with scroll-spy, sections below. */
export function MenuBrowser() {
  const { locale, t } = useI18n();
  const [active, setActive] = useState(visibleCategories[0]?.id ?? "");
  const railRef = useRef<HTMLDivElement>(null);
  const clickLock = useRef(0);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const normalized = normalize(deferred);
  const searching = normalized.length > 0;

  const sections = useMemo(() => {
    const terms = normalized.split(" ").filter(Boolean);
    return visibleCategories
        .map((c) => ({
          category: c,
          items: itemsInCategory(c.id).filter((i) => {
            if (terms.length === 0) return true;
            const h = haystack(i);
            return terms.every((term) => h.includes(term));
          }),
        }))
        .filter((s) => s.items.length > 0);
  }, [normalized]);
  const resultCount = sections.reduce((n, s) => n + s.items.length, 0);

  // Scroll-spy: highlight the section nearest the top.
  useEffect(() => {
    const sections = visibleCategories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickLock.current) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view inside the rail.
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!rail || !chip) return;
    const railBox = rail.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < railBox.left || chipBox.right > railBox.right) {
      rail.scrollBy({ left: chipBox.left - railBox.left - railBox.width / 2 + chipBox.width / 2, behavior: "smooth" });
    }
  }, [active]);

  const jump = (id: string) => (e: React.MouseEvent) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    clickLock.current = Date.now() + 900;
    setActive(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div>
      <div className="container-x mb-6">
        <div role="search" className="relative mx-auto max-w-xl">
          <label htmlFor="menu-search" className="sr-only">
            {t.menu.search}
          </label>
          <Search className="pointer-events-none absolute start-4 top-1/2 size-[18px] -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.menu.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
            className="block min-h-12 w-full border border-line-strong bg-surface ps-11 pe-12 text-[16px] text-bone placeholder:text-muted/80 transition-colors focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            data-testid="menu-search"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t.menu.clearSearch}
              className="absolute end-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-muted hover:text-gold"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          ) : null}
        </div>
        <p className="t-meta mt-3 text-center" aria-live="polite">
          {searching ? (resultCount ? t.menu.results(resultCount) : "") : ""}
        </p>
      </div>

      <div className="sticky top-[var(--header-h)] z-30 border-y border-line bg-ink/95 backdrop-blur-md">
        <nav aria-label={t.menu.categoriesLabel} className="container-x">
          <div ref={railRef} className="rail-fade no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={-1}>
            {sections.map(({ category: c }) => {
              const isActive = c.id === active;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  data-cat={c.id}
                  onClick={jump(c.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`t-action relative inline-flex min-h-14 shrink-0 items-center whitespace-nowrap px-4 transition-colors duration-200 ${
                    isActive ? "text-gold" : "text-bone/80 hover:text-bone"
                  }`}
                >
                  {c.name[locale]}
                  <span
                    aria-hidden
                    className={`absolute inset-x-4 bottom-0 h-0.5 bg-gold transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`}
                  />
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="container-x pb-20 pt-4 sm:pb-28">
        {searching && resultCount === 0 ? (
          <div className="py-20 text-center" data-testid="no-results">
            <p className="t-script text-[28px]">{t.menu.noResults}</p>
            <button type="button" onClick={() => setQuery("")} className="btn btn-outline t-action mt-8">
              {t.menu.clearSearch}
            </button>
          </div>
        ) : null}
        {sections.map(({ category: c, items }) => {
          return (
            <section
              key={c.id}
              id={c.id}
              aria-labelledby={`${c.id}-title`}
              className="scroll-mt-[calc(var(--header-h)+72px)] pt-14"
            >
              <div className="flex items-end gap-5" data-reveal>
                <h2 id={`${c.id}-title`} className="t-title text-[22px] sm:text-[28px]">
                  {c.name[locale]}
                </h2>
                <span className="mb-2 h-px flex-1 bg-line" aria-hidden />
                <span className="t-meta mb-1 whitespace-nowrap">{t.categories.dishes(items.length)}</span>
              </div>
              {c.note ? <p className="mt-3 text-[14px] text-muted" data-reveal>{c.note[locale]}</p> : null}
              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
