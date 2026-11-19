"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";

export function CartIcon({ className = "" }: { className?: string }) {
  const { totals, openDrawer, pulse, hydrated, drawerOpen } = useCart();
  const { t } = useI18n();
  const count = hydrated ? totals.itemCount : 0;
  const [popKey, setPopKey] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restart the badge animation on each add
    if (pulse > 0) setPopKey(pulse);
  }, [pulse]);

  return (
    <button
      type="button"
      onClick={() => openDrawer("cart")}
      aria-label={t.nav.cartWithCount(count)}
      aria-haspopup="dialog"
      aria-expanded={drawerOpen}
      className={`relative grid size-11 place-items-center text-bone transition-colors hover:text-gold ${className}`}
      data-testid="cart-button"
    >
      <ShoppingBag className="size-[22px]" strokeWidth={1.6} aria-hidden />
      <span
        key={popKey}
        aria-hidden
        className={`absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 font-[family-name:var(--font-josefin)] text-[12px] font-bold leading-none text-ink tabular-nums ${
          popKey ? "badge-pop" : ""
        } ${count === 0 ? "opacity-0" : "opacity-100"}`}
        data-testid="cart-count"
      >
        {count}
      </span>
    </button>
  );
}
