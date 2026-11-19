import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { itemsInCategory, visibleCategories } from "@/data/menu";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DishTile } from "@/components/menu/DishTile";
import { localePath } from "@/lib/links";

// Static class names so Tailwind generates them.
const LG_SPAN: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };

/** Editorial category grid: one large tile plus a 4-column field on desktop. */
export function MenuCategories({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const cats = visibleCategories;
  const hasBig = cats.length >= 5;
  // Cells after the 2x2 tile; the last tile widens so no grid cell is left empty.
  const rest = cats.length - (hasBig ? 1 : 0);
  const lgRemainder = (rest + (hasBig ? 4 : 0)) % 4;
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading script={t.categories.script} title={t.categories.title}>
          <p>{t.categories.text}</p>
        </SectionHeading>
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[minmax(0,1fr)] lg:grid-cols-4">
          {cats.map((cat, i) => {
            const big = i === 0 && hasBig;
            const isLast = i === cats.length - 1;
            const wideMobile = isLast && rest % 2 === 1;
            const wideLg = isLast && lgRemainder !== 0;
            const lgSpan = wideLg ? LG_SPAN[5 - lgRemainder] : "";
            const count = itemsInCategory(cat.id).length;
            return (
              <li
                key={cat.id}
                className={big ? "col-span-2 lg:row-span-2" : `${wideMobile ? "col-span-2" : ""} ${wideLg ? lgSpan : wideMobile ? "lg:col-span-1" : ""}`}
                data-reveal
              >
                <Link
                  href={`${localePath(locale, "/menu")}#${cat.id}`}
                  className={`zoom-host group relative block overflow-hidden ${big ? "aspect-[4/3] lg:aspect-auto lg:h-full" : wideMobile || wideLg ? "aspect-[2/1] lg:aspect-auto lg:h-full" : "aspect-square lg:aspect-[4/3]"}`}
                >
                  <span className="zoom-img absolute inset-0 block">
                    {cat.image ? (
                      <Image src={cat.image} alt="" fill sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} quality={80} className="object-cover" />
                    ) : (
                      <DishTile name={cat.name[locale]} />
                    )}
                  </span>
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <span>
                      <span className={`t-heading on-photo block ${big ? "text-[22px] sm:text-[28px]" : "text-[15px] sm:text-[18px]"}`}>{cat.name[locale]}</span>
                      <span className="on-photo mt-1 block text-[13px] text-bone/85">{t.categories.dishes(count)}</span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center border border-bone/40 text-bone transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink max-sm:hidden">
                      <Arrow className="size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 text-center" data-reveal>
          <Link href={localePath(locale, "/menu")} className="btn btn-outline t-action">
            {t.categories.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
