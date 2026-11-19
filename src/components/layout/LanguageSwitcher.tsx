"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, otherLocale } from "@/i18n/config";
import { useI18n } from "@/components/providers/I18nProvider";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const target = otherLocale(locale);
  const href = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${target}`);
  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={t.nav.switchLabel}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={`inline-flex min-h-11 items-center px-2 transition-colors hover:text-gold ${
        target === "ar" ? "font-[family-name:var(--font-tajawal)] text-[16px] font-medium" : "font-[family-name:var(--font-josefin)] text-[14px] font-semibold tracking-[0.08em]"
      } ${className}`}
    >
      {t.nav.switchTo}
    </Link>
  );
}
