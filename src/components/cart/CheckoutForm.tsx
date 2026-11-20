"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { getWhatsAppNumber, restaurant, type OrderType } from "@/config/restaurant";
import { useI18n } from "@/components/providers/I18nProvider";
import { formatSAR } from "@/lib/money";
import { displayPhone, telHref } from "@/lib/links";
import { buildOrderUrl, isValidPhone, type CustomerDetails } from "@/lib/whatsapp";
import { orderName } from "@/data/menu";
import { useCart } from "./CartProvider";
import { CartSummary } from "./CartSummary";
import { optionLabels } from "./CartItem";
import { WhatsAppCheckoutButton } from "./WhatsAppCheckoutButton";

type Errors = Partial<Record<"name" | "phone" | "orderType" | "address" | "form", string>>;

export function CheckoutForm({
  details,
  setDetails,
  onSent,
}: {
  details: CustomerDetails;
  setDetails: (d: CustomerDetails) => void;
  onSent: (url: string, compact: boolean) => void;
}) {
  const { locale, t } = useI18n();
  const { priced, totals, orderType, setOrderType, setView } = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const number = getWhatsAppNumber();
  const types = restaurant.orderTypes;
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;
  const orderable = priced.filter((l) => l.orderable);

  const update = (patch: Partial<CustomerDetails>) => setDetails({ ...details, ...patch });

  const validate = (): Errors => {
    const e: Errors = {};
    if (details.name.trim().length < 2) e.name = t.checkout.errors.name;
    if (!isValidPhone(details.phone)) e.phone = t.checkout.errors.phone;
    if (types.length > 1 && !orderType) e.orderType = t.checkout.errors.orderType;
    if (orderType === "delivery" && details.address.trim().length < 6) e.address = t.checkout.errors.address;
    if (orderable.length === 0) e.form = t.checkout.errors.empty;
    else if (totals.hasUnorderable) e.form = t.checkout.errors.unavailable;
    else if (!number) e.form = t.checkout.errors.noWhatsApp;
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length === 0) {
      const result = buildOrderUrl(number, {
        locale,
        restaurantName: restaurant.name[locale],
        lines: priced,
        totals,
        customer: { ...details, orderType },
      });
      if (!result) e.form = t.checkout.errors.tooLong;
      else {
        setErrors({});
        window.open(result.url, "_blank", "noopener,noreferrer");
        onSent(result.url, result.compact);
        return;
      }
    }
    setErrors(e);
    const firstField = (["name", "phone", "orderType", "address"] as const).find((k) => e[k]);
    if (firstField) document.getElementById(`${uid}-${firstField}`)?.focus();
  };

  const field = "mt-2 block w-full min-h-12 border border-line-strong bg-ink px-4 text-[16px] text-bone placeholder:text-muted/70 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-danger";

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
        <button
          type="button"
          onClick={() => setView("cart")}
          className="t-action mt-5 inline-flex min-h-11 items-center gap-2 text-gold"
        >
          <BackIcon className="size-4" aria-hidden />
          {t.checkout.back}
        </button>

        <div className="mt-4 space-y-5">
          <div>
            <label htmlFor={`${uid}-name`} className="t-label text-bone">{t.checkout.name}</label>
            <input
              id={`${uid}-name`}
              autoComplete="name"
              value={details.name}
              maxLength={80}
              onChange={(e) => update({ name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${uid}-name-err` : undefined}
              className={field}
              data-autofocus
            />
            {errors.name ? <p id={`${uid}-name-err`} className="t-meta mt-1.5 text-danger">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor={`${uid}-phone`} className="t-label text-bone">{t.checkout.phone}</label>
            <input
              id={`${uid}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={t.checkout.phoneHint}
              value={details.phone}
              maxLength={20}
              onChange={(e) => update({ phone: e.target.value })}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
              className={`${field} ${locale === "ar" ? "text-right" : ""}`}
            />
            {errors.phone ? <p id={`${uid}-phone-err`} className="t-meta mt-1.5 text-danger">{errors.phone}</p> : null}
          </div>

          {types.length > 1 ? (
            <fieldset id={`${uid}-orderType`} tabIndex={-1}>
              <legend className="t-label text-bone">{t.checkout.orderType}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {types.map((type: OrderType) => (
                  <label key={type} className="flex min-h-12 cursor-pointer items-center gap-3 border border-line-strong px-4 has-[:checked]:border-gold">
                    <input
                      type="radio"
                      name={`${uid}-type`}
                      checked={orderType === type}
                      onChange={() => setOrderType(type)}
                      className="size-4 accent-[var(--gold)]"
                    />
                    <span className="text-bone">{t.checkout.types[type]}</span>
                  </label>
                ))}
              </div>
              {errors.orderType ? <p className="t-meta mt-1.5 text-danger">{errors.orderType}</p> : null}
            </fieldset>
          ) : types.length === 1 ? (
            <div>
              <p className="t-label text-bone">{t.checkout.orderType}</p>
              <p className="mt-2 border border-line px-4 py-3 text-bone">{t.checkout.types[types[0]]}</p>
            </div>
          ) : null}

          {orderType === "delivery" ? (
            <div>
              <label htmlFor={`${uid}-address`} className="t-label text-bone">{t.checkout.address}</label>
              <textarea
                id={`${uid}-address`}
                autoComplete="street-address"
                rows={2}
                maxLength={300}
                value={details.address}
                onChange={(e) => update({ address: e.target.value })}
                aria-invalid={!!errors.address}
                className={`${field} py-3`}
              />
              {errors.address ? <p className="t-meta mt-1.5 text-danger">{errors.address}</p> : null}
            </div>
          ) : null}

          <div>
            <label htmlFor={`${uid}-notes`} className="t-label text-bone">
              {t.checkout.notes} <span className="t-meta normal-case tracking-normal text-muted">({t.checkout.optional})</span>
            </label>
            <textarea
              id={`${uid}-notes`}
              rows={3}
              maxLength={500}
              placeholder={t.checkout.notesHint}
              value={details.notes}
              onChange={(e) => update({ notes: e.target.value })}
              className={`${field} py-3`}
            />
          </div>
        </div>

        <section className="mt-8 border-t border-line pt-6" aria-labelledby={`${uid}-summary`}>
          <div className="flex items-center justify-between">
            <h3 id={`${uid}-summary`} className="t-label text-bone">{t.checkout.summary}</h3>
            <button type="button" onClick={() => setView("cart")} className="t-meta link-line text-gold">
              {t.checkout.edit}
            </button>
          </div>
          <ul className="mt-4 space-y-3 text-[15px]">
            {orderable.map((l) => {
              const opts = optionLabels(l, locale);
              return (
                <li key={l.key} className="flex justify-between gap-4">
                  <span>
                    <span className="text-bone">{l.qty} × {orderName(l.item, locale)}</span>
                    {opts.length ? <span className="block text-[13px]">{opts.join(locale === "ar" ? "، " : ", ")}</span> : null}
                    <span className="block text-[13px] tabular-nums">{formatSAR(l.unitHalalas, locale)} {l.qty > 1 ? t.cart.each : ""}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-bone">{formatSAR(l.subtotalHalalas, locale)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5">
            <CartSummary />
          </div>
        </section>
        <div className="h-6" />
      </div>

      <div className="border-t border-line bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
        {errors.form ? (
          <p role="alert" className="t-meta mb-3 text-danger">
            {errors.form}
            {!number && errors.form === t.checkout.errors.noWhatsApp ? (
              <>
                {" "}
                <a href={telHref} className="underline" dir="ltr">{displayPhone(restaurant.phone)}</a>
              </>
            ) : null}
          </p>
        ) : null}
        <WhatsAppCheckoutButton disabled={!number || orderable.length === 0} />
        <p className="t-meta mt-3">{number ? t.checkout.how : t.checkout.errors.noWhatsApp}</p>
      </div>
    </form>
  );
}
