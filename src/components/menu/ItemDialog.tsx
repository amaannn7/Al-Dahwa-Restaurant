"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useDialog } from "@/components/ui/useDialog";
import { getMenuItem, type MenuItem } from "@/data/menu";
import { clampQty, defaultVariationId, isOrderable, unitPriceHalalas } from "@/lib/cart";
import { formatSAR, formatSARFromNumber } from "@/lib/money";
import { DishTile } from "./DishTile";

/** Product details: choose a variation, extras and quantity, then add. */
export function ItemDialog() {
  const { dialogItemId, closeItem } = useCart();
  const item = dialogItemId ? getMenuItem(dialogItemId) : undefined;
  // Remount per item so selections reset.
  return item ? <ItemDialogInner key={item.id} item={item} onClose={closeItem} /> : null;
}

function ItemDialogInner({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { locale, t } = useI18n();
  const { add } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef);

  const [variationId, setVariationId] = useState<string | null>(defaultVariationId(item));
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const unit = useMemo(() => unitPriceHalalas(item, variationId, extraIds), [item, variationId, extraIds]);
  const orderable = isOrderable(item) && unit !== null;
  const total = unit !== null ? unit * qty : 0;
  const titleId = `dialog-title-${item.id}`;

  const submit = () => {
    if (!orderable) return;
    add({ itemId: item.id, variationId, extraIds, qty: clampQty(qty) }, t.cart.added(item.name[locale]));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" tabIndex={-1} aria-label={t.item.close} className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden border border-line bg-surface shadow-2xl sm:flex-row"
        style={{ animation: "dialog-in 380ms var(--ease-out)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.item.close}
          className="absolute end-3 top-3 z-10 grid size-11 place-items-center bg-ink/70 text-bone backdrop-blur transition-colors hover:text-gold"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-[44%]">
          {item.image ? (
            <Image src={item.image} alt={item.name[locale]} fill sizes="(min-width: 640px) 340px, 100vw" quality={85} className="object-cover" />
          ) : (
            <DishTile name={item.name[locale]} />
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-6 sm:px-7 sm:pt-8">
            <h2 id={titleId} className="t-heading pe-10 text-[22px]">
              {item.name[locale]}
            </h2>
            <p className="mt-3 text-[15px]">{item.description[locale]}</p>

            {item.variations ? (
              <fieldset className="mt-6">
                <legend className="t-label flex w-full items-center justify-between text-bone">
                  {item.variations.label[locale]}
                  <span className="t-meta normal-case tracking-normal text-gold">{t.item.required}</span>
                </legend>
                <div className="mt-3 grid gap-2">
                  {item.variations.options.map((o) => (
                    <label
                      key={o.id}
                      className="flex min-h-12 cursor-pointer items-center gap-3 border border-line px-4 transition-colors has-[:checked]:border-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold"
                    >
                      <input
                        type="radio"
                        name={`var-${item.id}`}
                        value={o.id}
                        checked={variationId === o.id}
                        onChange={() => setVariationId(o.id)}
                        className="size-4 accent-[var(--gold)]"
                      />
                      <span className="flex-1 text-bone">{o.name[locale]}</span>
                      <span className="tabular-nums text-gold">{formatSARFromNumber(o.price, locale)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {item.extras ? (
              <fieldset className="mt-6">
                <legend className="t-label flex w-full items-center justify-between text-bone">
                  {item.extras.label[locale]}
                  <span className="t-meta normal-case tracking-normal text-muted">{t.item.optional}</span>
                </legend>
                <div className="mt-3 grid gap-2">
                  {item.extras.options.map((o) => {
                    const checked = extraIds.includes(o.id);
                    return (
                      <label
                        key={o.id}
                        className="flex min-h-12 cursor-pointer items-center gap-3 border border-line px-4 transition-colors has-[:checked]:border-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setExtraIds((prev) => (checked ? prev.filter((x) => x !== o.id) : [...prev, o.id]))
                          }
                          className="size-4 accent-[var(--gold)]"
                        />
                        <span className="flex-1 text-bone">{o.name[locale]}</span>
                        <span className="tabular-nums text-muted">
                          {o.price > 0 ? `+ ${formatSARFromNumber(o.price, locale)}` : t.item.free}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line bg-surface px-5 py-4 sm:px-7">
            {orderable ? (
              <>
                <QuantityStepper value={qty} onChange={(q) => setQty(clampQty(q))} label={item.name[locale]} />
                <button
                  type="button"
                  onClick={submit}
                  className="btn btn-primary t-action min-w-[180px] flex-1 justify-between px-5"
                  aria-label={t.item.addTotal(formatSAR(total, locale))}
                  data-autofocus
                >
                  <span>{t.menu.add}</span>
                  <span className="font-display text-[15px] font-bold tracking-normal tabular-nums">{formatSAR(total, locale)}</span>
                </button>
              </>
            ) : (
              <p className="t-label py-3 text-danger">{t.menu.unavailable}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
