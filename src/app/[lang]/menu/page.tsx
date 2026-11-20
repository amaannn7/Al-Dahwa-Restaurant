import type { Metadata } from "next";
import { notFound } from "next/navigation";
import heroImg from "@/assets/photos/arabic-feast.jpg";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { menuItems, visibleCategories } from "@/data/menu";
import { restaurant } from "@/config/restaurant";
import { JsonLd, pageMetadata, SEO } from "@/lib/seo";
import { localePath, whatsappEnquiryHref } from "@/lib/links";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { MENU_IS_PLACEHOLDER } from "@/data/menu";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/menu", SEO[lang].menuTitle, SEO[lang].menu);
}

export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const wa = whatsappEnquiryHref(lang);

  // Menu structured data is only published once real prices are in place.
  const menuLd = MENU_IS_PLACEHOLDER
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Menu",
        name: `${restaurant.name[lang]} ${t.nav.menu}`,
        url: `${restaurant.siteUrl}${localePath(lang, "/menu")}`,
        hasMenuSection: visibleCategories.map((c) => ({
          "@type": "MenuSection",
          name: c.name[lang],
          hasMenuItem: menuItems
            .filter((i) => i.category === c.id)
            .map((i) => ({
              "@type": "MenuItem",
              name: i.name[lang],
              description: i.description[lang],
              offers: { "@type": "Offer", price: i.variations?.options[0]?.price ?? i.price, priceCurrency: "SAR" },
              ...(i.calories ? { nutrition: { "@type": "NutritionInformation", calories: `${i.calories} calories` } } : {}),
            })),
        })),
      };

  return (
    <>
      {menuLd ? <JsonLd data={menuLd} /> : null}
      <PageHero image={heroImg} script={t.menu.script} title={t.menu.title} text={t.menu.text} />
      <div className="container-x">
        <PlaceholderNotice text={t.menu.placeholder} className="mx-auto mb-10 max-w-3xl" />
        <p className="pt-10 text-center text-[14px] text-muted">{t.menu.vat}</p>
      </div>
      <MenuBrowser />
      {wa ? (
        <section className="border-t border-line bg-surface py-14">
          <div className="container-x flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-start">
            <div>
              <p className="t-script text-[26px]">{t.menu.enquiry}</p>
            </div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline t-action">
              <WhatsAppIcon className="size-5" />
              {t.menu.enquiryCta}
            </a>
          </div>
        </section>
      ) : null}
    </>
  );
}
