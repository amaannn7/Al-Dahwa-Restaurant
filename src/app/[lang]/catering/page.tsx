import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Flame, GlassWater, Salad, Soup } from "lucide-react";
import heroImg from "@/assets/photos/majlis-feast.jpg";
import mezze from "@/assets/photos/mezze-tray.jpg";
import grillTray from "@/assets/photos/grill-tray-tea.jpg";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata, SEO } from "@/lib/seo";
import { localePath } from "@/lib/links";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CateringRequests } from "@/components/catering/CateringRequests";

export async function generateMetadata({ params }: PageProps<"/[lang]/catering">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/catering", SEO[lang].cateringTitle, SEO[lang].catering);
}

const HIGHLIGHT_ICONS = [Flame, Soup, Salad, GlassWater];

export default async function CateringPage({ params }: PageProps<"/[lang]/catering">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const c = t.catering;

  return (
    <>
      <section className="relative isolate flex min-h-[600px] items-end overflow-hidden pb-16 pt-[calc(var(--header-h)+56px)] sm:min-h-[660px] sm:items-center sm:pb-0">
        <Image src={heroImg} alt="" fill preload sizes="100vw" quality={85} placeholder="blur" className="-z-20 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/60" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="container-x text-center">
          <p className="t-script on-photo text-[30px] sm:text-[38px]">{c.script}</p>
          <h1 className="t-title on-photo mx-auto mt-2 max-w-3xl text-[34px] leading-tight sm:text-[56px]">{c.title}</h1>
          <p className="on-photo mx-auto mt-6 max-w-2xl text-[16px] text-bone/90 sm:text-[18px]">{c.heroText}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#inquiry" className="btn btn-primary t-action w-full max-w-xs sm:w-auto">
              {c.planCta}
            </a>
            <a href="#meeting" className="btn btn-outline t-action on-photo w-full max-w-xs sm:w-auto">
              <CalendarDays className="size-[18px]" aria-hidden />
              {c.meetCta}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <SectionHeading script={c.introScript} title={c.introTitle} align="start">
              <p>{c.introText}</p>
            </SectionHeading>
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {c.highlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                return (
                  <li key={h.title} className="flex gap-4" data-reveal>
                    <span className="grid size-11 shrink-0 place-items-center border border-gold-line text-gold">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <span className="t-heading block text-[16px]">{h.title}</span>
                      <span className="mt-1.5 block text-[15px]">{h.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link href={localePath(lang, "/menu")} className="btn btn-outline t-action mt-10" data-reveal>
              {t.categories.viewAll}
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] pb-12 pe-10 sm:pb-16 sm:pe-16" data-reveal>
            <div aria-hidden className="absolute bottom-0 end-0 top-12 start-12 border border-gold-line" />
            <figure className="relative aspect-[4/5] overflow-hidden">
              <Image src={mezze} alt="" fill sizes="(min-width: 1024px) 34vw, 80vw" quality={85} placeholder="blur" className="object-cover" />
            </figure>
            <figure className="absolute bottom-0 end-0 aspect-square w-[46%] overflow-hidden border-[6px] border-ink shadow-2xl">
              <Image src={grillTray} alt="" fill sizes="(min-width: 1024px) 16vw, 40vw" quality={80} className="object-cover" />
            </figure>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading script={c.stepsScript} title={c.stepsTitle} />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <span aria-hidden className="absolute inset-x-[16%] top-8 hidden h-px bg-gold-line md:block" />
            {c.steps.map((s, i) => (
              <li key={s.title} className="relative text-center" data-reveal>
                <span className="relative mx-auto grid size-16 place-items-center rounded-full border border-gold bg-surface font-display text-[22px] font-bold text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="t-heading mt-6 text-[18px]">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[15px]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative bg-ink py-20 sm:py-28">
        <span id="inquiry" aria-hidden className="absolute top-0" />
        <span id="meeting" aria-hidden className="absolute top-0" />
        <div className="container-x">
          <SectionHeading script={c.formsScript} title={c.formsTitle}>
            <p>{c.formsText}</p>
          </SectionHeading>
          <div className="mt-12" data-reveal>
            <CateringRequests />
          </div>
        </div>
      </section>
    </>
  );
}
