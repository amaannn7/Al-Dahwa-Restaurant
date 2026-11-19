import Image from "next/image";
import Link from "next/link";
import heroImg from "@/assets/photos/hero-grill.jpg";
import { OrderNowButton } from "@/components/cart/OrderNowButton";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/links";
import { HeroEmbers } from "./HeroEmbers";
import { HeroIntro } from "./HeroIntro";

export function HeroSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)] [@media(min-height:1000px)]:min-h-[900px]">
      <Image
        src={heroImg}
        alt={locale === "ar" ? "لحم يُشوى على الجمر واللهب" : "Meat grilling over open flame"}
        fill
        preload
        quality={85}
        sizes="100vw"
        placeholder="blur"
        className="-z-30 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-20 bg-black/45" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.35),transparent_70%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-t from-ink to-transparent" />
      <div className="absolute inset-0 -z-10">
        <HeroEmbers />
      </div>

      <HeroIntro className="container-x py-20 text-center">
        <p className="t-script on-photo mx-auto max-w-[19rem] text-[24px] sm:max-w-none sm:text-[34px]" data-hero-fade>
          {t.hero.script}
        </p>
        <h1 className="t-display on-photo mx-auto mt-4 max-w-4xl text-[36px] min-[380px]:text-[44px] sm:text-[68px] lg:text-[84px]" data-hero-rise>
          <span className="block">{t.hero.title[0]}</span>
          <span className="block">{t.hero.title[1]}</span>
        </h1>
        <p className="on-photo mx-auto mt-6 max-w-xl text-[16px] text-bone/90 sm:text-[18px]" data-hero-fade>
          {t.hero.text}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" data-hero-fade>
          <Link href={localePath(locale, "/menu")} className="btn btn-primary t-action w-full max-w-xs sm:w-auto">
            {t.hero.explore}
          </Link>
          <OrderNowButton className="btn btn-outline t-action w-full max-w-xs border-bone/40 bg-black/20 backdrop-blur-sm sm:w-auto" label={t.hero.order} />
        </div>
      </HeroIntro>
    </section>
  );
}
