"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { DishTile } from "@/components/menu/DishTile";
import type { PricedLine } from "@/lib/cart";
import { formatSAR } from "@/lib/money";
import { useCart } from "./CartProvider";

export function optionLabels(line: PricedLine, locale: "ar" | "en"): string[] {
  const labels: string[] = [];
  if (line.variationId) {
    const v = line.item.variations?.options.find((o) => o.id === line.variationId);
    if (v) labels.push(v.name[locale]);
  }
  for (const id of line.extraIds) {
    const e = line.item.extras?.options.find((o) => o.id === id);
    if (e) labels.push(e.name[locale]);
  }
  return labels;
}

export function CartItem({ line }: { line: PricedLine }) {
  const { locale, t } = useI18n();
  const { setQty, remove } = useCart();
  const name = line.item.name[locale];
  const options = optionLabels(line, locale);

  return (
    <li className="flex gap-4 py-5" data-testid="cart-line">
      <div className="relative size-20 shrink-0 overflow-hidden bg-surface-2">
        {line.item.image ? (
          <Image src={line.item.image} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <DishTile name="" compact />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="t-heading text-[15px]">{name}</p>
            {options.length ? <p className="t-meta mt-1">{options.join(locale === "ar" ? "، " : ", ")}</p> : null}
            <p className="t-meta mt-1 tabular-nums">
              {formatSAR(line.unitHalalas, locale)} {line.qty > 1 ? t.cart.each : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={t.cart.removeItem(name)}
            className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center text-muted transition-colors hover:text-danger"
          >
            <Trash2 className="size-[18px]" aria-hidden />
          </button>
        </div>
        {line.orderable ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <QuantityStepper size="sm" value={line.qty} min={1} onChange={(q) => setQty(line.key, q)} label={name} />
            <p className="font-display text-[16px] font-semibold text-bone tabular-nums" data-testid="line-subtotal">
              {formatSAR(line.subtotalHalalas, locale)}
            </p>
          </div>
        ) : (
          <p className="t-meta mt-3 text-danger">{t.cart.unavailableLine}</p>
        )}
      </div>
    </li>
  );
}
