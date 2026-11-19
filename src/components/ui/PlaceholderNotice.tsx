import { Info } from "lucide-react";
import { MENU_IS_PLACEHOLDER } from "@/data/menu";

/** Visible while the menu holds placeholder dishes/prices. */
export function PlaceholderNotice({ text, className = "" }: { text: string; className?: string }) {
  if (!MENU_IS_PLACEHOLDER) return null;
  return (
    <p
      role="note"
      className={`flex items-start gap-3 border border-gold/40 bg-gold/[0.07] px-4 py-3 text-[14px] leading-relaxed text-bone ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
      <span>{text}</span>
    </p>
  );
}
