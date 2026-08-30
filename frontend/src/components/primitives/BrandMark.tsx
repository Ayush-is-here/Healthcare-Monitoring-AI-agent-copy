import { cn } from "@/lib/utils";
import { APP_NAME } from "@/config/env";

export interface BrandMarkProps {
  className?: string;
  /** Hide the wordmark and render the glyph alone. */
  glyphOnly?: boolean;
  inverted?: boolean;
}

/**
 * Wordmark. The glyph is a rounded square holding a single
 * pulse stroke — the only piece of iconography the brand owns.
 */
export function BrandMark({
  className,
  glyphOnly = false,
  inverted = false,
}: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid size-8 place-items-center rounded-[10px]",
          inverted ? "bg-white" : "bg-ink",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn("size-4", inverted ? "text-ink" : "text-white")}
        >
          <path
            d="M2 12.5h4.2l2.1-5.4 3.1 10.3 2.4-6.3 1.7 3.4H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {glyphOnly ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <span
          className={cn(
            "font-display text-[1.0625rem] font-semibold tracking-[0.01em]",
            inverted ? "text-white" : "text-ink",
          )}
        >
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
