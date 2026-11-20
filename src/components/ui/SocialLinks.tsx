import { ArrowUpLeft, ArrowUpRight, MapPin } from "lucide-react";
import type { SocialId } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { socialLinks } from "@/lib/social";
import { InstagramIcon, LinktreeIcon, TikTokIcon, WhatsAppIcon } from "./BrandIcons";

export function SocialIcon({ id, className = "size-5" }: { id: SocialId; className?: string }) {
  switch (id) {
    case "whatsapp":
      return <WhatsAppIcon className={className} />;
    case "tiktok":
      return <TikTokIcon className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "linktree":
      return <LinktreeIcon className={className} />;
    case "maps":
      return <MapPin className={className} aria-hidden />;
  }
}

/**
 * The restaurant's social accounts and links (from the official Linktree).
 * "icons": compact square buttons (footer, mobile menu).
 * "cards": labelled buttons with the handle (contact page, home band).
 */
export function SocialLinks({
  locale,
  variant = "icons",
  className = "",
}: {
  locale: Locale;
  variant?: "icons" | "cards";
  className?: string;
}) {
  const t = getDictionary(locale);
  const links = socialLinks(locale);
  if (links.length === 0) return null;
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;

  if (variant === "icons") {
    return (
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        {links.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.social.labels[s.id]}: ${s.handle} (${t.social.newTab})`}
              title={t.social.labels[s.id]}
              className="inline-grid size-11 place-items-center border border-line-strong text-bone transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink"
            >
              <SocialIcon id={s.id} />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${links.length >= 4 ? "xl:grid-cols-4" : links.length === 3 ? "lg:grid-cols-3" : ""} ${className}`}>
      {links.map((s) => (
        <li key={s.id} data-reveal>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[84px] items-center gap-4 border border-line bg-surface p-4 transition-[border-color,background-color] duration-300 hover:border-gold hover:bg-surface-2 sm:p-5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold-line text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <SocialIcon id={s.id} className="size-[22px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="t-heading block text-[16px]">{t.social.labels[s.id]}</span>
              <span className="mt-0.5 block break-all text-[14px]">
                <span dir="ltr">{s.handle}</span>
              </span>
            </span>
            <Arrow className="size-4 shrink-0 text-muted transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" aria-hidden />
            <span className="sr-only">({t.social.newTab})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
