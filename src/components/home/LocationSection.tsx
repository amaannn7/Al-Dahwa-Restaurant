import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { directionsUrl, mapEmbedUrl, restaurant } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { displayPhone, formatHoursRange, fullAddress, telHref, whatsappEnquiryHref } from "@/lib/links";

export function LocationSection({ locale, headingAs = "h2", showHeading = true }: { locale: Locale; headingAs?: "h2" | "h1"; showHeading?: boolean }) {
  const t = getDictionary(locale);
  const wa = whatsappEnquiryHref(locale);
  return (
    <section className="bg-ink py-20 sm:py-28" id="location">
      <div className="container-x">
        {showHeading ? <SectionHeading script={t.location.script} title={t.location.title} as={headingAs} /> : null}
        <div className={`grid overflow-hidden border border-line lg:grid-cols-[1.35fr_1fr] ${showHeading ? "mt-14" : ""}`} data-reveal>
          <div className="relative min-h-[320px] bg-surface-2 sm:min-h-[420px]">
            <iframe
              title={t.location.mapTitle}
              src={`${mapEmbedUrl}&hl=${locale}`}
              className="absolute inset-0 size-full border-0 [filter:grayscale(0.35)_contrast(1.05)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="bg-surface p-7 sm:p-10">
            <ul className="space-y-7">
              <li className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h3 className="t-label text-bone">{t.location.address}</h3>
                  <address className="mt-2 not-italic text-[15px] leading-relaxed">
                    {restaurant.name[locale]}
                    <br />
                    {fullAddress(locale)}
                  </address>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h3 className="t-label text-bone">{t.location.phone}</h3>
                  <a href={telHref} className="link-line mt-2 inline-block text-[15px]">
                    <span dir="ltr">{displayPhone(restaurant.phone)}</span>
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h3 className="t-label text-bone">{t.location.hours}</h3>
                  {restaurant.openingHours ? (
                    <ul className="mt-2 text-[15px]">
                      {restaurant.openingHours.map((h) => (
                        <li key={h.days.en}>
                          {h.days[locale]}: <span className="whitespace-nowrap">{formatHoursRange(h, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-[15px]">{t.location.hoursUnknown}</p>
                  )}
                </div>
              </li>
            </ul>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary t-action sm:col-span-2">
                <Navigation className="size-4" aria-hidden />
                {t.location.directions}
              </a>
              <a href={telHref} className="btn btn-outline t-action">
                <Phone className="size-4" aria-hidden />
                {t.location.call}
              </a>
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline t-action">
                  <WhatsAppIcon className="size-4" />
                  {t.location.whatsapp}
                </a>
              ) : (
                <a href={restaurant.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline t-action">
                  <MapPin className="size-4" aria-hidden />
                  <span className="truncate">{t.location.openMaps}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
