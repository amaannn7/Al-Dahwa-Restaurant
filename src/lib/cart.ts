/**
 * Pure cart logic: no React, no browser APIs. Prices are always recomputed
 * from the menu data, never trusted from storage. All money maths uses
 * integer halalas (1 SAR = 100 halalas) to avoid floating point drift.
 */
import type { Charge, OrderType } from "@/config/restaurant";
import { getMenuItem, type MenuItem } from "@/data/menu";

export const MAX_QTY = 50;
export const MAX_LINES = 60;
export const CART_STORAGE_KEY = "aldafwa-cart-v1";

/** What is stored: a selection, never a price. */
export type CartLine = {
  itemId: string;
  variationId: string | null;
  extraIds: string[];
  qty: number;
};

export type PricedLine = CartLine & {
  key: string;
  item: MenuItem;
  unitHalalas: number;
  subtotalHalalas: number;
  /** false when the item is unavailable or its price is invalid. */
  orderable: boolean;
};

export const toHalalas = (sar: number) => Math.round(sar * 100);

export function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 100000;
}

export function lineKey(line: Pick<CartLine, "itemId" | "variationId" | "extraIds">): string {
  return [line.itemId, line.variationId ?? "", [...line.extraIds].sort().join("+")].join("|");
}

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

/** Default variation for an item, or null when it has none. */
export function defaultVariationId(item: MenuItem): string | null {
  return item.variations?.options[0]?.id ?? null;
}

/**
 * Unit price in halalas for an item with the chosen options, or null when
 * the selection is not valid for the item (unknown variation/extra, bad price).
 */
export function unitPriceHalalas(
  item: MenuItem,
  variationId: string | null,
  extraIds: string[],
): number | null {
  let base: number;
  if (item.variations && item.variations.options.length > 0) {
    const v = item.variations.options.find((o) => o.id === variationId);
    if (!v || !isValidPrice(v.price)) return null;
    base = v.price;
  } else {
    if (variationId !== null) return null;
    if (!isValidPrice(item.price)) return null;
    base = item.price;
  }
  let total = toHalalas(base);
  for (const id of extraIds) {
    const extra = item.extras?.options.find((o) => o.id === id);
    if (!extra || !isValidPrice(extra.price)) return null;
    total += toHalalas(extra.price);
  }
  return total;
}

export function isOrderable(item: MenuItem): boolean {
  if (!item.available) return false;
  if (item.variations?.options.length) {
    return item.variations.options.some((o) => isValidPrice(o.price));
  }
  return isValidPrice(item.price);
}

/**
 * Turns unknown stored data into clean cart lines. Drops anything malformed
 * or referring to dishes/options no longer on the menu; merges duplicates.
 */
export function sanitizeLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<string, CartLine>();
  for (const entry of raw.slice(0, MAX_LINES * 2)) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    if (typeof e.itemId !== "string") continue;
    const item = getMenuItem(e.itemId);
    if (!item) continue;
    const variationId = typeof e.variationId === "string" ? e.variationId : null;
    const extraIds = Array.isArray(e.extraIds)
      ? [...new Set(e.extraIds.filter((x): x is string => typeof x === "string"))].sort()
      : [];
    const qty = typeof e.qty === "number" ? clampQty(e.qty) : 1;
    if (unitPriceHalalas(item, variationId, extraIds) === null) continue;
    const line: CartLine = { itemId: item.id, variationId, extraIds, qty };
    const key = lineKey(line);
    const existing = merged.get(key);
    if (existing) existing.qty = clampQty(existing.qty + qty);
    else merged.set(key, line);
    if (merged.size >= MAX_LINES) break;
  }
  return [...merged.values()];
}

export function priceLines(lines: CartLine[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const line of lines) {
    const item = getMenuItem(line.itemId);
    if (!item) continue;
    const unit = unitPriceHalalas(item, line.variationId, line.extraIds);
    if (unit === null) continue;
    const orderable = isOrderable(item);
    out.push({
      ...line,
      key: lineKey(line),
      item,
      unitHalalas: unit,
      subtotalHalalas: orderable ? unit * line.qty : 0,
      orderable,
    });
  }
  return out;
}

export function addLine(lines: CartLine[], add: CartLine): CartLine[] {
  const key = lineKey(add);
  const extraIds = [...new Set(add.extraIds)].sort();
  const found = lines.find((l) => lineKey(l) === key);
  if (found) {
    return lines.map((l) => (l === found ? { ...l, qty: clampQty(l.qty + add.qty) } : l));
  }
  if (lines.length >= MAX_LINES) return lines;
  return [...lines, { ...add, extraIds, qty: clampQty(add.qty) }];
}

export function setLineQty(lines: CartLine[], key: string, qty: number): CartLine[] {
  if (qty <= 0) return removeLine(lines, key);
  return lines.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(qty) } : l));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => lineKey(l) !== key);
}

export type Totals = {
  itemCount: number;
  subtotalHalalas: number;
  charges: { charge: Charge; halalas: number }[];
  totalHalalas: number;
  hasUnorderable: boolean;
};

export function computeTotals(
  priced: PricedLine[],
  charges: readonly Charge[] = [],
  orderType: OrderType | null = null,
): Totals {
  const orderableLines = priced.filter((l) => l.orderable);
  const subtotal = orderableLines.reduce((sum, l) => sum + l.subtotalHalalas, 0);
  const applied = charges
    .filter((c) => isValidPrice(c.amount) && (orderType ? c.appliesTo.includes(orderType) : false))
    .map((charge) => ({ charge, halalas: toHalalas(charge.amount) }));
  const total = subtotal + applied.reduce((s, c) => s + c.halalas, 0);
  return {
    itemCount: orderableLines.reduce((n, l) => n + l.qty, 0),
    subtotalHalalas: subtotal,
    charges: applied,
    totalHalalas: total,
    hasUnorderable: priced.some((l) => !l.orderable),
  };
}
