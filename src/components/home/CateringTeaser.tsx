import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check } from "lucide-react";
import buffet from "@/assets/photos/catering-buffet.jpg";
import coffee from "@/assets/photos/arabic-coffee.jpg";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/links";

/** Home page invitation to the Catering & Bulk Orders page. */
export function CateringTeaser({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.catering;
  const page = localePath(locale, "/catering");
  return (
    <section className="overflow-hidden bg-surface py-20 sm:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative pb-14 pe-8 sm:pb-20 sm:pe-14" data-reveal>
          <figure className="relative aspect-[4/3] overflow-hidden">
            <Image src={buffet} alt="" fill sizes="(min-width: 1024px) 42vw, 90vw" quality={85} placeholder="blur" className="object-cover" />
          </figure>
          <figure className="absolute bottom-0 end-0 aspect-[3/4] w-[38%] overflow-hidden border-[6px] border-surface shadow-2xl">
            <Image src={coffee} alt="" fill sizes="(min-width: 1024px) 21vw, 45vw" quality={80} className="object-cover" />
          </figure>
          <span aria-hidden className="absolute -top-4 -start-4 size-24 border-s border-t border-gold-line sm:-top-6 sm:-start-6 sm:size-32" />
        </div>

        <div data-reveal>
          <p className="t-script text-[26px] sm:text-[30px]">{c.teaserScript}</p>
          <h2 className="t-title mt-2 text-[28px] sm:text-[40px]">{c.teaserTitle}</h2>
          <p className="mt-5 max-w-xl text-[16px] sm:text-[17px]">{c.teaserText}</p>
          <ul className="mt-8 space-y-3.5">
            {c.teaserPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[16px] text-bone">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={`${page}#inquiry`} className="btn btn-primary t-action">
              {c.planCta}
            </Link>
            <Link href={`${page}#meeting`} className="btn btn-outline t-action">
              <CalendarDays className="size-[18px]" aria-hidden />
              {c.meetCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
