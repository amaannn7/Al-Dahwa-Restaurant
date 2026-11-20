import Image from "next/image";
import chickenRice from "@/assets/photos/chicken-rice.jpg";
import spread from "@/assets/photos/arabic-feast.jpg";
import platter from "@/assets/photos/grill-platter.jpg";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Editorial collage about visiting. The restaurant's interior photos have not
 * been supplied, so this uses food photography only and never claims a photo
 * shows the restaurant itself.
 */
export function ExperienceSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ar = locale === "ar";
  return (
    <section className="overflow-hidden bg-surface py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-7">
          <div className="grid grid-cols-6 grid-rows-[auto] gap-3 sm:gap-4">
            <figure className="relative col-span-4 row-span-2 overflow-hidden" data-reveal>
              <Image src={chickenRice} alt={ar ? "دجاج مشوي مع الرز" : "Grilled chicken with rice"} fill sizes="(min-width: 1024px) 38vw, 66vw" quality={85} placeholder="blur" className="object-cover" />
            </figure>
            <figure className="relative col-span-2 aspect-[3/4] overflow-hidden" data-reveal>
              <Image src={spread} alt={ar ? "أطباق متنوعة على المائدة" : "Dishes shared at the table"} fill sizes="(min-width: 1024px) 19vw, 33vw" quality={80} className="object-cover" />
            </figure>
            <figure className="relative col-span-2 aspect-[3/4] overflow-hidden" data-reveal>
              <Image src={platter} alt={ar ? "صحن مشويات" : "A grill platter"} fill sizes="(min-width: 1024px) 19vw, 33vw" quality={80} className="object-cover" />
            </figure>
          </div>
        </div>
        <div className="lg:col-span-5 lg:ps-6">
          <div data-reveal>
            <p className="t-script text-[26px] sm:text-[30px]">{t.experience.script}</p>
            <h2 className="t-title mt-2 text-[28px] sm:text-[40px]">{t.experience.title}</h2>
          </div>
          <ol className="mt-10 space-y-8">
            {t.experience.items.map((item, i) => (
              <li key={item.title} className="flex gap-5" data-reveal>
                <span className="font-display text-[14px] font-semibold tabular-nums text-gold">0{i + 1}</span>
                <div className="flex-1 border-t border-line pt-3">
                  <h3 className="t-heading text-[17px]">{item.title}</h3>
                  <p className="mt-2 text-[15px]">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
