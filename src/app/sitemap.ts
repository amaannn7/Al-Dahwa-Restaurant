import type { MetadataRoute } from "next";
import { restaurant } from "@/config/restaurant";

const paths = ["", "/menu", "/catering", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = restaurant.siteUrl;
  return paths.flatMap((p) =>
    (["ar", "en"] as const).map((locale) => ({
      url: `${base}/${locale}${p}`,
      changeFrequency: p === "/menu" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p === "/menu" ? 0.9 : p === "/catering" ? 0.8 : 0.6,
      alternates: { languages: { ar: `${base}/ar${p}`, en: `${base}/en${p}` } },
    })),
  );
}
