/** Typographic stand-in for dishes without a photo (never a misleading image). */
export function DishTile({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-surface-2 p-4 text-center">
      <div>
        <span aria-hidden className="mx-auto mb-3 block h-px w-10 bg-gold" />
        <p className={`t-script text-gold ${compact ? "text-[22px]" : "text-[30px]"}`}>{name}</p>
        <span aria-hidden className="mx-auto mt-3 block h-px w-10 bg-gold" />
      </div>
    </div>
  );
}
