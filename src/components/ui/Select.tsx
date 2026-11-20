"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type SelectOption = { value: string; label: string; hint?: string };

/**
 * Accessible custom dropdown (WAI-ARIA "select-only combobox" pattern with a
 * listbox; focus stays on the combobox). Keyboard: Arrow keys, Home/End,
 * Enter/Space to choose, Esc to close, and type a letter to jump. Opens upwards when there is no room below.
 */
export function Select({
  id,
  labelId,
  value,
  onChange,
  options,
  placeholder,
  invalid = false,
  describedBy,
  icon,
}: {
  id: string;
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [up, setUp] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const listId = `${id}-listbox`;
  // An empty value shows the placeholder (an optional "" option clears the choice).
  const selectedIndex = value ? options.findIndex((o) => o.value === value) : -1;
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const show = (index: number) => {
    const r = buttonRef.current?.getBoundingClientRect();
    if (r) {
      const below = window.innerHeight - r.bottom;
      setUp(below < 300 && r.top > below);
    }
    setActive(Math.max(0, Math.min(options.length - 1, index)));
    setOpen(true);
  };

  const hide = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    hide();
  };

  // Keep the active option in view.
  useEffect(() => {
    if (!open || active < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  // Close on outside press.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const jumpTo = (char: string, now: number) => {
    typed.current.text = now - typed.current.at > 700 ? char : typed.current.text + char;
    typed.current.at = now;
    const q = typed.current.text.toLocaleLowerCase();
    const start = open ? active : selectedIndex;
    const order = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    const hit = order.find((o) => o.label.toLocaleLowerCase().startsWith(q));
    return hit ? options.indexOf(hit) : -1;
  };

  // Focus stays on the combobox; the highlighted option is announced through
  // aria-activedescendant (WAI-ARIA select-only combobox pattern).
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const printable = e.key.length === 1 && e.key !== " " && !e.metaKey && !e.ctrlKey && !e.altKey;
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(selectedIndex >= 0 ? selectedIndex : e.key === "ArrowUp" ? options.length - 1 : 0);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        show(e.key === "Home" ? 0 : options.length - 1);
      } else if (printable) {
        const i = jumpTo(e.key, e.timeStamp);
        if (i >= 0) show(i);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
      case "PageUp":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
      case "PageDown":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        hide();
        break;
      case "Tab":
        hide(false);
        break;
      default:
        if (printable) {
          const i = jumpTo(e.key, e.timeStamp);
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div ref={wrapRef} className="relative mt-2">
      <div
        ref={buttonRef}
        id={id}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}-value`}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
        onClick={() => (open ? hide() : show(selectedIndex >= 0 ? selectedIndex : 0))}
        onKeyDown={onKey}
        className={`group flex min-h-13 w-full cursor-pointer select-none items-center gap-3 border bg-ink px-4 text-start text-[16px] transition-[border-color,box-shadow] duration-200 focus-visible:outline-none ${
          invalid ? "border-danger" : open ? "border-gold shadow-[0_0_0_3px_rgb(213_173_114/0.15)]" : "border-line-strong hover:border-gold-line focus-visible:border-gold"
        }`}
      >
        {icon ? <span className={`shrink-0 ${selected ? "text-gold" : "text-muted"}`}>{icon}</span> : null}
        <span id={`${id}-value`} className={`min-w-0 flex-1 truncate py-3 ${selected ? "text-bone" : "text-muted/80"}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-gold transition-transform duration-300 ease-[var(--ease-out)] ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </div>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        className={`absolute inset-x-0 z-30 max-h-72 overflow-y-auto overscroll-contain border border-gold-line bg-surface-2 p-1.5 shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)] transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-out)] focus:outline-none ${
          up ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
        } ${open ? "visible translate-y-0 scale-100 opacity-100" : `invisible pointer-events-none scale-[0.98] opacity-0 ${up ? "translate-y-1" : "-translate-y-1"}`}`}
      >
        {options.map((o, i) => {
          const isSelected = i === selectedIndex;
          const isActive = i === active;
          return (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={isSelected}
              onPointerMove={() => active !== i && setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-150 ${
                isActive ? "bg-gold/15 text-bone" : "text-bone/90"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className={`block text-[15px] ${isSelected ? "text-gold" : ""}`}>{o.label}</span>
                {o.hint ? <span className="mt-0.5 block text-[13px] text-muted">{o.hint}</span> : null}
              </span>
              <Check className={`size-4 shrink-0 text-gold transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} aria-hidden />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
