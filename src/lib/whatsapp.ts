/**
 * WhatsApp click-to-chat helpers. Pure functions so they can be unit tested.
 * Uses the official https://wa.me/<digits>?text=<encoded> format.
 */
import type { OrderType } from "@/config/restaurant";
import type { Locale } from "@/i18n/config";
import { formatSAR } from "@/lib/money";
import type { PricedLine, Totals } from "@/lib/cart";
import { orderName } from "@/data/menu";

export type CustomerDetails = {
  name: string;
  phone: string;
  orderType: OrderType | null;
  address: string;
  notes: string;
};

/** Practical upper bound for a wa.me URL that opens reliably on phones. */
export const MAX_WA_URL_LENGTH = 7000;

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

const T = {
  en: {
    hello: (name: string) => `Hello ${name}!`,
    intro: "I would like to place the following order:",
    customer: "Customer name",
    phone: "Contact number",
    type: "Order type",
    types: { pickup: "Pickup", delivery: "Delivery" } as Record<OrderType, string>,
    address: "Delivery address",
    details: "Order details",
    qty: "Quantity",
    price: "Price",
    each: "each",
    subtotal: "Subtotal",
    total: "Total",
    notes: "Additional instructions",
    confirm: "Please confirm my order.",
    thanks: "Thank you!",
  },
  ar: {
    hello: (name: string) => `مرحباً ${name}!`,
    intro: "أرغب في تقديم الطلب التالي:",
    customer: "اسم العميل",
    phone: "رقم التواصل",
    type: "نوع الطلب",
    types: { pickup: "استلام من المطعم", delivery: "توصيل" } as Record<OrderType, string>,
    address: "عنوان التوصيل",
    details: "تفاصيل الطلب",
    qty: "الكمية",
    price: "السعر",
    each: "للواحد",
    subtotal: "المجموع الفرعي",
    total: "الإجمالي",
    notes: "ملاحظات إضافية",
    confirm: "أرجو تأكيد طلبي.",
    thanks: "شكراً لكم!",
  },
};

/** Removes characters that could break the message layout. */
export function cleanText(value: string, max = 500): string {
  return value
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function buildOrderMessage(opts: {
  locale: Locale;
  restaurantName: string;
  lines: PricedLine[];
  totals: Totals;
  customer: CustomerDetails;
  /** Shorter layout used when the full message would be too long. */
  compact?: boolean;
}): string {
  const { locale, restaurantName, lines, totals, customer, compact } = opts;
  const t = T[locale];
  const money = (h: number) => formatSAR(h, locale);
  const out: string[] = [];

  out.push(t.hello(restaurantName), "", t.intro, "");
  out.push(`${t.customer}: ${cleanText(customer.name, 80)}`);
  if (customer.phone) out.push(`${t.phone}: ${cleanText(customer.phone, 30)}`);
  if (customer.orderType) out.push(`${t.type}: ${t.types[customer.orderType]}`);
  if (customer.orderType === "delivery" && customer.address) {
    out.push(`${t.address}: ${cleanText(customer.address, 300)}`);
  }
  out.push("", `${t.details}:`, "");

  lines
    .filter((l) => l.orderable)
    .forEach((line, i) => {
      const name = orderName(line.item, locale);
      const options: string[] = [];
      if (line.variationId && line.item.variations) {
        const v = line.item.variations.options.find((o) => o.id === line.variationId);
        if (v) options.push(v.name[locale]);
      }
      for (const id of line.extraIds) {
        const e = line.item.extras?.options.find((o) => o.id === id);
        if (e) options.push(e.name[locale]);
      }
      const optionText = options.length ? ` (${options.join(locale === "ar" ? "، " : ", ")})` : "";
      if (compact) {
        out.push(`${i + 1}. ${name}${optionText} × ${line.qty} = ${money(line.subtotalHalalas)}`);
      } else {
        out.push(`${i + 1}. ${name}${optionText}`);
        out.push(`   ${t.qty}: ${line.qty}`);
        out.push(`   ${t.price}: ${money(line.unitHalalas)}${line.qty > 1 ? ` ${t.each}` : ""}`);
        out.push(`   ${t.subtotal}: ${money(line.subtotalHalalas)}`);
        out.push("");
      }
    });

  if (compact) out.push("");
  out.push("------------------------", "");
  out.push(`${t.subtotal}: ${money(totals.subtotalHalalas)}`);
  for (const c of totals.charges) out.push(`${c.charge.label[locale]}: ${money(c.halalas)}`);
  out.push(`${t.total}: ${money(totals.totalHalalas)}`);

  const notes = cleanText(customer.notes, 500);
  if (notes) out.push("", `${t.notes}:`, notes);

  out.push("", t.confirm, "", t.thanks);
  return out.join("\n");
}

/**
 * Builds the order URL, switching to the compact layout when the full
 * message would exceed what WhatsApp opens reliably. Returns null if even the
 * compact message is too long (the UI then asks the customer to split it).
 */
export function buildOrderUrl(
  number: string,
  opts: Omit<Parameters<typeof buildOrderMessage>[0], "compact">,
): { url: string; compact: boolean } | null {
  const full = waLink(number, buildOrderMessage({ ...opts, compact: false }));
  if (full.length <= MAX_WA_URL_LENGTH) return { url: full, compact: false };
  const short = waLink(number, buildOrderMessage({ ...opts, compact: true }));
  if (short.length <= MAX_WA_URL_LENGTH) return { url: short, compact: true };
  return null;
}

export function enquiryMessage(locale: Locale): string {
  return locale === "ar"
    ? "مرحباً! أود معرفة المزيد عن مطاعم الدفواء."
    : "Hello! I would like to know more about Al-Dafwa Restaurant.";
}

/** Saudi mobile or any international number: 9 to 15 digits after cleanup. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s\-()+]/g, "");
  if (!/^\d+$/.test(digits)) return false;
  if (/^05\d{8}$/.test(digits)) return true; // 05XXXXXXXX
  if (/^9665\d{8}$/.test(digits)) return true; // 9665XXXXXXXX
  if (/^5\d{8}$/.test(digits)) return true; // 5XXXXXXXX
  return digits.length >= 9 && digits.length <= 15 && !digits.startsWith("0");
}
