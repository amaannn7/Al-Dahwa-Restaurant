"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import type { MenuItem } from "@/data/menu";
import { isOrderable } from "@/lib/cart";

/** Adds simple dishes directly; dishes with options open the options dialog. */
export function AddToCartButton({
  item,
  className = "",
  variant = "primary",
  compactOnSmall = false,
}: {
  item: MenuItem;
  className?: string;
  variant?: "primary" | "outline";
  /** Use short labels below 400px where card space is tight. */
  compactOnSmall?: boolean;
}) {
  const { locale, t } = useI18n();
  const { add, openItem } = useCart();
  const orderable = isOrderable(item);
  const needsChoice = !!item.variations || !!item.extras;

  if (!orderable) {
    return <span className={`t-label text-danger ${className}`}>{t.menu.unavailable}</span>;
  }
  return (
    <button
      type="button"
      onClick={() =>
        needsChoice
          ? openItem(item.id)
          : add({ itemId: item.id, variationId: null, extraIds: [], qty: 1 }, t.cart.added(item.name[locale]))
      }
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"} t-action min-h-11 px-4 ${className}`}
      aria-label={`${needsChoice ? t.menu.choose : t.menu.add}: ${item.name[locale]}`}
      data-testid={`add-${item.id}`}
    >
      <Plus className="size-4" aria-hidden />
      {compactOnSmall ? (
        <>
          <span className="max-[399px]:hidden">{needsChoice ? t.menu.choose : t.menu.add}</span>
          <span className="min-[400px]:hidden">{needsChoice ? t.menu.chooseShort : t.menu.addShort}</span>
        </>
      ) : needsChoice ? (
        t.menu.choose
      ) : (
        t.menu.add
      )}
    </button>
  );
}
