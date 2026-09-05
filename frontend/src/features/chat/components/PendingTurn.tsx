import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";

/**
 * Waiting state for a generation.
 *
 * The endpoint does not stream, so there is no real progress to
 * report. This shows what the run involves and how long it has been
 * going, rather than animating a progress bar that means nothing.
 */
export interface PendingTurnProps {
  /** Heading for the waiting card. Defaults to the insight copy. */
  title?: string;
  /** Sub-caption. When omitted, the insight two-stage copy is used. */
  hint?: string;
}

export function PendingTurn({
  title = "Reviewing your record",
  hint,
}: PendingTurnProps) {
  const seconds = useElapsedSeconds(true);

  const resolvedHint =
    hint ??
    (seconds < 20
      ? "Metrics, medications and appointments are checked against clinical literature. This usually takes a few seconds."
      : "Still working — external clinical sources can be slow to respond.");

  return (
    <SurfaceCard
      padding="roomy"
      className="animate-rise-in flex flex-col gap-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="animate-pulse-dot size-1.5 rounded-pill bg-ink"
              style={{ animationDelay: `${index * 0.18}s` }}
            />
          ))}
        </span>

        <p className="type-body-sm font-medium text-graphite">{title}</p>

        <span className="type-caption ml-auto tabular-nums text-stone">
          {seconds}s
        </span>
      </div>

      <div aria-hidden className="flex flex-col gap-2.5">
        {[100, 92, 74].map((width) => (
          <span
            key={width}
            className="h-2.5 rounded-pill bg-paper"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>

      <p className="type-caption text-stone">{resolvedHint}</p>
    </SurfaceCard>
  );
}
