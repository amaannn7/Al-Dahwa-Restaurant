"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/cart";
import { useI18n } from "@/components/providers/I18nProvider";

type Props = {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  label: string;
  size?: "sm" | "md";
};

export function QuantityStepper({ value, onChange, min = 1, label, size = "md" }: Props) {
  const { t } = useI18n();
  const box = size === "sm" ? "size-10" : "size-12";
  return (
    <div className="inline-flex items-center border border-line-strong" role="group" aria-label={label}>
      <button
        type="button"
        className={`${box} grid place-items-center text-bone transition-colors hover:text-gold disabled:opacity-35`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`${t.item.decrease}: ${label}`}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <output className="min-w-9 text-center font-display text-[16px] font-semibold text-bone tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={`${box} grid place-items-center text-bone transition-colors hover:text-gold disabled:opacity-35`}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label={`${t.item.increase}: ${label}`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
