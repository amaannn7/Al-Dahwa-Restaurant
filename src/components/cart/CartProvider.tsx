"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { restaurant, type OrderType } from "@/config/restaurant";
import {
  addLine, CART_STORAGE_KEY, computeTotals, priceLines, removeLine, sanitizeLines, setLineQty,
  type CartLine, type PricedLine, type Totals,
} from "@/lib/cart";

export type DrawerView = "cart" | "checkout" | "sent";

type Toast = { id: number; message: string };

type CartContextValue = {
  hydrated: boolean;
  lines: CartLine[];
  priced: PricedLine[];
  totals: Totals;
  orderType: OrderType | null;
  setOrderType: (t: OrderType | null) => void;
  add: (line: CartLine, toastMessage?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  view: DrawerView;
  setView: (v: DrawerView) => void;
  openDrawer: (view?: DrawerView) => void;
  closeDrawer: () => void;
  dialogItemId: string | null;
  openItem: (id: string) => void;
  closeItem: () => void;
  toast: Toast | null;
  dismissToast: () => void;
  pulse: number;
  staleRemoved: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): { lines: CartLine[]; stale: boolean } {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { lines: [], stale: false };
    const parsed: unknown = JSON.parse(raw);
    const stored = (parsed as { lines?: unknown })?.lines;
    const lines = sanitizeLines(stored);
    const before = Array.isArray(stored) ? stored.length : 0;
    return { lines, stale: before > lines.length };
  } catch {
    return { lines: [], stale: false };
  }
}

function writeStorage(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ v: 1, lines, savedAt: Date.now() }));
  } catch {
    /* storage unavailable (private mode, quota): the cart still works for this visit */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [staleRemoved, setStaleRemoved] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<DrawerView>("cart");
  const [dialogItemId, setDialogItemId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [pulse, setPulse] = useState(0);
  const [orderType, setOrderType] = useState<OrderType | null>(
    restaurant.orderTypes.length === 1 ? restaurant.orderTypes[0] : null,
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load once on the client.
  useEffect(() => {
    const { lines: stored, stale } = readStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage after mount
    setLines(stored);
    setStaleRemoved(stale);
    setHydrated(true);
    if (stale) writeStorage(stored);
  }, []);

  // Keep other tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) setLines(readStorage().lines);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((updater: (prev: CartLine[]) => CartLine[]) => {
    setLines((prev) => {
      const next = updater(prev);
      writeStorage(next);
      return next;
    });
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const add = useCallback(
    (line: CartLine, toastMessage?: string) => {
      commit((prev) => addLine(prev, line));
      setPulse((p) => p + 1);
      if (toastMessage) showToast(toastMessage);
    },
    [commit, showToast],
  );

  const priced = useMemo(() => priceLines(lines), [lines]);
  const totals = useMemo(() => computeTotals(priced, restaurant.charges, orderType), [priced, orderType]);

  const value: CartContextValue = {
    hydrated,
    lines,
    priced,
    totals,
    orderType,
    setOrderType,
    add,
    setQty: (key, qty) => commit((prev) => setLineQty(prev, key, qty)),
    remove: (key) => commit((prev) => removeLine(prev, key)),
    clear: () => commit(() => []),
    drawerOpen,
    view,
    setView,
    openDrawer: (v = "cart") => {
      setView(v);
      setDrawerOpen(true);
      setToast(null);
    },
    closeDrawer: () => setDrawerOpen(false),
    dialogItemId,
    openItem: (id) => setDialogItemId(id),
    closeItem: () => setDialogItemId(null),
    toast,
    dismissToast: () => setToast(null),
    pulse,
    staleRemoved,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
