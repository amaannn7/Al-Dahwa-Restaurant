"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useDialog } from "@/components/ui/useDialog";
import { displayPhone, fullAddress, localePath, telHref, whatsappEnquiryHref } from "@/lib/links";
import { restaurant } from "@/config/restaurant";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { isActivePath, NAV_ITEMS } from "./Navbar";

export function MobileNavigation({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const { locale, t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(open, onClose, panelRef);
  const wa = whatsappEnquiryHref(locale);

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${open ? "visible" : "invisible"}`}
      inert={!open}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={t.nav.closeMenu}
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.mainNav}
        className={`absolute inset-x-3 top-[calc(var(--header-h)+8px)] max-h-[calc(100dvh-var(--header-h)-20px)] overflow-y-auto border border-line bg-surface p-6 shadow-2xl transition-[opacity,transform] duration-300 ease-[var(--ease-out)] ${
          open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <nav>
          <ul className="divide-y divide-line">
            {NAV_ITEMS.map((item, i) => {
              const active = isActivePath(pathname, locale, item.path);
              return (
                <li
                  key={item.key}
                  className="transition-[opacity,transform] duration-500"
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(6px)" }}
                >
                  <Link
                    href={localePath(locale, item.path)}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`t-heading flex min-h-14 items-center justify-between text-[20px] ${active ? "text-gold" : "text-bone"}`}
                  >
                    {t.nav[item.key]}
                    {active ? <span className="size-1.5 rounded-full bg-gold" aria-hidden /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href={localePath(locale, "/menu")} onClick={onClose} className="btn btn-primary t-action mt-6 w-full">
          {t.nav.orderNow}
        </Link>

        <div className={`mt-3 grid gap-3 ${wa ? "grid-cols-2" : "grid-cols-1"}`}>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline t-action px-3">
              <WhatsAppIcon className="size-[18px]" />
              {t.location.whatsapp}
            </a>
          ) : null}
          <a href={telHref} className="btn btn-outline t-action px-3">
            <Phone className="size-[18px]" aria-hidden />
            {t.location.call}
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5 text-[14px]">
          <div>
            <p className="text-bone">{restaurant.name[locale]}</p>
            <p>{fullAddress(locale)}</p>
            <p>
              <span dir="ltr">{displayPhone(restaurant.phone)}</span>
            </p>
          </div>
          <LanguageSwitcher className="border border-line-strong px-4 text-bone" />
        </div>
      </div>
    </div>
  );
}
