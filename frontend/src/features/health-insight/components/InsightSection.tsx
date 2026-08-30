import { cn } from "@/lib/utils";

export interface InsightSectionProps {
  eyebrow: string;
  items: string[];
  /** Tint reserved for the risk block. Everything else stays monochrome. */
  tone?: "neutral" | "caution";
  emptyLabel?: string;
}

/**
 * One titled block of an insight. Items are separated by hairlines
 * and indexed with a quiet numeral rather than a bullet glyph.
 */
export function InsightSection({
  eyebrow,
  items,
  tone = "neutral",
  emptyLabel = "Nothing noted.",
}: InsightSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-3">
        <h3
          className={cn(
            "type-eyebrow",
            tone === "caution" ? "text-caution" : "text-stone",
          )}
        >
          {eyebrow}
        </h3>
        <span
          aria-hidden
          className={cn(
            "h-px flex-1",
            tone === "caution" ? "bg-caution/20" : "bg-silver",
          )}
        />
      </header>

      {items.length === 0 ? (
        <p className="type-body-sm text-stone italic">{emptyLabel}</p>
      ) : (
        <ol className="flex flex-col">
          {items.map((item, index) => (
            <li
              key={`${eyebrow}-${index}`}
              className={cn(
                "flex gap-3.5 py-2.5",
                index > 0 && "border-t border-silver/70",
              )}
            >
              <span
                aria-hidden
                className="type-caption w-4 shrink-0 pt-[3px] text-right tabular-nums text-stone"
              >
                {index + 1}
              </span>
              <p className="type-body text-graphite">{item}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
