"use client";

import { Check } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useCart } from "./CartProvider";

export function CartToast() {
  const { t } = useI18n();
  const { toast, openDrawer, totals } = useCart();
  const raised = totals.itemCount > 0;
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 z-[65] flex justify-center px-4 ${raised ? "bottom-24 lg:bottom-6" : "bottom-6"}`}
    >
      {toast ? (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-md items-center gap-3 border border-line bg-surface-2 py-2 ps-4 pe-2 text-[14px] text-bone shadow-2xl"
          style={{ animation: "toast-in 380ms var(--ease-out)" }}
          data-testid="toast"
        >
          <Check className="size-4 shrink-0 text-success" aria-hidden />
          <span className="min-w-0 flex-1">{toast.message}</span>
          <button type="button" onClick={() => openDrawer("cart")} className="t-action min-h-11 shrink-0 px-3 text-gold">
            {t.cart.view}
          </button>
        </div>
      ) : null}
    </div>
  );
}
