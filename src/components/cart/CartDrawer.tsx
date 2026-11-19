"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { useRef, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { useDialog } from "@/components/ui/useDialog";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { localePath } from "@/lib/links";
import type { CustomerDetails } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CheckoutForm } from "./CheckoutForm";

const emptyDetails: CustomerDetails = { name: "", phone: "", orderType: null, address: "", notes: "" };

export function CartDrawer() {
  const { locale, t } = useI18n();
  const cart = useCart();
  const { drawerOpen, closeDrawer, view, setView, priced, totals, clear, staleRemoved } = cart;
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(drawerOpen, closeDrawer, panelRef);
  const [details, setDetails] = useState<CustomerDetails>(emptyDetails);
  const [sent, setSent] = useState<{ url: string; compact: boolean } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const isEmpty = priced.length === 0;
  const title = view === "checkout" ? t.checkout.title : view === "sent" ? t.checkout.sentTitle : t.cart.title;
  const fromStart = locale === "ar" ? "-translate-x-full" : "translate-x-full";

  return (
    <div className={`fixed inset-0 z-[55] ${drawerOpen ? "visible" : "invisible"}`} inert={!drawerOpen} aria-hidden={!drawerOpen}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={t.cart.close}
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/65 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 end-0 flex w-full max-w-[460px] flex-col border-s border-line bg-surface shadow-2xl transition-transform duration-[420ms] ease-[var(--ease-out)] ${
          drawerOpen ? "translate-x-0" : fromStart
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-5 sm:px-7">
          <h2 id="cart-title" className="t-heading text-[18px]">
            {title}
            {view === "cart" && !isEmpty ? (
              <span className="t-meta ms-2 normal-case tracking-normal text-muted">({t.cart.itemCount(totals.itemCount)})</span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t.cart.close}
            className="-me-2 grid size-11 place-items-center text-bone transition-colors hover:text-gold"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {view === "sent" && sent ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-8 sm:px-7" data-testid="sent-view">
            <CheckCircle2 className="size-10 text-success" aria-hidden />
            <p className="t-heading mt-4 text-[20px]" role="status">{t.checkout.sentTitle}</p>
            <ol className="mt-6 space-y-4">
              {t.checkout.sentSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid size-7 shrink-0 place-items-center border border-gold font-display text-[13px] font-semibold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-bone/90">{step}</span>
                </li>
              ))}
            </ol>
            {sent.compact ? <p className="t-meta mt-5">{t.checkout.compactNote}</p> : null}
            <div className="mt-auto grid gap-3 pt-8">
              <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary t-action">
                <WhatsAppIcon className="size-5" />
                {t.checkout.reopen}
              </a>
              <button
                type="button"
                className="btn btn-outline t-action"
                onClick={() => {
                  clear();
                  setDetails({ ...emptyDetails, name: details.name, phone: details.phone });
                  setSent(null);
                  setView("cart");
                  closeDrawer();
                }}
              >
                {t.checkout.clearAfter}
              </button>
              <Link href={localePath(locale, "/menu")} onClick={closeDrawer} className="btn btn-ghost t-action">
                {t.checkout.keep}
              </Link>
            </div>
          </div>
        ) : view === "checkout" && !isEmpty ? (
          <CheckoutForm
            details={details}
            setDetails={setDetails}
            onSent={(url, compact) => {
              setSent({ url, compact });
              setView("sent");
            }}
          />
        ) : isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" data-testid="cart-empty">
            <div className="relative grid size-24 place-items-center border border-line">
              <ShoppingBag className="size-9 text-gold" strokeWidth={1.3} aria-hidden />
              <span aria-hidden className="absolute -bottom-px start-1/2 h-px w-10 -translate-x-1/2 bg-gold rtl:translate-x-1/2" />
            </div>
            <p className="t-script mt-8 text-[30px] leading-tight">{t.cart.empty}</p>
            <p className="mt-3 text-[15px]">{t.cart.emptyText}</p>
            {staleRemoved ? <p className="t-meta mt-4 text-gold">{t.cart.removedStale}</p> : null}
            <Link href={localePath(locale, "/menu")} onClick={closeDrawer} className="btn btn-primary t-action mt-8">
              {t.cart.browse}
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
              {staleRemoved ? <p className="t-meta mt-4 text-gold">{t.cart.removedStale}</p> : null}
              <ul className="divide-y divide-line">
                {priced.map((line) => (
                  <CartItem key={line.key} line={line} />
                ))}
              </ul>
              <div className="flex justify-end pb-4">
                {confirmClear ? (
                  <div className="flex items-center gap-3 text-[14px]" role="group" aria-label={t.cart.clearConfirm}>
                    <span>{t.cart.clearConfirm}</span>
                    <button type="button" className="t-action min-h-11 px-2 text-danger" onClick={() => { clear(); setConfirmClear(false); }}>
                      {t.cart.yes}
                    </button>
                    <button type="button" className="t-action min-h-11 px-2 text-bone" onClick={() => setConfirmClear(false)}>
                      {t.cart.no}
                    </button>
                  </div>
                ) : (
                  <button type="button" className="t-meta link-line min-h-11 text-muted" onClick={() => setConfirmClear(true)}>
                    {t.cart.clear}
                  </button>
                )}
              </div>
            </div>
            <div className="shrink-0 border-t border-line bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
              <CartSummary />
              {totals.hasUnorderable ? <p className="t-meta mt-3 text-danger">{t.checkout.errors.unavailable}</p> : null}
              <button
                type="button"
                className="btn btn-primary t-action mt-5 w-full"
                disabled={totals.hasUnorderable || totals.itemCount === 0}
                onClick={() => setView("checkout")}
                data-testid="checkout-button"
              >
                {t.cart.checkout}
              </button>
              <PlaceholderNotice text={t.menu.placeholder} className="mt-4 text-[13px]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
