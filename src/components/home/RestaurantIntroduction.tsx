import Image from "next/image";
import Link from "next/link";
import leftImg from "@/assets/photos/grill-flames.jpg";
import rightImg from "@/assets/photos/shawarma-spit.jpg";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localePath } from "@/lib/links";

/** Three-panel composition from the reference: photo, text card, photo. */
export function RestaurantIntroduction({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ar = locale === "ar";
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading script={t.intro.script} title={t.intro.title} />
        <div className="mt-14 grid gap-5 md:grid-cols-[1fr_1.05fr_1fr] md:gap-6">
          <figure className="zoom-host zoom-img relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[460px]" data-reveal>
            <Image src={leftImg} alt={ar ? "شواء على اللهب" : "Grilling over the flames"} fill sizes="(min-width: 768px) 33vw, 100vw" quality={85} placeholder="blur" className="object-cover" />
          </figure>
          <div className="flex flex-col items-center justify-center bg-surface px-7 py-14 text-center md:py-10" data-reveal>
            <p className="t-script text-[26px]">{t.intro.cardScript}</p>
            <h3 className="t-display mt-4 text-[30px] sm:text-[36px]">
              <span className="block">{t.intro.cardTitle[0]}</span>
              <span className="block">{t.intro.cardTitle[1]}</span>
            </h3>
            <p className="mt-6 max-w-sm text-[15px] sm:text-[16px]">{t.intro.text}</p>
            <Link href={localePath(locale, "/about")} className="btn btn-primary t-action mt-8">
              {t.intro.more}
            </Link>
          </div>
          <figure className="zoom-host zoom-img relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[460px]" data-reveal>
            <Image src={rightImg} alt={ar ? "شاورما على السيخ" : "Shawarma on the spit"} fill sizes="(min-width: 768px) 33vw, 100vw" quality={85} placeholder="blur" className="object-cover" />
          </figure>
        </div>
      </div>
    </section>
  );
}
