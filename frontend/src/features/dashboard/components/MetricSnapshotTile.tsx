import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { formatIsoDateTime } from "@/lib/dates";

export interface MetricSnapshotTileProps {
  /** `null` for a metric type this build does not recognise. */
  icon: LucideIcon | null;
  label: string;
  /** The single most-recent reading — the headline. */
  value: number;
  unit: string;
  /** Mean of the last 7 days, or `null` for an empty window. */
  average7: number | null;
  /** Mean of the last 30 days, or `null` for an empty window. */
  average30: number | null;
  /** How the 7-day average sits against the 30-day one, as a percentage;
      `null` when the backend had no baseline to compare against. */
  changePercent: number | null;
  /** ISO datetime the reading was last taken, or `null`. */
  lastUpdated: string | null;
}

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

/** A window's mean, or an em dash when nothing was logged in it. */
function formatAverage(value: number | null): string {
  return value === null ? "—" : numberFormatter.format(value);
}

/**
 * The change chip is direction and magnitude only — never a colour.
 *
 * "Up" is good for steps and bad for glucose, so tinting it green or red
 * would be the tile inventing a clinical reading it has no business
 * making. Same rule the trend cards on Trends hold to.
 */
function ChangeChip({ percent }: { percent: number }) {
  const direction = percent > 0 ? "up" : percent < 0 ? "down" : "flat";
  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;
  const word = direction === "up" ? "up by" : direction === "down" ? "down by" : "";

  return (
    <Tag className="shrink-0">
      <Icon aria-hidden className="size-3" strokeWidth={2} />
      {/* The arrow is the only thing carrying direction on screen, and it
          is decorative — without this the chip reads as a bare number. */}
      <span className="sr-only">{word} </span>
      {direction === "flat"
        ? "No change"
        : `${numberFormatter.format(Math.abs(percent))}%`}
    </Tag>
  );
}

/**
 * One metric at a glance, built around the comparison its chip measures.
 *
 * The old tile showed a big `latest_value` beside a bare "vs 30-day avg"
 * percentage with neither average in sight — so the number and the chip
 * described different things and the card could not be read. This puts the
 * latest reading up top under its own label, then rules off a block naming
 * both averages, so the chip beneath them reads plainly as the 7-day mean
 * moving against the 30-day one and can be checked against the two numbers
 * right above it. No chart — the analytics endpoint returns values, not a
 * series (that is what Trends is for), and leaning on the averages instead
 * is also what keeps this from reading as a Trends card with its chart cut.
 */
export function MetricSnapshotTile({
  icon: Icon,
  label,
  value,
  unit,
  average7,
  average30,
  changePercent,
  lastUpdated,
}: MetricSnapshotTileProps) {
  const hasComparison =
    average7 !== null || average30 !== null || changePercent !== null;

  return (
    <SurfaceCard padding="tight" className="flex flex-col gap-4">
      <h3 className="type-eyebrow flex items-center gap-1.5 text-stone">
        {Icon ? (
          <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} />
        ) : null}
        {label}
      </h3>

      {/* The headline reading, labelled so it never reads as one of the
          averages below it — the confusion the old card left unresolved. */}
      <div className="flex flex-col gap-0.5">
        <p className="flex items-baseline gap-1.5">
          <span className="type-heading text-ink">
            {numberFormatter.format(value)}
          </span>
          <span className="type-body-sm text-slate">{unit}</span>
        </p>
        <p className="type-caption text-stone">
          {lastUpdated
            ? `Latest · ${formatIsoDateTime(lastUpdated)}`
            : "Latest reading"}
        </p>
      </div>

      {/* The comparison the chip actually measures: both averages named
          above, then the movement given its own labelled row — "7-day vs
          30-day ↑ 5%" — so the percentage says what it compares instead of
          floating unexplained in the corner, and can be checked against the
          two numbers right above it. */}
      {hasComparison ? (
        <dl className="type-body-sm flex flex-col gap-1.5 border-t border-hairline pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-stone">7-day avg</dt>
            <dd className="text-graphite">{formatAverage(average7)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-stone">30-day avg</dt>
            <dd className="text-graphite">{formatAverage(average30)}</dd>
          </div>
          {changePercent !== null ? (
            <div className="flex items-center justify-between gap-2 pt-1">
              <dt className="text-stone">7-day vs 30-day</dt>
              <dd>
                <ChangeChip percent={changePercent} />
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </SurfaceCard>
  );
}
