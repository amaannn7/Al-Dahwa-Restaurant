"use client";

import { ShoppingBag } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { formatSAR } from "@/lib/money";
import { useCart } from "./CartProvider";

/** Sticky bottom bar on phones and tablets once the cart has items. */
export function MobileCartBar() {
  const { locale, t } = useI18n();
  const { totals, hydrated, openDrawer, drawerOpen } = useCart();
  const visible = hydrated && totals.itemCount > 0 && !drawerOpen;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[transform,visibility] duration-300 lg:hidden ${
        visible ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
      inert={!visible}
      aria-hidden={!visible}
    >
      <button type="button" onClick={() => openDrawer("cart")} className="btn btn-primary w-full justify-between px-5" data-testid="mobile-cart-bar">
        <span className="t-action flex items-center gap-2.5">
          <ShoppingBag className="size-[18px]" aria-hidden />
          {t.cart.view} · {t.cart.itemCount(totals.itemCount)}
        </span>
        <span className="font-display text-[16px] font-bold tabular-nums">{formatSAR(totals.totalHalalas, locale)}</span>
      </button>
    </div>
  );
}
