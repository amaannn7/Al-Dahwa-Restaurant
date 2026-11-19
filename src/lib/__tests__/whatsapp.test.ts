import { describe, expect, it } from "vitest";
import { addLine, computeTotals, priceLines, type CartLine } from "@/lib/cart";
import { buildOrderMessage, buildOrderUrl, cleanText, isValidPhone, waLink, MAX_WA_URL_LENGTH } from "@/lib/whatsapp";

const lines = addLine(
  addLine([], { itemId: "shish-tawouk", variationId: "plate", extraIds: [], qty: 2 }),
  { itemId: "chicken-shawarma", variationId: "jumbo", extraIds: [], qty: 1 },
);
const priced = priceLines(lines);
const totals = computeTotals(priced);
const customer = { name: "Ahmed & Sons", phone: "0501234567", orderType: "pickup" as const, address: "", notes: "No onions, please. #1 ?=&" };

describe("order message", () => {
  it("contains the real selections, quantities, prices and total (English)", () => {
    const msg = buildOrderMessage({ locale: "en", restaurantName: "Al-Dafwa Restaurant", lines: priced, totals, customer });
    expect(msg).toContain("Hello Al-Dafwa Restaurant!");
    expect(msg).toContain("Customer name: Ahmed & Sons");
    expect(msg).toContain("Order type: Pickup");
    expect(msg).toContain("1. Shish Tawouk (Plate)");
    expect(msg).toContain("Quantity: 2");
    expect(msg).toContain("Price: SAR 42 each");
    expect(msg).toContain("Subtotal: SAR 84");
    expect(msg).toContain("2. Chicken Shawarma (Jumbo)");
    expect(msg).toContain("Price: SAR 19\n");
    expect(msg).toContain("Total: SAR 103");
    expect(msg).toContain("No onions, please. #1 ?=&");
    expect(msg).toContain("Please confirm my order.");
  });
  it("builds an Arabic message", () => {
    const msg = buildOrderMessage({ locale: "ar", restaurantName: "مطاعم الدفواء", lines: priced, totals, customer: { ...customer, name: "أحمد" } });
    expect(msg).toContain("مرحباً مطاعم الدفواء!");
    expect(msg).toContain("اسم العميل: أحمد");
    expect(msg).toContain("1. شيش طاووق (صحن)");
    expect(msg).toContain("الإجمالي: 103 ر.س");
  });
  it("URL-encodes everything and round-trips exactly", () => {
    const msg = buildOrderMessage({ locale: "ar", restaurantName: "مطاعم الدفواء", lines: priced, totals, customer });
    const url = waLink("966500000000", msg);
    expect(url.startsWith("https://wa.me/966500000000?text=")).toBe(true);
    expect(url.split("?text=")[1]).not.toMatch(/[\s#&?]/);
    const text = new URL(url).searchParams.get("text");
    expect(text).toBe(msg);
  });
  it("falls back to a compact layout for long orders, and refuses absurdly long ones", () => {
    const many: CartLine[] = Array.from({ length: 22 }, (_, i) => ({ itemId: ["shish-tawouk", "broasted", "hummus", "fattoush", "umm-ali", "tabbouleh"][i % 6], variationId: i % 6 === 0 ? (i % 12 ? "plate" : "sandwich") : null, extraIds: [], qty: (i % 5) + 1 }));
    const p = priceLines(many.reduce((acc, l) => addLine(acc, l), [] as CartLine[]));
    const res = buildOrderUrl("966500000000", { locale: "ar", restaurantName: "مطاعم الدفواء", lines: p, totals: computeTotals(p), customer: { ...customer, notes: "ملاحظة ".repeat(70) } });
    expect(res).not.toBeNull();
    expect(res!.url.length).toBeLessThanOrEqual(MAX_WA_URL_LENGTH);
    const huge = buildOrderUrl("966500000000", { locale: "ar", restaurantName: "x", lines: Array(400).fill(p[0]), totals: computeTotals(p), customer });
    expect(huge).toBeNull();
  });
  it("cleans control characters and limits length", () => {
    expect(cleanText("a\u0000b\r\n\n\n\nc  ")).toBe("ab\n\nc");
    expect(cleanText("x".repeat(900)).length).toBe(500);
  });
  it("validates phone numbers", () => {
    for (const ok of ["0501234567", "+966 50 123 4567", "966501234567", "501234567", "+44 7700 900123"]) expect(isValidPhone(ok)).toBe(true);
    for (const bad of ["", "abc", "123", "05012", "0000000000000000"]) expect(isValidPhone(bad)).toBe(false);
  });
});
