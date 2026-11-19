import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import heroImg from "@/assets/photos/table-tea.jpg";
import { directionsUrl, restaurant } from "@/config/restaurant";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata, SEO } from "@/lib/seo";
import { displayPhone, fullAddress, telHref, whatsappEnquiryHref } from "@/lib/links";
import { PageHero } from "@/components/ui/PageHero";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { LocationSection } from "@/components/home/LocationSection";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/contact", SEO[lang].contactTitle, SEO[lang].contact);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const wa = whatsappEnquiryHref(lang);

  const cards = [
    wa
      ? { key: "wa", icon: <WhatsAppIcon className="size-6" />, title: t.contact.whatsappTitle, text: t.contact.whatsappText, href: wa, label: t.location.whatsapp, external: true }
      : null,
    { key: "call", icon: <Phone className="size-6" aria-hidden />, title: t.contact.callTitle, text: <span dir="ltr">{displayPhone(restaurant.phone)}</span>, href: telHref, label: t.location.call, external: false },
    { key: "visit", icon: <MapPin className="size-6" aria-hidden />, title: t.contact.visitTitle, text: fullAddress(lang), href: directionsUrl, label: t.location.directions, external: true },
  ].filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <>
      <PageHero image={heroImg} script={t.contact.script} title={t.contact.title} text={t.contact.text} />
      <section className="bg-ink pb-4 pt-16 sm:pt-20">
        <div className={`container-x grid gap-4 ${cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {cards.map((c) => (
            <a
              key={c.key}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col border border-line bg-surface p-7 transition-colors duration-300 hover:border-gold sm:p-9"
              data-reveal
            >
              <span className="text-gold">{c.icon}</span>
              <span className="t-heading mt-6 text-[19px]">{c.title}</span>
              <span className="mt-2 text-[15px]">{c.text}</span>
              <span className="t-action mt-8 text-gold">
                <span className="link-line pb-1 group-hover:bg-[length:100%_1px]">{c.label}</span>
              </span>
            </a>
          ))}
        </div>
        {restaurant.social.instagram ? (
          <div className="container-x mt-10 flex items-center justify-center gap-4" data-reveal>
            <span className="t-label text-bone">{t.contact.social}</span>
            <a
              href={restaurant.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-line-strong px-4 text-bone transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon /> <span dir="ltr">@aldafwa</span>
            </a>
          </div>
        ) : null}
      </section>
      <LocationSection locale={lang} />
    </>
  );
}
