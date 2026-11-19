import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import heroImg from "@/assets/photos/grill-flames.jpg";
import grill from "@/assets/photos/mixed-grill.jpg";
import mahashi from "@/assets/photos/mahashi-pot.jpg";
import juice from "@/assets/photos/juice-dark.jpg";
import tableSpread from "@/assets/photos/table-spread.jpg";
import logoFull from "@/assets/brand/logo-full.png";
import { TAGLINE } from "@/components/ui/Logo";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { visibleCategories } from "@/data/menu";
import { pageMetadata, SEO } from "@/lib/seo";
import { localePath } from "@/lib/links";
import { PageHero } from "@/components/ui/PageHero";
import { LocationSection } from "@/components/home/LocationSection";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/about", SEO[lang].aboutTitle, SEO[lang].about);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const ar = lang === "ar";

  return (
    <>
      <PageHero image={heroImg} script={t.about.script} title={t.about.title} />

      <section className="bg-ink py-20 sm:py-24">
        <div className="container-x max-w-4xl text-center" data-reveal>
          <Image
            src={logoFull}
            alt={`${ar ? "مطاعم الدفواء" : "Al-Dafwa Restaurant"}: ${TAGLINE.ar}`}
            sizes="(min-width: 640px) 420px, 80vw"
            quality={90}
            className="mx-auto h-auto w-[78%] max-w-[420px]"
          />
          {ar ? null : <p className="t-script mt-4 text-[26px]">{TAGLINE.en}</p>}
          <p className="mt-10 font-display text-[24px] font-light leading-snug text-bone sm:text-[34px]">{t.about.intro}</p>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            <figure className="relative col-span-3 overflow-hidden" data-reveal>
              <Image src={grill} alt={ar ? "مشاوي مشكلة" : "Mixed grill"} fill sizes="(min-width: 1024px) 28vw, 60vw" quality={85} placeholder="blur" className="object-cover" />
            </figure>
            <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
              <figure className="relative aspect-square overflow-hidden" data-reveal>
                <Image src={mahashi} alt={ar ? "محاشي" : "Mahashi"} fill sizes="(min-width: 1024px) 18vw, 40vw" quality={80} className="object-cover" />
              </figure>
              <figure className="relative aspect-square overflow-hidden" data-reveal>
                <Image src={juice} alt={ar ? "عصير برتقال طازج" : "Fresh orange juice"} fill sizes="(min-width: 1024px) 18vw, 40vw" quality={80} className="object-cover" />
              </figure>
            </div>
          </div>
          <div>
            <div data-reveal>
              <p className="t-script text-[26px] sm:text-[30px]">{t.about.foodScript}</p>
              <h2 className="t-title mt-2 text-[28px] sm:text-[38px]">{t.about.foodTitle}</h2>
              <p className="mt-6 text-[16px] sm:text-[17px]">{t.about.foodText}</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
              {visibleCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`${localePath(lang, "/menu")}#${c.id}`}
                    className="t-label inline-flex min-h-10 items-center border border-line-strong px-3.5 text-bone transition-colors hover:border-gold hover:text-gold"
                  >
                    {c.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <figure className="relative aspect-[4/3] overflow-hidden" data-reveal>
              <Image src={tableSpread} alt={ar ? "أطباق متنوعة على المائدة" : "Dishes shared at the table"} fill sizes="(min-width: 1024px) 45vw, 100vw" quality={85} className="object-cover" />
            </figure>
          </div>
          <div data-reveal>
            <p className="t-script text-[26px] sm:text-[30px]">{t.about.visitScript}</p>
            <h2 className="t-title mt-2 text-[28px] sm:text-[38px]">{t.about.visitTitle}</h2>
            <p className="mt-6 text-[16px] sm:text-[17px]">{t.about.visitText}</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {t.experience.items.map((item) => (
                <li key={item.title} className="flex items-baseline justify-between gap-6 py-4">
                  <span className="t-heading text-[15px]">{item.title}</span>
                  <span className="text-end text-[14px]">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link href={localePath(lang, "/menu")} className="btn btn-primary t-action mt-9">
              {t.about.cta}
            </Link>
          </div>
        </div>
      </section>

      <LocationSection locale={lang} />
    </>
  );
}
