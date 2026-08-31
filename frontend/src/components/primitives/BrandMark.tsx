import { cn } from "@/lib/utils";
import { APP_NAME } from "@/config/env";

export interface BrandMarkProps {
  className?: string;
  /** Hide the wordmark and render the glyph alone. */
  glyphOnly?: boolean;
}

/**
 * Wordmark.
 *
 * The glyph is an open ring with a dot resting in the gap — an aura
 * around a single point, which is what the name means and roughly what
 * the app does. It replaced a pulse stroke inside a black rounded
 * square, for two reasons: that square is the house style of every
 * other SaaS logo of the last five years, and the waveform inside it
 * was the same one lucide ships as `Activity`, which this very header
 * already uses for Readings — the brand and a nav item were wearing
 * the same glyph.
 *
 * Drawn here rather than imported, and drawn as three arcs of one
 * circle rather than a single stroke so the ring can carry a taper.
 * There is no tile, so the mark is ink on paper like everything else on
 * the page and stops competing with the avatar disc at the far end of
 * the bar for "the solid dark circle".
 */
export function BrandMark({ className, glyphOnly = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* `shrink-0`: at 375px this sits in a row with four nav glyphs,
          the avatar and sign out, and a squashed logo is worse than a
          scrollbar — it would be silently off-brand. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="size-7 shrink-0 text-ink"
      >
        {/* Three arcs, one circle: r=9 about (12,12), running
            anticlockwise from the gap and tapering 1.4 → 2.5 → 1.4 so
            the weight gathers at the bottom. A ring of even weight
            reads as a loading spinner; a weighted one reads as light.
            The round caps overlap at each join, so the changes in width
            land as a swell rather than two notches. */}
        <path
          d="M9.67 3.31A9 9 0 0 0 3.84 15.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M3.84 15.8A9 9 0 0 0 20.16 15.8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20.16 15.8A9 9 0 0 0 19.37 6.84"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* On the ring's own path, dead centre of the 70° gap. The gap
            sits at one o'clock and not at three: facing the wordmark it
            turned the ring into a letter, and the bar read "C Aurea".
            Filled, because at 28px an outlined dot closes into a
            smudge. */}
        <circle cx="15.08" cy="3.54" r="1.75" fill="currentColor" />
      </svg>

      {glyphOnly ? (
        <span className="sr-only">{APP_NAME}</span>
      ) : (
        <span className="font-display text-[1.0625rem] font-semibold tracking-[0.01em] text-ink">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
