import type { Metadata } from "next";
import { allowIndexing, restaurant } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { localePath, type RoutePath } from "@/lib/links";
import { sameAsUrls } from "@/lib/social";

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Al-Dafwa Restaurant, Omar Bin Abdulaziz Road, Al Malaz, Riyadh",
};

export function pageMetadata(locale: Locale, path: RoutePath, title: string, description: string): Metadata {
  const url = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ar: localePath("ar", path), en: localePath("en", path), "x-default": localePath("ar", path) },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: restaurant.name[locale],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const SEO = {
  en: {
    siteTitle: "Al-Dafwa Restaurant | Grills, Shawarma & Broasted in Al Malaz, Riyadh",
    home: "Lebanese and Arabic restaurant on Omar Bin Abdulaziz Road, Al Malaz, Riyadh. Browse grills, shawarma and broasted chicken, then order on WhatsApp.",
    menuTitle: "Menu | Al-Dafwa Restaurant, Riyadh",
    menu: "The full Al-Dafwa menu with prices: grills, shawarma, broasted, seafood, mahashi, mezze, pies, breakfast, juices and desserts. Order on WhatsApp.",
    aboutTitle: "About | Al-Dafwa Restaurant, Al Malaz",
    about: "Al-Dafwa Restaurant: Lebanese and Arabic food on Omar Bin Abdulaziz Road in Al Malaz, Riyadh, with a heritage of authentic taste since 1990.",
    cateringTitle: "Catering & Bulk Orders | Al-Dafwa Restaurant, Riyadh",
    catering: "Plan catering or a large order with Al-Dafwa Restaurant in Riyadh: grills, mahashi, mezze and juice by the gallon. Send an inquiry or book a meeting on WhatsApp.",
    contactTitle: "Contact & Location | Al-Dafwa Restaurant, Riyadh",
    contact: "Find Al-Dafwa Restaurant on Omar Bin Abdulaziz Road, Al Malaz, Riyadh. Get directions, call or message us.",
  },
  ar: {
    siteTitle: "مطاعم الدفواء | مشويات وشاورما وبروستد في الملز، الرياض",
    home: "مطعم لبناني عربي على طريق عمر بن عبدالعزيز في حي الملز بالرياض. تصفح قائمة المشويات والشاورما والبروستد واطلب عبر واتساب.",
    menuTitle: "القائمة | مطاعم الدفواء، الرياض",
    menu: "قائمة مطاعم الدفواء كاملة بالأسعار: مشويات وشاورما وبروستد ومأكولات بحرية ومحاشي ومقبلات وفطائر وفطور وعصائر وحلويات. اطلب عبر واتساب.",
    aboutTitle: "من نحن | مطاعم الدفواء، الملز",
    about: "مطاعم الدفواء: مأكولات لبنانية وعربية على طريق عمر بن عبدالعزيز في حي الملز بالرياض، عراقة الطعم الأصيل منذ 1990.",
    cateringTitle: "الولائم والطلبات الكبيرة | مطاعم الدفواء، الرياض",
    catering: "خطط لوليمتك أو طلبك الكبير مع مطاعم الدفواء في الرياض: مشويات ومحاشي ومقبلات وعصير بالجالون. أرسل استفساراً أو احجز موعداً عبر واتساب.",
    contactTitle: "تواصل معنا والموقع | مطاعم الدفواء، الرياض",
    contact: "موقع مطاعم الدفواء على طريق عمر بن عبدالعزيز، الملز، الرياض. احصل على الاتجاهات أو اتصل بنا أو راسلنا.",
  },
} as const;

/** schema.org Restaurant. Only verified facts; no hours or ratings until confirmed. */
export function restaurantJsonLd(locale: Locale) {
  const a = restaurant.address;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${restaurant.siteUrl}/#restaurant`,
    name: restaurant.name[locale],
    alternateName: restaurant.name[locale === "ar" ? "en" : "ar"],
    url: `${restaurant.siteUrl}${localePath(locale)}`,
    menu: `${restaurant.siteUrl}${localePath(locale, "/menu")}`,
    telephone: restaurant.phone,
    servesCuisine: locale === "ar" ? ["لبناني", "عربي"] : ["Lebanese", "Arabic"],
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street[locale],
      addressLocality: a.city[locale],
      addressRegion: a.district[locale],
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: restaurant.geo.lat, longitude: restaurant.geo.lng },
    hasMap: restaurant.googleMapsUrl,
    currenciesAccepted: restaurant.currency,
    sameAs: sameAsUrls(),
  };
  data.foundingDate = String(restaurant.since);
  if (restaurant.openingHours) {
    data.openingHoursSpecification = restaurant.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    }));
  }
  return data;
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
