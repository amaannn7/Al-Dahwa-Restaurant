import Image from "next/image";
import bg from "@/assets/photos/table-tea.jpg";
import { OrderNowButton } from "@/components/cart/OrderNowButton";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function OrderCta({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">
      <Image src={bg} alt="" fill sizes="100vw" quality={80} className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/65" />
      <div className="container-x text-center" data-reveal>
        <p className="t-script on-photo text-[28px] sm:text-[34px]">{t.cta.script}</p>
        <h2 className="t-title on-photo mx-auto mt-3 max-w-3xl text-[28px] sm:text-[44px]">{t.cta.title}</h2>
        <p className="on-photo mx-auto mt-5 max-w-xl text-[16px] text-bone/90 sm:text-[17px]">{t.cta.text}</p>
        <OrderNowButton className="btn btn-primary t-action mt-10" label={t.cta.button} />
      </div>
    </section>
  );
}
