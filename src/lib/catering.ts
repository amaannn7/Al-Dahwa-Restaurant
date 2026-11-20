/**
 * Catering inquiries and meeting requests. Pure functions and option data so
 * the WhatsApp messages can be unit tested. Messages are sent through the same
 * click-to-chat link as orders (see whatsapp.ts): nothing is sent until the
 * customer presses send in WhatsApp.
 */
import type { Locale } from "@/i18n/config";
import { cleanText, isValidPhone, MAX_WA_URL_LENGTH, waLink } from "@/lib/whatsapp";

type L = { en: string; ar: string };
export type Option = { id: string; label: L; hint?: L };

/** Occasions a customer can pick. They describe the customer's event, not a promise of service. */
export const EVENT_TYPES: Option[] = [
  { id: "wedding", label: { en: "Wedding or engagement", ar: "زواج أو ملكة" } },
  { id: "family", label: { en: "Family gathering", ar: "تجمع عائلي" } },
  { id: "corporate", label: { en: "Corporate event or office lunch", ar: "مناسبة شركة أو غداء عمل" } },
  { id: "ramadan", label: { en: "Ramadan iftar or suhoor", ar: "إفطار أو سحور رمضان" } },
  { id: "eid", label: { en: "Eid gathering", ar: "معايدة العيد" } },
  { id: "birthday", label: { en: "Birthday", ar: "عيد ميلاد" } },
  { id: "graduation", label: { en: "Graduation", ar: "حفل تخرج" } },
  { id: "condolence", label: { en: "Condolence gathering", ar: "عزاء" } },
  { id: "other", label: { en: "Other occasion", ar: "مناسبة أخرى" } },
];

export const GUEST_RANGES: Option[] = [
  { id: "10-25", label: { en: "10 to 25 guests", ar: "من 10 إلى 25 ضيفاً" } },
  { id: "26-50", label: { en: "26 to 50 guests", ar: "من 26 إلى 50 ضيفاً" } },
  { id: "51-100", label: { en: "51 to 100 guests", ar: "من 51 إلى 100 ضيف" } },
  { id: "101-200", label: { en: "101 to 200 guests", ar: "من 101 إلى 200 ضيف" } },
  { id: "201-500", label: { en: "201 to 500 guests", ar: "من 201 إلى 500 ضيف" } },
  { id: "500+", label: { en: "More than 500 guests", ar: "أكثر من 500 ضيف" } },
];

/** What the customer would like. The restaurant confirms what it can provide. */
export const SERVICES: Option[] = [
  {
    id: "pickup",
    label: { en: "Large order for pickup", ar: "طلب كبير للاستلام" },
    hint: { en: "Collect the food from the restaurant", ar: "استلام الطلب من المطعم" },
  },
  {
    id: "delivery",
    label: { en: "Delivery to my venue", ar: "توصيل إلى موقع المناسبة" },
    hint: { en: "Food delivered ready to serve", ar: "توصيل الطعام جاهزاً للتقديم" },
  },
  {
    id: "buffet",
    label: { en: "Delivery with buffet setup", ar: "توصيل مع تجهيز البوفيه" },
    hint: { en: "Food delivered and laid out as a buffet", ar: "توصيل الطعام وترتيبه على شكل بوفيه" },
  },
  {
    id: "full",
    label: { en: "Full service with serving staff", ar: "خدمة كاملة مع طاقم ضيافة" },
    hint: { en: "Setup, serving and clearing at your event", ar: "تجهيز وتقديم وترتيب في موقع المناسبة" },
  },
  {
    id: "advise",
    label: { en: "Not sure yet, please advise", ar: "لم أحدد بعد، أرجو اقتراحكم" },
    hint: { en: "Talk it through with the restaurant", ar: "نتناقش في الخيارات المناسبة" },
  },
];

export const MEAL_TIMES: Option[] = [
  { id: "breakfast", label: { en: "Breakfast", ar: "فطور" } },
  { id: "lunch", label: { en: "Lunch", ar: "غداء" } },
  { id: "dinner", label: { en: "Dinner", ar: "عشاء" } },
  { id: "late", label: { en: "Late night", ar: "وقت متأخر" } },
];

export type MeetingType = "in-person" | "phone";

export const MEETING_TYPES: Record<MeetingType, L> = {
  "in-person": { en: "In person at the restaurant", ar: "حضورياً في المطعم" },
  phone: { en: "Phone call", ar: "مكالمة هاتفية" },
};

/** "19:30" to "7:30 PM" / "7:30 م". */
export function formatTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = locale === "ar" ? (h < 12 ? "ص" : "م") : h < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Half-hour meeting slots from opening time until `lastStart` (default 22:00).
 * The restaurant opens at 12:00 and closes at 02:00, so meetings are offered
 * in the afternoon and evening only.
 */
export function meetingSlots(opens = "12:00", lastStart = "22:00"): string[] {
  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  const out: string[] = [];
  for (let t = toMin(opens); t <= toMin(lastStart); t += 30) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}

/** Today's date in Riyadh as YYYY-MM-DD. */
export function todayInRiyadh(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A real calendar date in YYYY-MM-DD form, on or after `today`. */
export function isValidFutureDate(value: string, today: string): boolean {
  const m = value.match(ISO_DATE);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return false;
  return value >= today;
}

/** "Thursday, 26 November 2026" / "الخميس، 26 نوفمبر 2026" (Gregorian, Latin digits). */
export function formatDate(value: string, locale: Locale): string {
  const m = value.match(ISO_DATE);
  if (!m) return value;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

const labelOf = (list: Option[], id: string, locale: Locale) => list.find((o) => o.id === id)?.label[locale] ?? "";

export type CateringInquiry = {
  eventType: string;
  guests: string;
  service: string;
  date: string;
  mealTime: string;
  location: string;
  name: string;
  phone: string;
  email: string;
  details: string;
};

export type MeetingRequest = {
  meetingType: MeetingType | "";
  date: string;
  time: string;
  name: string;
  phone: string;
  eventType: string;
  guests: string;
  topic: string;
};

export type FieldErrors<K extends string> = Partial<Record<K, true>>;

export function validateInquiry(d: CateringInquiry, today: string): FieldErrors<keyof CateringInquiry> {
  const e: FieldErrors<keyof CateringInquiry> = {};
  if (!EVENT_TYPES.some((o) => o.id === d.eventType)) e.eventType = true;
  if (!GUEST_RANGES.some((o) => o.id === d.guests)) e.guests = true;
  if (!SERVICES.some((o) => o.id === d.service)) e.service = true;
  if (!isValidFutureDate(d.date, today)) e.date = true;
  if (d.mealTime && !MEAL_TIMES.some((o) => o.id === d.mealTime)) e.mealTime = true;
  if (d.name.trim().length < 2) e.name = true;
  if (!isValidPhone(d.phone)) e.phone = true;
  if (d.email.trim() && !isValidEmail(d.email)) e.email = true;
  return e;
}

export function validateMeeting(d: MeetingRequest, today: string, slots: string[]): FieldErrors<keyof MeetingRequest> {
  const e: FieldErrors<keyof MeetingRequest> = {};
  if (d.meetingType !== "in-person" && d.meetingType !== "phone") e.meetingType = true;
  if (!isValidFutureDate(d.date, today)) e.date = true;
  if (!slots.includes(d.time)) e.time = true;
  if (d.name.trim().length < 2) e.name = true;
  if (!isValidPhone(d.phone)) e.phone = true;
  if (d.eventType && !EVENT_TYPES.some((o) => o.id === d.eventType)) e.eventType = true;
  if (d.guests && !GUEST_RANGES.some((o) => o.id === d.guests)) e.guests = true;
  return e;
}

const M = {
  en: {
    hello: (r: string) => `Hello ${r}!`,
    inquiryIntro: "I would like to ask about catering for an event.",
    meetingIntro: "I would like to request a meeting to discuss catering for an event.",
    event: "Event type",
    date: "Event date",
    meal: "Serving time",
    guests: "Number of guests",
    service: "Catering service",
    location: "Event location",
    meetingType: "Meeting type",
    meetingDate: "Preferred date",
    meetingTime: "Preferred time",
    name: "Name",
    phone: "Contact number",
    email: "Email",
    details: "Additional requirements",
    topic: "To discuss",
    inquiryClose: "Please let me know availability and a quote.",
    meetingClose: "Please confirm the meeting or suggest another time.",
    thanks: "Thank you!",
  },
  ar: {
    hello: (r: string) => `مرحباً ${r}!`,
    inquiryIntro: "أرغب في الاستفسار عن خدمة الولائم لمناسبة.",
    meetingIntro: "أرغب في حجز موعد لمناقشة طلب ولائم لمناسبة.",
    event: "نوع المناسبة",
    date: "تاريخ المناسبة",
    meal: "وقت التقديم",
    guests: "عدد الضيوف",
    service: "الخدمة المطلوبة",
    location: "موقع المناسبة",
    meetingType: "نوع الموعد",
    meetingDate: "التاريخ المفضل",
    meetingTime: "الوقت المفضل",
    name: "الاسم",
    phone: "رقم التواصل",
    email: "البريد الإلكتروني",
    details: "متطلبات إضافية",
    topic: "موضوع النقاش",
    inquiryClose: "أرجو إفادتي بالتوفر والسعر.",
    meetingClose: "أرجو تأكيد الموعد أو اقتراح وقت آخر.",
    thanks: "شكراً لكم!",
  },
};

export function buildInquiryMessage(locale: Locale, restaurantName: string, d: CateringInquiry): string {
  const t = M[locale];
  const out = [t.hello(restaurantName), "", t.inquiryIntro, ""];
  out.push(`${t.event}: ${labelOf(EVENT_TYPES, d.eventType, locale)}`);
  out.push(`${t.date}: ${formatDate(d.date, locale)}`);
  if (d.mealTime) out.push(`${t.meal}: ${labelOf(MEAL_TIMES, d.mealTime, locale)}`);
  out.push(`${t.guests}: ${labelOf(GUEST_RANGES, d.guests, locale)}`);
  out.push(`${t.service}: ${labelOf(SERVICES, d.service, locale)}`);
  const location = cleanText(d.location, 160);
  if (location) out.push(`${t.location}: ${location}`);
  out.push("", `${t.name}: ${cleanText(d.name, 80)}`, `${t.phone}: ${cleanText(d.phone, 30)}`);
  const email = cleanText(d.email, 120);
  if (email) out.push(`${t.email}: ${email}`);
  const details = cleanText(d.details, 1000);
  if (details) out.push("", `${t.details}:`, details);
  out.push("", t.inquiryClose, t.thanks);
  return out.join("\n");
}

export function buildMeetingMessage(locale: Locale, restaurantName: string, d: MeetingRequest): string {
  const t = M[locale];
  const out = [t.hello(restaurantName), "", t.meetingIntro, ""];
  if (d.meetingType) out.push(`${t.meetingType}: ${MEETING_TYPES[d.meetingType][locale]}`);
  out.push(`${t.meetingDate}: ${formatDate(d.date, locale)}`);
  out.push(`${t.meetingTime}: ${formatTime(d.time, locale)}`);
  out.push("", `${t.name}: ${cleanText(d.name, 80)}`, `${t.phone}: ${cleanText(d.phone, 30)}`);
  if (d.eventType) out.push(`${t.event}: ${labelOf(EVENT_TYPES, d.eventType, locale)}`);
  if (d.guests) out.push(`${t.guests}: ${labelOf(GUEST_RANGES, d.guests, locale)}`);
  const topic = cleanText(d.topic, 800);
  if (topic) out.push("", `${t.topic}:`, topic);
  out.push("", t.meetingClose, t.thanks);
  return out.join("\n");
}

/** wa.me link for a message, or null if it is too long to open reliably. */
export function messageUrl(number: string, text: string): string | null {
  const url = waLink(number, text);
  return url.length <= MAX_WA_URL_LENGTH ? url : null;
}
