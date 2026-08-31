import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import {
  MetricChart,
  type MetricChartSeries,
} from "@/features/health-metrics/components/MetricChart";
import { metricIcon } from "@/features/health-metrics/metricIcons";
import {
  formatReading,
  toTrend,
  type MetricSeries,
  type PairedSeries,
  type SingleSeries,
} from "@/features/health-metrics/metricSeries";
import { parseRecordedAt } from "@/features/health-metrics/metricFormSchema";

const stampFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const;

const trendWord = {
  up: "up by",
  down: "down by",
  flat: "",
} as const;

interface TrendInput {
  /** Set when a card carries more than one, so each is attributable. */
  label?: string;
  latest: number;
  previous: number;
}

/**
 * The trend chip is direction and size only — never a colour.
 *
 * "Up" is good for steps and meaningless for temperature, so tinting
 * it green or red would be the card inventing a clinical reading it
 * has no business making. Health Insight is where interpretation
 * lives.
 */
function TrendChip({ label, latest, previous }: TrendInput) {
  const { direction, delta } = toTrend(latest, previous);
  const Icon = trendIcon[direction];

  return (
    <Tag className="shrink-0">
      {label ? <span className="text-stone">{label}</span> : null}
      <Icon aria-hidden className="size-3" strokeWidth={2} />
      {/* The arrow is the only thing carrying direction on screen, and
          it is decorative — without this the chip reads as a bare
          number to a screen reader. */}
      <span className="sr-only">{trendWord[direction]} </span>
      {direction === "flat" ? "No change" : formatReading(delta)}
    </Tag>
  );
}

interface CardFrameProps {
  label: string;
  /** `null` for a metric type this build does not recognise. */
  icon: LucideIcon | null;
  reading: string;
  unit: string;
  recordedAt: string;
  count: number;
  trends: TrendInput[];
  chartLabels: string[];
  chartSeries: MetricChartSeries[];
  /** Blood pressure takes the full row: two lines need the width. */
  wide?: boolean;
}

function CardFrame({
  label,
  icon: Icon,
  reading,
  unit,
  recordedAt,
  count,
  trends,
  chartLabels,
  chartSeries,
  wide = false,
}: CardFrameProps) {
  const recorded = parseRecordedAt(recordedAt);

  return (
    <SurfaceCard
      padding="tight"
      className={`flex flex-col gap-3${wide ? " sm:col-span-2" : ""}`}
    >
      <header className="flex items-start justify-between gap-2">
        {/* The icon takes the label's own colour rather than the ink of
            the reading, so it reads as part of the heading instead of
            competing with the number below it. */}
        <h3 className="type-eyebrow flex items-center gap-1.5 text-stone">
          {Icon ? (
            <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} />
          ) : null}
          {label}
        </h3>

        {trends.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {trends.map((trend) => (
              <TrendChip key={trend.label ?? label} {...trend} />
            ))}
          </div>
        ) : null}
      </header>

      <p className="flex items-baseline gap-1.5">
        <span className="type-heading text-ink">{reading}</span>
        <span className="type-body-sm text-slate">{unit}</span>
      </p>

      <MetricChart
        labels={chartLabels}
        series={chartSeries}
        unit={unit}
        summary={`${label} history, ${count} ${
          count === 1 ? "reading" : "readings"
        }. Latest ${reading} ${unit}.`}
      />

      <footer className="type-caption flex flex-wrap items-center gap-x-1.5 text-stone">
        <time dateTime={recorded.toISOString()}>
          {stampFormatter.format(recorded)}
        </time>
        <span aria-hidden>·</span>
        <span>
          {count} {count === 1 ? "reading" : "readings"}
        </span>
      </footer>
    </SurfaceCard>
  );
}

function stamps(recordedAts: readonly string[]): string[] {
  return recordedAts.map((recordedAt) =>
    stampFormatter.format(parseRecordedAt(recordedAt)),
  );
}

function SingleCard({ series }: { series: SingleSeries }) {
  const latest = series.points.at(-1);
  const previous = series.points.at(-2);

  if (!latest) return null;

  return (
    <CardFrame
      label={series.label}
      icon={metricIcon(series.key)}
      reading={formatReading(latest.value)}
      unit={series.unit}
      recordedAt={latest.recordedAt}
      count={series.points.length}
      trends={
        previous ? [{ latest: latest.value, previous: previous.value }] : []
      }
      chartLabels={stamps(series.points.map((point) => point.recordedAt))}
      chartSeries={[
        {
          label: series.label,
          values: series.points.map((point) => point.value),
        },
      ]}
    />
  );
}

function PairedCard({ series }: { series: PairedSeries }) {
  const latest = series.points.at(-1);
  const previous = series.points.at(-2);

  if (!latest) return null;

  /* A half with no partner is shown as an em dash rather than hidden —
     the reading exists in the record, and pretending otherwise would
     make the log and the card disagree. */
  const half = (value: number | null) =>
    value === null ? "—" : formatReading(value);

  /* Both halves get their own chip. One unlabelled delta on a card
     headed "Blood pressure" would leave the reader guessing which of
     the two numbers had moved. */
  const trends: TrendInput[] = [];

  if (latest.systolic !== null && previous?.systolic != null) {
    trends.push({
      label: "Systolic",
      latest: latest.systolic,
      previous: previous.systolic,
    });
  }

  if (latest.diastolic !== null && previous?.diastolic != null) {
    trends.push({
      label: "Diastolic",
      latest: latest.diastolic,
      previous: previous.diastolic,
    });
  }

  return (
    <CardFrame
      wide
      label={series.label}
      icon={metricIcon(series.key)}
      reading={`${half(latest.systolic)}/${half(latest.diastolic)}`}
      unit={series.unit}
      recordedAt={latest.recordedAt}
      count={series.points.length}
      trends={trends}
      chartLabels={stamps(series.points.map((point) => point.recordedAt))}
      chartSeries={[
        {
          label: "Systolic",
          values: series.points.map((point) => point.systolic),
        },
        {
          label: "Diastolic",
          values: series.points.map((point) => point.diastolic),
        },
      ]}
    />
  );
}

/** Latest value, movement and history for one metric type. */
export function MetricTypeCard({ series }: { series: MetricSeries }) {
  return series.kind === "paired" ? (
    <PairedCard series={series} />
  ) : (
    <SingleCard series={series} />
  );
}
