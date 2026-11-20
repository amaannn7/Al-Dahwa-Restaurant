"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import type { MenuItem } from "@/data/menu";
import type { Dictionary } from "@/i18n/dictionaries";
import { isOrderable } from "@/lib/cart";
import { formatSARFromNumber } from "@/lib/money";
import { AddToCartButton } from "./AddToCartButton";
import { DishTile } from "./DishTile";

/** "260 kcal · per 100 g" from the restaurant's printed calories, or null. */
export function caloriesLabel(item: MenuItem, t: Dictionary): string | null {
  if (!item.calories) return null;
  const per = item.caloriesPer === "piece" ? t.menu.perPiece : typeof item.caloriesPer === "number" ? t.menu.perGrams(item.caloriesPer) : "";
  return per ? `${t.menu.kcal(item.calories)} · ${per}` : t.menu.kcal(item.calories);
}

export function priceLabel(item: MenuItem, locale: "ar" | "en", fromWord: string) {
  if (item.variations?.options.length) {
    const prices = item.variations.options.map((o) => o.price);
    const min = Math.min(...prices);
    const same = prices.every((p) => p === min);
    return same ? formatSARFromNumber(min, locale) : `${fromWord} ${formatSARFromNumber(min, locale)}`;
  }
  return formatSARFromNumber(item.price, locale);
}

/** Menu card: photo, name, description, SAR price and add button. */
export function MenuItemCard({ item }: { item: MenuItem }) {
  const { locale, t } = useI18n();
  const { openItem } = useCart();
  const available = isOrderable(item) || !!item.dineInOnly;
  const name = item.name[locale];
  const kcal = caloriesLabel(item, t);

  return (
    <article
      className={`zoom-host group flex gap-4 border border-line bg-surface p-3 transition-colors duration-300 hover:border-line-strong sm:gap-5 sm:p-4 ${available ? "" : "opacity-60"}`}
      data-reveal
      data-testid={`item-${item.id}`}
    >
      <button
        type="button"
        onClick={() => openItem(item.id)}
        className="zoom-img relative aspect-[4/3] w-[112px] shrink-0 self-start overflow-hidden bg-surface-2 min-[380px]:w-[124px] sm:w-[184px]"
        aria-label={`${t.menu.details}: ${name}`}
      >
        {item.image ? (
          <Image src={item.image} alt={name} fill sizes="(min-width: 640px) 184px, 124px" quality={85} className="object-cover" />
        ) : (
          <DishTile name={name} compact />
        )}
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <h3 className="t-heading text-[15px] sm:text-[16px]">
            <button type="button" onClick={() => openItem(item.id)} className="text-start transition-colors hover:text-gold">
              {name}
            </button>
          </h3>
          <span className="leader hidden sm:block" aria-hidden />
          <p className="shrink-0 font-display text-[15px] font-semibold text-gold tabular-nums">
            {priceLabel(item, locale, t.menu.from)}
          </p>
        </div>
        {item.description[locale] ? (
          <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed sm:text-[15px]">{item.description[locale]}</p>
        ) : null}
        {kcal ? <p className="t-meta mt-1.5 text-muted">{kcal}</p> : null}
        <div className="mt-auto pt-3">
          <AddToCartButton item={item} variant="outline" compactOnSmall className="max-sm:px-3" />
        </div>
      </div>
    </article>
  );
}
