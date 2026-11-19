"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { formatSAR } from "@/lib/money";
import { useCart } from "./CartProvider";

export function CartSummary() {
  const { locale, t } = useI18n();
  const { totals } = useCart();
  return (
    <dl className="space-y-2 text-[15px]">
      <div className="flex justify-between">
        <dt>{t.cart.subtotal}</dt>
        <dd className="tabular-nums text-bone" data-testid="cart-subtotal">{formatSAR(totals.subtotalHalalas, locale)}</dd>
      </div>
      {totals.charges.map((c) => (
        <div key={c.charge.id} className="flex justify-between">
          <dt>{c.charge.label[locale]}</dt>
          <dd className="tabular-nums text-bone">{formatSAR(c.halalas, locale)}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="t-label text-bone">{t.cart.total}</dt>
        <dd className="font-display text-[22px] font-bold text-gold tabular-nums" data-testid="cart-total">
          {formatSAR(totals.totalHalalas, locale)}
        </dd>
      </div>
    </dl>
  );
}
