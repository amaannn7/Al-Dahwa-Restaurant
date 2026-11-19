import type { Locale } from "@/i18n/config";

/**
 * Formats halalas as SAR. Western digits are used in both languages so that
 * prices read the same on the site and in the WhatsApp message.
 */
export function formatSAR(halalas: number, locale: Locale): string {
  const sar = halalas / 100;
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(sar) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(sar);
  return locale === "ar" ? `${amount} ر.س` : `SAR ${amount}`;
}

export const formatSARFromNumber = (sar: number, locale: Locale) =>
  formatSAR(Math.round(sar * 100), locale);
