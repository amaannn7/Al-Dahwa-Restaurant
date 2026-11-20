import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react";
import heroImg from "@/assets/photos/table-tea.jpg";
import { directionsUrl, getWhatsAppNumber, restaurant } from "@/config/restaurant";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata, SEO } from "@/lib/seo";
import { displayPhone, fullAddress, localePath, telHref, whatsappEnquiryHref } from "@/lib/links";
import { PageHero } from "@/components/ui/PageHero";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
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
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const cards = [
    wa
      ? { key: "wa", icon: <WhatsAppIcon className="size-6" />, title: t.contact.whatsappTitle, text: (
          <>
            {t.contact.whatsappText}
            <span className="mt-1 block"><span dir="ltr">{displayPhone(`+${getWhatsAppNumber()}`)}</span></span>
          </>
        ), href: wa, label: t.location.whatsapp, external: true }
      : null,
    { key: "call", icon: <Phone className="size-6" aria-hidden />, title: t.contact.callTitle, text: (
        <>
          {[restaurant.phone, ...restaurant.altPhones].map((p) => (
            <span key={p} className="block"><span dir="ltr">{displayPhone(p)}</span></span>
          ))}
        </>
      ), href: telHref, label: t.location.call, external: false },
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
      </section>
      <section className="bg-ink pt-16 sm:pt-20">
        <div className="container-x">
          <SectionHeading script={t.social.script} title={t.contact.social}>
            <p>{t.social.text}</p>
          </SectionHeading>
          <SocialLinks locale={lang} variant="cards" className="mx-auto mt-10 max-w-6xl" />
          <Link
            href={localePath(lang, "/catering")}
            className="group mx-auto mt-10 flex max-w-6xl flex-col gap-4 border border-gold-line bg-surface p-6 transition-colors duration-300 hover:border-gold sm:flex-row sm:items-center sm:justify-between sm:p-8"
            data-reveal
          >
            <span>
              <span className="t-script block text-[24px]">{t.catering.teaserScript}</span>
              <span className="t-heading mt-1 block text-[19px]">{t.catering.teaserTitle}</span>
              <span className="mt-2 block text-[15px]">{t.catering.formsText}</span>
            </span>
            <span className="btn btn-primary t-action shrink-0">
              {t.catering.planCta}
              <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </div>
      </section>
      <LocationSection locale={lang} />
    </>
  );
}
