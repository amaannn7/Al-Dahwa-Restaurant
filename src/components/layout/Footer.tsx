import Link from "next/link";
import { cacheLife } from "next/cache";
import { restaurant } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Logo, TAGLINE } from "@/components/ui/Logo";
import { displayPhone, formatHoursRange, fullAddress, localePath, telHref, whatsappEnquiryHref } from "@/lib/links";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = await currentYear();
  const wa = whatsappEnquiryHref(locale);
  const links = [
    { href: localePath(locale), label: t.nav.home },
    { href: localePath(locale, "/menu"), label: t.nav.menu },
    { href: localePath(locale, "/catering"), label: t.nav.catering },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-line bg-ink-2 pb-28 pt-16 lg:pb-10">
      <div className="container-x grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
        <div>
          <Link href={localePath(locale)} aria-label={t.nav.home} className="inline-block">
            <Logo locale={locale} size="footer" />
          </Link>
          <p className="t-script mt-4 text-[22px] text-leaf">{TAGLINE[locale]}</p>
          <p className="mt-4 max-w-xs text-[15px]">{t.about.intro}</p>
        </div>

        <nav aria-label={t.footer.explore}>
          <h2 className="t-label text-bone">{t.footer.explore}</h2>
          <ul className="mt-5 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line inline-flex min-h-10 items-center text-[15px]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="t-label text-bone">{t.footer.visit}</h2>
          <address className="mt-5 not-italic text-[15px] leading-relaxed">
            {restaurant.name[locale]}
            <br />
            {fullAddress(locale)}
          </address>
          <h3 className="t-label mt-6 text-bone">{t.location.hours}</h3>
          {restaurant.openingHours ? (
            <ul className="mt-3 text-[15px]">
              {restaurant.openingHours.map((h) => (
                <li key={h.days.en}>
                  {h.days[locale]}: <span className="whitespace-nowrap">{formatHoursRange(h, locale)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[15px]">{t.location.hoursUnknown}</p>
          )}
        </div>

        <div>
          <h2 className="t-label text-bone">{t.footer.contact}</h2>
          <ul className="mt-5 space-y-1 text-[15px]">
            {[restaurant.phone, ...restaurant.altPhones].map((p) => (
              <li key={p}>
                <a href={p === restaurant.phone ? telHref : `tel:${p}`} className="link-line inline-flex min-h-10 items-center">
                  <span dir="ltr">{displayPhone(p)}</span>
                </a>
              </li>
            ))}
            {wa ? (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-10 items-center gap-2">
                  <WhatsAppIcon className="size-4" /> {t.location.whatsapp}
                </a>
              </li>
            ) : null}
          </ul>
          <h3 className="t-label mt-6 text-bone">{t.footer.follow}</h3>
          <SocialLinks locale={locale} className="mt-3" />
        </div>
      </div>

      <div className="container-x mt-14">
        <div className="flex flex-col gap-2 border-t border-line pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {restaurant.name[locale]}. {t.footer.rights}
        </p>
        </div>
      </div>
    </footer>
  );
}
