import type { MetadataRoute } from "next";
import { allowIndexing, restaurant } from "@/config/restaurant";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${restaurant.siteUrl}/sitemap.xml`,
    host: restaurant.siteUrl,
  };
}
