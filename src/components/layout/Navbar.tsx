"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartIcon } from "@/components/cart/CartIcon";
import { useI18n } from "@/components/providers/I18nProvider";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";
import { localePath, type RoutePath } from "@/lib/links";

export const NAV_ITEMS: { path: RoutePath; key: "home" | "menu" | "about" | "contact" }[] = [
  { path: "", key: "home" },
  { path: "/menu", key: "menu" },
  { path: "/about", key: "about" },
  { path: "/contact", key: "contact" },
];

export function isActivePath(pathname: string, locale: string, path: RoutePath) {
  const target = `/${locale}${path}`;
  return path === "" ? pathname === target || pathname === `${target}/` : pathname.startsWith(target);
}

export function Navbar() {
  const { locale, t } = useI18n();
  const pathname = usePathname() || "";
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change and when resizing to desktop.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset menu when the route changes
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const opaque = solid || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="t-action fixed start-3 top-3 z-[80] -translate-y-24 bg-gold px-4 py-3 text-ink focus:translate-y-0"
      >
        {t.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          opaque ? "border-b border-line bg-ink/95 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-black/45 to-transparent"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href={localePath(locale)} className="shrink-0" aria-label={t.nav.home}>
            <Logo locale={locale} priority />
          </Link>

          <nav aria-label={t.nav.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, locale, item.path);
                return (
                  <li key={item.key}>
                    <Link
                      href={localePath(locale, item.path)}
                      aria-current={active ? "page" : undefined}
                      className={`t-action relative inline-flex min-h-11 items-center transition-colors duration-200 hover:text-gold ${
                        active ? "text-gold" : "text-bone"
                      }`}
                    >
                      {t.nav[item.key]}
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 bottom-1.5 h-px bg-gold transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:block">
              <LanguageSwitcher className="text-bone" />
            </span>
            <CartIcon />
            <Link href={localePath(locale, "/menu")} className="btn btn-primary t-action ms-2 hidden min-h-11 lg:inline-flex">
              {t.nav.orderNow}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="t-action ms-1 inline-flex min-h-11 items-center gap-2.5 border border-line-strong px-3 text-bone min-[380px]:px-3.5 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <span
                  className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
              {menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
