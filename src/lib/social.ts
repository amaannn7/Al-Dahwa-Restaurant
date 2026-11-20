import { getWhatsAppNumber, restaurant, type SocialId } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { displayPhone } from "@/lib/links";
import { enquiryMessage, waLink } from "@/lib/whatsapp";

export type ResolvedSocial = { id: SocialId; url: string; handle: string };

/** WhatsApp first (when configured), then the accounts in the config, in order. */
export function socialLinks(locale: Locale): ResolvedSocial[] {
  const out: ResolvedSocial[] = [];
  const wa = getWhatsAppNumber();
  if (wa) out.push({ id: "whatsapp", url: waLink(wa, enquiryMessage(locale)), handle: displayPhone(`+${wa}`) });
  for (const s of restaurant.social) if (s.url) out.push(s);
  return out;
}

/** Public profile URLs for schema.org `sameAs` (not chat or map links). */
export function sameAsUrls(): string[] {
  return restaurant.social.filter((s) => s.id !== "maps").map((s) => s.url);
}
