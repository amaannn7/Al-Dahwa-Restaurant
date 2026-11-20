"use client";

import Image from "next/image";
import { CalendarDays, CheckCircle2, Clock, Phone, PartyPopper, Store, Users, UtensilsCrossed } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import buffetImg from "@/assets/photos/catering-buffet.jpg";
import coffeeImg from "@/assets/photos/arabic-coffee.jpg";
import { getWhatsAppNumber, restaurant } from "@/config/restaurant";
import { useI18n } from "@/components/providers/I18nProvider";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Select, type SelectOption } from "@/components/ui/Select";
import type { Locale } from "@/i18n/config";
import { displayPhone, telHref } from "@/lib/links";
import {
  buildInquiryMessage,
  buildMeetingMessage,
  EVENT_TYPES,
  formatTime,
  GUEST_RANGES,
  MEAL_TIMES,
  meetingSlots,
  messageUrl,
  SERVICES,
  todayInRiyadh,
  validateInquiry,
  validateMeeting,
  type CateringInquiry,
  type MeetingRequest,
  type Option,
} from "@/lib/catering";

type Tab = "inquiry" | "meeting";
const TABS: Tab[] = ["inquiry", "meeting"];
const SLOTS = meetingSlots();

const noopSubscribe = () => () => {};
/** Today's date in Riyadh on the client; "" during prerender (no current time on the server). */
function useToday() {
  return useSyncExternalStore(noopSubscribe, () => todayInRiyadh(), () => "");
}

const toOptions = (list: Option[], locale: Locale): SelectOption[] =>
  list.map((o) => ({ value: o.id, label: o.label[locale], hint: o.hint?.[locale] }));

const fieldClass =
  "mt-2 block w-full min-h-13 border border-line-strong bg-ink px-4 text-[16px] text-bone placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 hover:border-gold-line focus:border-gold focus:shadow-[0_0_0_3px_rgb(213_173_114/0.15)] focus:outline-none aria-[invalid=true]:border-danger";

function Field({
  id,
  label,
  optional,
  error,
  note,
  children,
  className = "",
}: {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label id={`${id}-label`} htmlFor={id} className="t-label text-bone">
        {label}
        {optional ? <span className="t-meta ms-1.5 normal-case tracking-normal text-muted">({optional})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="t-meta mt-1.5 text-danger">
          {error}
        </p>
      ) : note ? (
        <p id={`${id}-note`} className="t-meta mt-1.5 text-muted">
          {note}
        </p>
      ) : null}
    </div>
  );
}

const describe = (id: string, error?: string, note?: string) => (error ? `${id}-err` : note ? `${id}-note` : undefined);

function SentPanel({ title, url, onEdit, onFresh }: { title: string; url: string; onEdit: () => void; onFresh: () => void }) {
  const { t } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  return (
    <div className="py-4 text-center sm:py-8" role="status">
      <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold-line text-gold">
        <CheckCircle2 className="size-8" aria-hidden />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="t-heading mt-6 text-[22px] focus:outline-none">
        {title}
      </h3>
      <ol className="mx-auto mt-6 max-w-md space-y-3 text-start text-[15px]">
        {t.catering.sent.steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-[13px] text-gold tabular-nums">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary t-action">
          <WhatsAppIcon className="size-[18px]" />
          {t.catering.sent.reopen}
        </a>
        <button type="button" onClick={onEdit} className="btn btn-outline t-action">
          {t.catering.sent.edit}
        </button>
      </div>
      <button type="button" onClick={onFresh} className="t-meta link-line mt-5 text-gold">
        {t.catering.sent.fresh}
      </button>
    </div>
  );
}

function FormFooter({ label, error }: { label: string; error: string | null }) {
  const { t } = useI18n();
  return (
    <div className="mt-8 border-t border-line pt-6">
      {error ? (
        <p role="alert" className="t-meta mb-4 text-danger">
          {error}
          {error === t.catering.errors.noWhatsApp ? (
            <>
              {" "}
              <a href={telHref} className="underline" dir="ltr">
                {displayPhone(restaurant.phone)}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary t-action w-full sm:w-auto">
        <WhatsAppIcon className="size-[18px]" />
        {label}
      </button>
      <p className="t-meta mt-3">{t.catering.how}</p>
    </div>
  );
}

const EMPTY_INQUIRY: CateringInquiry = { eventType: "", guests: "", service: "", date: "", mealTime: "", location: "", name: "", phone: "", email: "", details: "" };
const INQUIRY_ORDER: (keyof CateringInquiry)[] = ["eventType", "guests", "service", "date", "mealTime", "location", "name", "phone", "email", "details"];

function InquiryForm() {
  const { locale, t } = useI18n();
  const c = t.catering;
  const uid = useId();
  const today = useToday();
  const [data, setData] = useState<CateringInquiry>(EMPTY_INQUIRY);
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const errors = attempted ? validateInquiry(data, today || todayInRiyadh()) : {};
  const id = (k: keyof CateringInquiry) => `${uid}-${k}`;
  const set = (patch: Partial<CateringInquiry>) => setData((d) => ({ ...d, ...patch }));
  const err = (k: keyof CateringInquiry) => (errors[k] ? (c.errors as Record<string, string>)[k] : undefined);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAttempted(true);
    const e = validateInquiry(data, todayInRiyadh());
    const first = INQUIRY_ORDER.find((k) => e[k]);
    if (first) {
      setFormError(c.errors.summary);
      document.getElementById(id(first))?.focus();
      return;
    }
    const number = getWhatsAppNumber();
    if (!number) return setFormError(c.errors.noWhatsApp);
    const url = messageUrl(number, buildInquiryMessage(locale, restaurant.name[locale], data));
    if (!url) return setFormError(c.errors.tooLong);
    setFormError(null);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  if (sentUrl) {
    return (
      <SentPanel
        title={c.sent.inquiryTitle}
        url={sentUrl}
        onEdit={() => setSentUrl(null)}
        onFresh={() => {
          setData(EMPTY_INQUIRY);
          setAttempted(false);
          setSentUrl(null);
        }}
      />
    );
  }

  const optionalMeal: SelectOption[] = [{ value: "", label: c.noPreference }, ...toOptions(MEAL_TIMES, locale)];

  return (
    <form onSubmit={submit} noValidate>
      <fieldset>
        <legend className="t-script text-[24px] sm:text-[26px]">{c.sectionEvent}</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id={id("eventType")} label={c.eventType} error={err("eventType")}>
            <Select
              id={id("eventType")}
              labelId={`${id("eventType")}-label`}
              value={data.eventType}
              onChange={(v) => set({ eventType: v })}
              options={toOptions(EVENT_TYPES, locale)}
              placeholder={c.eventPlaceholder}
              invalid={!!errors.eventType}
              describedBy={describe(id("eventType"), err("eventType"))}
              icon={<PartyPopper className="size-[18px]" aria-hidden />}
            />
          </Field>
          <Field id={id("guests")} label={c.guests} error={err("guests")}>
            <Select
              id={id("guests")}
              labelId={`${id("guests")}-label`}
              value={data.guests}
              onChange={(v) => set({ guests: v })}
              options={toOptions(GUEST_RANGES, locale)}
              placeholder={c.guestsPlaceholder}
              invalid={!!errors.guests}
              describedBy={describe(id("guests"), err("guests"))}
              icon={<Users className="size-[18px]" aria-hidden />}
            />
          </Field>
          <Field id={id("service")} label={c.service} error={err("service")} note={c.serviceNote} className="sm:col-span-2">
            <Select
              id={id("service")}
              labelId={`${id("service")}-label`}
              value={data.service}
              onChange={(v) => set({ service: v })}
              options={toOptions(SERVICES, locale)}
              placeholder={c.servicePlaceholder}
              invalid={!!errors.service}
              describedBy={describe(id("service"), err("service"), c.serviceNote)}
              icon={<UtensilsCrossed className="size-[18px]" aria-hidden />}
            />
          </Field>
          <Field id={id("date")} label={c.date} error={err("date")}>
            <input
              id={id("date")}
              type="date"
              min={today || undefined}
              value={data.date}
              onChange={(e) => set({ date: e.target.value })}
              aria-invalid={!!errors.date}
              aria-describedby={describe(id("date"), err("date"))}
              className={`${fieldClass} [color-scheme:dark]`}
            />
          </Field>
          <Field id={id("mealTime")} label={c.mealTime} optional={c.optional}>
            <Select
              id={id("mealTime")}
              labelId={`${id("mealTime")}-label`}
              value={data.mealTime}
              onChange={(v) => set({ mealTime: v })}
              options={optionalMeal}
              placeholder={c.mealPlaceholder}
              icon={<Clock className="size-[18px]" aria-hidden />}
            />
          </Field>
          <Field id={id("location")} label={c.location} optional={c.optional} className="sm:col-span-2">
            <input
              id={id("location")}
              value={data.location}
              maxLength={160}
              placeholder={c.locationHint}
              onChange={(e) => set({ location: e.target.value })}
              className={fieldClass}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="t-script text-[24px] sm:text-[26px]">{c.sectionContact}</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id={id("name")} label={c.name} error={err("name")}>
            <input
              id={id("name")}
              autoComplete="name"
              value={data.name}
              maxLength={80}
              onChange={(e) => set({ name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={describe(id("name"), err("name"))}
              className={fieldClass}
            />
          </Field>
          <Field id={id("phone")} label={c.phone} error={err("phone")}>
            <input
              id={id("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={c.phoneHint}
              value={data.phone}
              maxLength={20}
              onChange={(e) => set({ phone: e.target.value })}
              aria-invalid={!!errors.phone}
              aria-describedby={describe(id("phone"), err("phone"))}
              className={`${fieldClass} ${locale === "ar" ? "text-right" : ""}`}
            />
          </Field>
          <Field id={id("email")} label={c.email} optional={c.optional} error={err("email")} className="sm:col-span-2">
            <input
              id={id("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              value={data.email}
              maxLength={120}
              onChange={(e) => set({ email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={describe(id("email"), err("email"))}
              className={`${fieldClass} ${locale === "ar" ? "text-right" : ""}`}
            />
          </Field>
          <Field id={id("details")} label={c.details} optional={c.optional} className="sm:col-span-2">
            <textarea
              id={id("details")}
              rows={4}
              maxLength={1000}
              placeholder={c.detailsHint}
              value={data.details}
              onChange={(e) => set({ details: e.target.value })}
              className={`${fieldClass} py-3`}
            />
          </Field>
        </div>
      </fieldset>

      <FormFooter label={c.sendInquiry} error={attempted && Object.keys(errors).length === 0 && formError === c.errors.summary ? null : formError} />
    </form>
  );
}

const EMPTY_MEETING: MeetingRequest = { meetingType: "", date: "", time: "", name: "", phone: "", eventType: "", guests: "", topic: "" };
const MEETING_ORDER: (keyof MeetingRequest)[] = ["meetingType", "date", "time", "name", "phone", "eventType", "guests", "topic"];

function MeetingForm() {
  const { locale, t } = useI18n();
  const c = t.catering;
  const m = c.meeting;
  const uid = useId();
  const today = useToday();
  const [data, setData] = useState<MeetingRequest>(EMPTY_MEETING);
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const errors = attempted ? validateMeeting(data, today || todayInRiyadh(), SLOTS) : {};
  const id = (k: keyof MeetingRequest) => `${uid}-${k}`;
  const set = (patch: Partial<MeetingRequest>) => setData((d) => ({ ...d, ...patch }));
  const err = (k: keyof MeetingRequest) => (errors[k] ? (c.errors as Record<string, string>)[k] : undefined);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setAttempted(true);
    const e = validateMeeting(data, todayInRiyadh(), SLOTS);
    const first = MEETING_ORDER.find((k) => e[k]);
    if (first) {
      setFormError(c.errors.summary);
      const target = first === "meetingType" ? document.querySelector<HTMLInputElement>(`input[name="${id("meetingType")}"]`) : document.getElementById(id(first));
      target?.focus();
      return;
    }
    const number = getWhatsAppNumber();
    if (!number) return setFormError(c.errors.noWhatsApp);
    const url = messageUrl(number, buildMeetingMessage(locale, restaurant.name[locale], data));
    if (!url) return setFormError(c.errors.tooLong);
    setFormError(null);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  if (sentUrl) {
    return (
      <SentPanel
        title={c.sent.meetingTitle}
        url={sentUrl}
        onEdit={() => setSentUrl(null)}
        onFresh={() => {
          setData(EMPTY_MEETING);
          setAttempted(false);
          setSentUrl(null);
        }}
      />
    );
  }

  const types = [
    { value: "in-person" as const, title: m.inPerson, text: m.inPersonText, icon: <Store className="size-6" aria-hidden /> },
    { value: "phone" as const, title: m.phoneCall, text: m.phoneCallText, icon: <Phone className="size-6" aria-hidden /> },
  ];
  const slotOptions: SelectOption[] = SLOTS.map((s) => ({ value: s, label: formatTime(s, locale) }));
  const optional = (list: Option[]): SelectOption[] => [{ value: "", label: c.noPreference }, ...toOptions(list, locale)];

  return (
    <form onSubmit={submit} noValidate>
      <fieldset aria-describedby={errors.meetingType ? `${id("meetingType")}-err` : undefined}>
        <legend className="t-label text-bone">{m.type}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {types.map((o) => (
            <label
              key={o.value}
              className={`group relative flex cursor-pointer items-center gap-4 border bg-ink p-4 transition-[border-color,background-color] duration-200 has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold sm:p-5 ${
                errors.meetingType ? "border-danger" : "border-line-strong hover:border-gold-line"
              }`}
            >
              <input
                type="radio"
                name={id("meetingType")}
                value={o.value}
                checked={data.meetingType === o.value}
                onChange={() => set({ meetingType: o.value })}
                className="peer sr-only"
              />
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-200 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink">
                {o.icon}
              </span>
              <span className="min-w-0">
                <span className="t-heading block text-[16px]">{o.title}</span>
                <span className="mt-0.5 block text-[14px]">{o.text}</span>
              </span>
              <CheckCircle2 className="ms-auto size-5 shrink-0 text-gold opacity-0 transition-opacity duration-200 peer-checked:opacity-100" aria-hidden />
            </label>
          ))}
        </div>
        {errors.meetingType ? (
          <p id={`${id("meetingType")}-err`} className="t-meta mt-1.5 text-danger">
            {c.errors.meetingType}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={id("date")} label={m.date} error={err("date")}>
          <input
            id={id("date")}
            type="date"
            min={today || undefined}
            value={data.date}
            onChange={(e) => set({ date: e.target.value })}
            aria-invalid={!!errors.date}
            aria-describedby={describe(id("date"), err("date"))}
            className={`${fieldClass} [color-scheme:dark]`}
          />
        </Field>
        <Field id={id("time")} label={m.time} error={err("time")}>
          <Select
            id={id("time")}
            labelId={`${id("time")}-label`}
            value={data.time}
            onChange={(v) => set({ time: v })}
            options={slotOptions}
            placeholder={m.timePlaceholder}
            invalid={!!errors.time}
            describedBy={describe(id("time"), err("time"))}
            icon={<Clock className="size-[18px]" aria-hidden />}
          />
        </Field>
        <p className="t-meta -mt-2 text-muted sm:col-span-2">{m.timeNote}</p>
        <Field id={id("name")} label={c.name} error={err("name")}>
          <input
            id={id("name")}
            autoComplete="name"
            value={data.name}
            maxLength={80}
            onChange={(e) => set({ name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={describe(id("name"), err("name"))}
            className={fieldClass}
          />
        </Field>
        <Field id={id("phone")} label={c.phone} error={err("phone")}>
          <input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder={c.phoneHint}
            value={data.phone}
            maxLength={20}
            onChange={(e) => set({ phone: e.target.value })}
            aria-invalid={!!errors.phone}
            aria-describedby={describe(id("phone"), err("phone"))}
            className={`${fieldClass} ${locale === "ar" ? "text-right" : ""}`}
          />
        </Field>
        <Field id={id("eventType")} label={c.eventType} optional={c.optional}>
          <Select
            id={id("eventType")}
            labelId={`${id("eventType")}-label`}
            value={data.eventType}
            onChange={(v) => set({ eventType: v })}
            options={optional(EVENT_TYPES)}
            placeholder={c.eventPlaceholder}
            icon={<PartyPopper className="size-[18px]" aria-hidden />}
          />
        </Field>
        <Field id={id("guests")} label={c.guests} optional={c.optional}>
          <Select
            id={id("guests")}
            labelId={`${id("guests")}-label`}
            value={data.guests}
            onChange={(v) => set({ guests: v })}
            options={optional(GUEST_RANGES)}
            placeholder={c.guestsPlaceholder}
            icon={<Users className="size-[18px]" aria-hidden />}
          />
        </Field>
        <Field id={id("topic")} label={m.topic} optional={c.optional} className="sm:col-span-2">
          <textarea
            id={id("topic")}
            rows={3}
            maxLength={800}
            placeholder={m.topicHint}
            value={data.topic}
            onChange={(e) => set({ topic: e.target.value })}
            className={`${fieldClass} py-3`}
          />
        </Field>
      </div>

      <FormFooter label={m.send} error={attempted && Object.keys(errors).length === 0 && formError === c.errors.summary ? null : formError} />
    </form>
  );
}

/** Tabbed catering inquiry / meeting request, with a photo panel and call fallback. */
export function CateringRequests() {
  const { locale, t } = useI18n();
  const c = t.catering;
  const uid = useId();
  const [tab, setTab] = useState<Tab>("inquiry");
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ inquiry: null, meeting: null });

  // #inquiry and #meeting links (hero buttons, home teaser) pick the tab.
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if (h === "inquiry" || h === "meeting") setTab(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (next: Tab, focus = false) => {
    setTab(next);
    history.replaceState(null, "", `#${next}`);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.indexOf(tab);
    const forward = locale === "ar" ? "ArrowLeft" : "ArrowRight";
    const back = locale === "ar" ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward) select(TABS[(i + 1) % TABS.length], true);
    else if (e.key === back) select(TABS[(i - 1 + TABS.length) % TABS.length], true);
    else if (e.key === "Home") select(TABS[0], true);
    else if (e.key === "End") select(TABS[TABS.length - 1], true);
    else return;
    e.preventDefault();
  };

  const icons: Record<Tab, ReactNode> = {
    inquiry: <UtensilsCrossed className="size-5" aria-hidden />,
    meeting: <CalendarDays className="size-5" aria-hidden />,
  };
  const wa = getWhatsAppNumber();
  const phones = [restaurant.phone, ...restaurant.altPhones];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
      <aside className="relative isolate hidden min-h-[560px] overflow-hidden lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:block lg:self-start" aria-label={c.callInstead}>
        <Image
          src={buffetImg}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 0px"
          quality={80}
          placeholder="blur"
          className={`-z-20 object-cover transition-opacity duration-700 ${tab === "inquiry" ? "opacity-100" : "opacity-0"}`}
        />
        <Image
          src={coffeeImg}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 0px"
          quality={80}
          placeholder="blur"
          className={`-z-20 object-cover transition-opacity duration-700 ${tab === "meeting" ? "opacity-100" : "opacity-0"}`}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <p className="t-script on-photo text-[30px]">{c.callInstead}</p>
          <ul className="mt-4 space-y-1">
            {phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p}`} className="on-photo inline-flex min-h-11 items-center gap-3 text-[17px] text-bone transition-colors hover:text-gold">
                  <Phone className="size-4 text-gold" aria-hidden />
                  <span dir="ltr">{displayPhone(p)}</span>
                </a>
              </li>
            ))}
            {wa ? (
              <li>
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="on-photo inline-flex min-h-11 items-center gap-3 text-[17px] text-bone transition-colors hover:text-gold"
                >
                  <WhatsAppIcon className="size-4 text-gold" />
                  <span dir="ltr">{displayPhone(`+${wa}`)}</span>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </aside>

      <div>
      <div className="border border-line bg-surface">
        <div role="tablist" aria-label={c.tabsLabel} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b border-line">
          {TABS.map((key) => {
            const selected = tab === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                id={`${uid}-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${uid}-panel-${key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(key)}
                onKeyDown={onTabKey}
                className={`relative flex min-h-[76px] items-center gap-3 px-3 py-3 text-start min-[400px]:px-4 transition-colors duration-300 sm:px-7 ${
                  selected ? "bg-surface text-bone" : "bg-ink-2 text-muted hover:text-bone"
                }`}
              >
                <span
                  className={`hidden size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 min-[420px]:grid ${
                    selected ? "border-gold bg-gold text-ink" : "border-line-strong"
                  }`}
                >
                  {icons[key]}
                </span>
                <span className="min-w-0">
                  <span className="t-action block whitespace-normal leading-snug">{c.tabs[key]}</span>
                  <span className="mt-1 hidden text-[13px] text-muted sm:block">{c.tabHints[key]}</span>
                </span>
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-[-1px] h-0.5 origin-center bg-gold transition-transform duration-500 ease-[var(--ease-out)] ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div id={`${uid}-panel-inquiry`} role="tabpanel" aria-labelledby={`${uid}-tab-inquiry`} hidden={tab !== "inquiry"} className="p-5 sm:p-8 lg:p-10">
          <InquiryForm />
        </div>
        <div id={`${uid}-panel-meeting`} role="tabpanel" aria-labelledby={`${uid}-tab-meeting`} hidden={tab !== "meeting"} className="p-5 sm:p-8 lg:p-10">
          <h3 className="t-heading text-[20px]">{c.meeting.title}</h3>
          <p className="mt-2 max-w-xl text-[15px]">{c.meeting.text}</p>
          <div className="mt-7">
            <MeetingForm />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border border-line bg-ink-2 px-5 py-4 lg:hidden">
        <span className="t-label text-bone">{c.callInstead}</span>
        {phones.map((p) => (
          <a key={p} href={`tel:${p}`} className="inline-flex min-h-11 items-center gap-2 text-[15px] text-bone">
            <Phone className="size-4 text-gold" aria-hidden />
            <span dir="ltr">{displayPhone(p)}</span>
          </a>
        ))}
      </div>
      </div>
    </div>
  );
}
