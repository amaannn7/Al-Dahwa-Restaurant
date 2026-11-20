"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import { priceLabel } from "@/components/menu/MenuItemCard";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { featuredItems } from "@/data/menu";
import { localePath } from "@/lib/links";

/**
 * "Our Special" layout from the reference: a large photo beside a priced list
 * with gold leader lines. The photo follows the dish being hovered/focused.
 */
export function FeaturedDishes() {
  const { locale, t } = useI18n();
  const { openItem } = useCart();
  const [active, setActive] = useState(0);
  const items = featuredItems;
  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-20 sm:py-28" aria-labelledby="featured-title">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="relative hidden aspect-[4/3] overflow-hidden lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:block" data-reveal>
          {items.map((item, i) =>
            item.image ? (
              <Image
                key={item.id}
                src={item.image}
                alt={i === active ? item.name[locale] : ""}
                fill
                sizes="(min-width: 1024px) 45vw, 0px"
                quality={85}
                className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease)] ${
                  i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              />
            ) : null,
          )}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="t-script on-photo absolute bottom-6 start-7 text-[30px]">{items[active].name[locale]}</p>
        </div>

        <div>
          <div data-reveal>
            <p className="t-script text-[26px] sm:text-[30px]">{t.featured.script}</p>
            <h2 id="featured-title" className="t-title mt-2 text-[28px] sm:text-[40px]">
              {t.featured.title}
            </h2>
          </div>
          <ul className="mt-10 space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`flex gap-4 border-s-2 py-4 ps-4 transition-colors duration-300 sm:ps-5 ${i === active ? "border-gold" : "border-transparent"}`}
                data-reveal
              >
                <button
                  type="button"
                  onClick={() => openItem(item.id)}
                  className="relative size-20 shrink-0 overflow-hidden bg-surface-2 lg:hidden"
                  aria-label={`${t.menu.details}: ${item.name[locale]}`}
                >
                  {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-cover" /> : null}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <h3 className="t-heading text-[16px] sm:text-[18px]">
                      <button type="button" onClick={() => openItem(item.id)} className="text-start transition-colors hover:text-gold">
                        {item.name[locale]}
                      </button>
                    </h3>
                    <span className="leader hidden sm:block" aria-hidden />
                    <p className="shrink-0 font-display text-[16px] font-semibold text-gold tabular-nums">
                      {priceLabel(item, locale, t.menu.from)}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[15px]">{item.description[locale]}</p>
                  <AddToCartButton item={item} variant="outline" compactOnSmall className="mt-3" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-5" data-reveal>
            <Link href={localePath(locale, "/menu")} className="btn btn-primary t-action self-start">
              {t.featured.viewAll}
            </Link>
            <PlaceholderNotice text={t.menu.placeholder} className="text-[13px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
