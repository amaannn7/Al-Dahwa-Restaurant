"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";
import { localePath } from "@/lib/links";
import { useCart } from "./CartProvider";

/** Opens the cart when it has items; otherwise goes to the menu to start an order. */
export function OrderNowButton({ className = "", label }: { className?: string; label?: string }) {
  const { locale, t } = useI18n();
  const { totals, hydrated, openDrawer } = useCart();
  const router = useRouter();
  return (
    <a
      href={localePath(locale, "/menu")}
      onClick={(e) => {
        if (hydrated && totals.itemCount > 0) {
          e.preventDefault();
          openDrawer("cart");
        } else {
          e.preventDefault();
          router.push(localePath(locale, "/menu"));
        }
      }}
      className={className}
    >
      {label ?? t.nav.orderNow}
    </a>
  );
}
