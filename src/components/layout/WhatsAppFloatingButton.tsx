"use client";

import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useCart } from "@/components/cart/CartProvider";
import { useI18n } from "@/components/providers/I18nProvider";

/** General enquiries only; ordering goes through the cart. Hidden when no number is configured. */
export function WhatsAppFloatingButton({ href }: { href: string | null }) {
  const { t } = useI18n();
  const { totals, hydrated, toast } = useCart();
  if (!href) return null;
  const raised = hydrated && totals.itemCount > 0;
  return (
    <aside aria-label={t.location.whatsapp}>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t.location.whatsapp}: ${t.contact.whatsappText}`}
      className={`fixed end-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-[#0b1f12] shadow-[0_10px_30px_rgb(0_0_0/0.45)] transition-[transform,bottom,opacity] duration-300 hover:scale-105 sm:end-6 ${
        raised ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6"
      } ${toast ? "pointer-events-none scale-90 opacity-0" : "opacity-100"}`}
    >
      <WhatsAppIcon className="size-7" />
    </a>
    </aside>
  );
}
