import { getWhatsAppNumber, restaurant } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { enquiryMessage, waLink } from "@/lib/whatsapp";

export type RoutePath = "" | "/menu" | "/catering" | "/about" | "/contact";

export const localePath = (locale: Locale, path: RoutePath | string = "") => `/${locale}${path}`;

export const telHref = `tel:${restaurant.phone}`;

/** "+966 11 479 1868" style for display. */
export function displayPhone(e164: string): string {
  const m = e164.match(/^\+966(\d{2})(\d{3})(\d{4})$/);
  if (m) return `+966 ${m[1]} ${m[2]} ${m[3]}`;
  const mobile = e164.match(/^\+966(5\d)(\d{3})(\d{4})$/);
  if (mobile) return `+966 ${mobile[1]} ${mobile[2]} ${mobile[3]}`;
  return e164;
}

/** General enquiry link, or null when no WhatsApp number is configured. */
export function whatsappEnquiryHref(locale: Locale): string | null {
  const number = getWhatsAppNumber();
  return number ? waLink(number, enquiryMessage(locale)) : null;
}

export function fullAddress(locale: Locale): string {
  const a = restaurant.address;
  return locale === "ar"
    ? `${a.street.ar}، ${a.district.ar}، ${a.city.ar} ${a.postalCode}`
    : `${a.street.en}, ${a.district.en}, ${a.city.en} ${a.postalCode}`;
}

/** "12:00 PM – 2:00 AM" / "12:00 م – 2:00 ص" from "12:00" and "02:00". */
export function formatHoursRange(h: { opens: string; closes: string }, locale: Locale): string {
  const fmt = (hhmm: string) => {
    const [hStr, m] = hhmm.split(":");
    const hNum = Number(hStr);
    const h12 = hNum % 12 === 0 ? 12 : hNum % 12;
    const am = hNum < 12;
    return locale === "ar" ? `${h12}:${m} ${am ? "ص" : "م"}` : `${h12}:${m} ${am ? "AM" : "PM"}`;
  };
  return `${fmt(h.opens)} – ${fmt(h.closes)}`;
}
