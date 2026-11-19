"use client";

import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useI18n } from "@/components/providers/I18nProvider";

/** Submit button for the checkout form; the form builds and opens the wa.me link. */
export function WhatsAppCheckoutButton({ disabled }: { disabled?: boolean }) {
  const { t } = useI18n();
  return (
    <button type="submit" disabled={disabled} className="btn btn-primary t-action w-full" data-testid="whatsapp-order">
      <WhatsAppIcon className="size-5" />
      {t.checkout.send}
    </button>
  );
}
