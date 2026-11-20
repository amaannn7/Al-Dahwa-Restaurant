import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { pageMetadata, SEO } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { RestaurantIntroduction } from "@/components/home/RestaurantIntroduction";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { MenuCategories } from "@/components/home/MenuCategories";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { OrderCta } from "@/components/home/OrderCta";
import { CateringTeaser } from "@/components/home/CateringTeaser";
import { SocialSection } from "@/components/home/SocialSection";
import { LocationSection } from "@/components/home/LocationSection";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "", SEO[lang].siteTitle, SEO[lang].home);
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <HeroSection locale={lang} />
      <RestaurantIntroduction locale={lang} />
      <FeaturedDishes />
      <MenuCategories locale={lang} />
      <ExperienceSection locale={lang} />
      <CateringTeaser locale={lang} />
      <OrderCta locale={lang} />
      <SocialSection locale={lang} />
      <LocationSection locale={lang} />
    </>
  );
}
