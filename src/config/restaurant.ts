/**
 * Central restaurant configuration.
 *
 * Every business fact the website shows comes from this file. Values marked
 * NEEDS CONFIRMATION were collected from public listings (see
 * docs/01-research-and-plan.md) and must be confirmed by the restaurant
 * before launch. Values set to `null` are unknown and are hidden on the site.
 */

export const restaurant = {
  name: { en: "Al-Dafwa Restaurant", ar: "مطاعم الدفواء" },
  shortName: { en: "Al-Dafwa", ar: "الدفواء" },

  // Cuisine labels as listed publicly (ksarestaurant.com: "Arabic";
  // top-rated.online: "Middle eastern restaurant").
  cuisine: { en: "Arabic and Middle Eastern", ar: "عربي وشرق أوسطي" },

  address: {
    street: { en: "Omar Bin Abdulaziz Road", ar: "طريق عمر بن عبدالعزيز" },
    district: { en: "Al Malaz", ar: "الملز" },
    city: { en: "Riyadh", ar: "الرياض" },
    postalCode: "12831",
    country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    countryCode: "SA",
  },

  // Supplied by the client (Google Maps place for Al-Dafwa Restaurant).
  geo: { lat: 24.6799277, lng: 46.7336186 },
  googleMapsUrl:
    "https://www.google.com/maps/place/Al-Dafwa+Restaurant/@24.6799277,46.7336186,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2f040e068ed6b9:0xa1712648081c1b1d!8m2!3d24.6799277!4d46.7336186",

  // Confirmed by the client (19 Nov 2026); also the number on Google Maps.
  phone: "+966114787671",

  // NEEDS CONFIRMATION: the restaurant's WhatsApp number in international
  // format, digits only (e.g. "9665XXXXXXXX"). Not published anywhere we
  // could verify. Can also be set with NEXT_PUBLIC_WHATSAPP_NUMBER.
  // While empty, WhatsApp ordering and WhatsApp buttons are switched off.
  whatsapp: "",

  // From the Google Maps listing (19 Nov 2026: "Open, closes 2 AM"; Thursday
  // 12 PM to 2 AM) and its daily 12 PM to 2 AM schedule as mirrored on
  // top-rated.online. NEEDS CONFIRMATION for Friday and holidays.
  // Set to null to hide hours everywhere.
  openingHours: [
    { days: { en: "Daily", ar: "يومياً" }, opens: "12:00", closes: "02:00", schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  ] as
    | { days: { en: string; ar: string }; opens: string; closes: string; schemaDays: string[] }[]
    | null,

  // Brand line from the official logo.
  since: 1990,

  // NEEDS CONFIRMATION: listed as the website on three directories.
  social: {
    instagram: "https://instagram.com/aldafwa",
  } as Record<string, string>,

  /**
   * Order types offered in WhatsApp checkout.
   * "pickup": takeout is listed on Yandex Maps.
   * "delivery": NEEDS CONFIRMATION that the restaurant delivers WhatsApp
   * orders itself; add "delivery" here once confirmed.
   */
  orderTypes: ["pickup"] as OrderType[],

  /**
   * Extra charges added at checkout. Leave empty unless the restaurant
   * confirms them. Example: { id: "delivery", label: {...}, amount: 10, appliesTo: ["delivery"] }
   */
  charges: [] as Charge[],

  currency: "SAR",

  // Production domain, used for canonical URLs, sitemap and Open Graph.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aldafwa.example",
} as const;

export type OrderType = "pickup" | "delivery";

export type Charge = {
  id: string;
  label: { en: string; ar: string };
  amount: number;
  appliesTo: OrderType[];
};

/** Digits-only WhatsApp number, or "" when none is configured. */
export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || restaurant.whatsapp;
  const digits = String(raw).replace(/\D/g, "");
  // International numbers are 8 to 15 digits (E.164) and never start with 0.
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) return "";
  return digits;
}

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.geo.lat},${restaurant.geo.lng}`;

export const mapEmbedUrl = `https://maps.google.com/maps?q=${restaurant.geo.lat},${restaurant.geo.lng}&z=17&output=embed`;

/** Whether the site may be indexed (keep false on staging). */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
