import { describe, expect, it } from "vitest";
import {
  addLine, clampQty, computeTotals, isOrderable, lineKey, priceLines, removeLine, sanitizeLines,
  setLineQty, unitPriceHalalas, MAX_QTY, type CartLine, type PricedLine,
} from "@/lib/cart";
import { getMenuItem, menuItems, type MenuItem } from "@/data/menu";
import { formatSAR } from "@/lib/money";

const tawouk = getMenuItem("shish-tawouk")!; // 35
const broasted = getMenuItem("broasted")!; // 22

// The live menu has no sizes; test that logic with a synthetic dish.
const sized: MenuItem = {
  id: "test-sized", category: "grills", name: { en: "Sized", ar: "بأحجام" }, description: { en: "", ar: "" },
  price: 0, image: null, available: true,
  variations: { label: { en: "Serving", ar: "التقديم" }, options: [
    { id: "sandwich", name: { en: "Sandwich", ar: "ساندويتش" }, price: 18 },
    { id: "plate", name: { en: "Plate", ar: "صحن" }, price: 42 },
  ] },
};

// The live menu has no extras or unavailable dishes; test that logic with a synthetic dish.
const synthetic: MenuItem = {
  id: "test-dish", category: "grills", name: { en: "Test", ar: "تجربة" }, description: { en: "", ar: "" },
  price: 10, image: null, available: true,
  extras: { label: { en: "Extras", ar: "إضافات" }, options: [
    { id: "cheese", name: { en: "Cheese", ar: "جبن" }, price: 2 },
    { id: "no-onion", name: { en: "No onion", ar: "بدون بصل" }, price: 0 },
  ] },
};

describe("menu data", () => {
  it("has unique ids and valid prices", () => {
    const ids = menuItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of menuItems) {
      const prices = item.variations ? item.variations.options.map((o) => o.price) : [item.price];
      for (const p of prices) expect(Number.isFinite(p) && p > 0).toBe(true);
    }
  });
});

describe("unit prices", () => {
  it("uses the variation price when variations exist", () => {
    expect(unitPriceHalalas(sized, "sandwich", [])).toBe(1800);
    expect(unitPriceHalalas(sized, "plate", [])).toBe(4200);
    expect(unitPriceHalalas(tawouk, null, [])).toBe(3500);
  });
  it("adds paid extras and ignores free ones", () => {
    expect(unitPriceHalalas(synthetic, null, ["cheese", "no-onion"])).toBe(1200);
  });
  it("rejects unknown variations and extras", () => {
    expect(unitPriceHalalas(sized, "huge", [])).toBeNull();
    expect(unitPriceHalalas(sized, null, [])).toBeNull();
    expect(unitPriceHalalas(synthetic, null, ["gold"])).toBeNull();
    expect(unitPriceHalalas(broasted, "plate", [])).toBeNull();
  });
  it("treats unavailable or badly priced dishes as not orderable", () => {
    expect(isOrderable({ ...synthetic, available: false })).toBe(false);
    expect(isOrderable({ ...synthetic, price: Number.NaN })).toBe(false);
    expect(isOrderable(synthetic)).toBe(true);
  });
  it("lists the open buffet but never orders it (dine-in only)", () => {
    const buffet = getMenuItem("open-buffet")!;
    expect(isOrderable(buffet)).toBe(false);
    expect(priceLines([{ itemId: "open-buffet", variationId: null, extraIds: [], qty: 1 }])[0].orderable).toBe(false);
  });
});

describe("cart operations", () => {
  const a: CartLine = { itemId: "shish-tawouk", variationId: null, extraIds: [], qty: 1 };
  const b: CartLine = { itemId: "rocket-shawarma", variationId: null, extraIds: [], qty: 3 };

  it("merges the same dish and option into one line", () => {
    const lines = addLine(addLine([], a), a);
    expect(lines).toHaveLength(1);
    expect(lines[0].qty).toBe(2);
  });
  it("treats extras in any order as the same line", () => {
    const k1 = lineKey({ itemId: "x", variationId: null, extraIds: ["a", "b"] });
    const k2 = lineKey({ itemId: "x", variationId: null, extraIds: ["b", "a"] });
    expect(k1).toBe(k2);
  });
  it("keeps different dishes and variations as separate lines", () => {
    expect(addLine(addLine([], a), b)).toHaveLength(2);
    expect(lineKey({ itemId: "x", variationId: "plate", extraIds: [] })).not.toBe(lineKey({ itemId: "x", variationId: "sandwich", extraIds: [] }));
  });
  it("updates, clamps and removes quantities", () => {
    let lines = addLine([], a);
    const key = lineKey(a);
    lines = setLineQty(lines, key, 5);
    expect(lines[0].qty).toBe(5);
    lines = setLineQty(lines, key, 999);
    expect(lines[0].qty).toBe(MAX_QTY);
    lines = setLineQty(lines, key, 0);
    expect(lines).toHaveLength(0);
    expect(removeLine(addLine([], a), key)).toHaveLength(0);
  });
  it("clamps invalid quantities", () => {
    expect(clampQty(NaN)).toBe(1);
    expect(clampQty(-3)).toBe(1);
    expect(clampQty(2.7)).toBe(2);
  });
  it("computes subtotals and totals in halalas", () => {
    const priced = priceLines(addLine(addLine([], { ...a, qty: 2 }), b));
    expect(priced.map((l) => l.subtotalHalalas)).toEqual([7000, 4500]);
    const totals = computeTotals(priced);
    expect(totals.subtotalHalalas).toBe(11500);
    expect(totals.totalHalalas).toBe(11500);
    expect(totals.itemCount).toBe(5);
    expect(formatSAR(totals.totalHalalas, "en")).toBe("SAR 115");
    expect(formatSAR(1250, "ar")).toBe("12.50 ر.س");
  });
  it("applies only confirmed charges for the matching order type", () => {
    const priced = priceLines([a]);
    const charges = [{ id: "d", label: { en: "Delivery", ar: "توصيل" }, amount: 10, appliesTo: ["delivery" as const] }];
    expect(computeTotals(priced, charges, "pickup").totalHalalas).toBe(3500);
    expect(computeTotals(priced, charges, "delivery").totalHalalas).toBe(4500);
  });
  it("excludes unorderable lines from totals and flags them", () => {
    const good = priceLines([a])[0];
    const bad: PricedLine = { ...good, key: "bad", orderable: false, subtotalHalalas: 0 };
    const totals = computeTotals([bad, good]);
    expect(totals.hasUnorderable).toBe(true);
    expect(totals.totalHalalas).toBe(3500);
  });
});

describe("sanitizeLines (stored data)", () => {
  it("returns [] for garbage", () => {
    expect(sanitizeLines(null)).toEqual([]);
    expect(sanitizeLines("x")).toEqual([]);
    expect(sanitizeLines({})).toEqual([]);
  });
  it("drops unknown dishes, bad options and malformed entries; never trusts stored prices", () => {
    const clean = sanitizeLines([
      { itemId: "deleted-dish", qty: 1 },
      { itemId: "shish-tawouk", variationId: "huge", qty: 1 },
      { itemId: "shish-tawouk", variationId: null, qty: "3" },
      { itemId: "broasted", variationId: null, extraIds: [], qty: 1e9, price: 0.01 },
      42,
    ]);
    expect(clean).toEqual([
      { itemId: "shish-tawouk", variationId: null, extraIds: [], qty: 1 },
      { itemId: "broasted", variationId: null, extraIds: [], qty: MAX_QTY },
    ]);
    expect(priceLines(clean)[1].unitHalalas).toBe(2200);
  });
});
