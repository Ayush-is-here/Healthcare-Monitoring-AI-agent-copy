import {
  BLOOD_PRESSURE,
  DIASTOLIC,
  METRIC_BY_TYPE,
  METRIC_FORM_OPTIONS,
  SYSTOLIC,
  metricLabel,
  type HealthMetric,
} from "@/features/health-metrics/types";

export interface SinglePoint {
  value: number;
  recordedAt: string;
}

export interface PairedPoint {
  systolic: number | null;
  diastolic: number | null;
  recordedAt: string;
}

export interface SingleSeries {
  kind: "single";
  key: string;
  label: string;
  unit: string;
  /** Oldest first. */
  points: SinglePoint[];
}

export interface PairedSeries {
  kind: "paired";
  key: string;
  label: string;
  unit: string;
  /** Oldest first. */
  points: PairedPoint[];
}

export type MetricSeries = SingleSeries | PairedSeries;

/**
 * Systolic and diastolic rows folded back into one reading.
 *
 * They are stored separately so the backend can average each on its
 * own, and the form writes both with an identical `recorded_at` — so
 * that timestamp is what pairs them again. A half that has no partner
 * still appears, with the missing side left null.
 */
function pairBloodPressure(metrics: HealthMetric[]): PairedPoint[] {
  const byTimestamp = new Map<string, PairedPoint>();

  for (const metric of metrics) {
    if (metric.metric_type !== SYSTOLIC && metric.metric_type !== DIASTOLIC) {
      continue;
    }

    const point = byTimestamp.get(metric.recorded_at) ?? {
      systolic: null,
      diastolic: null,
      recordedAt: metric.recorded_at,
    };

    if (metric.metric_type === SYSTOLIC) {
      point.systolic = metric.value;
    } else {
      point.diastolic = metric.value;
    }

    byTimestamp.set(metric.recorded_at, point);
  }

  return [...byTimestamp.values()].sort((left, right) =>
    left.recordedAt.localeCompare(right.recordedAt),
  );
}

function singleSeries(
  metricType: string,
  metrics: HealthMetric[],
): SingleSeries | null {
  const rows = metrics.filter((metric) => metric.metric_type === metricType);

  if (rows.length === 0) return null;

  return {
    kind: "single",
    key: metricType,
    label: metricLabel(metricType),
    /* The registry is the intended unit; a row's own `unit` covers
       anything written by another client. */
    unit: METRIC_BY_TYPE[metricType]?.unit ?? rows.at(-1)?.unit ?? "",
    points: rows.map((row) => ({
      value: row.value,
      recordedAt: row.recorded_at,
    })),
  };
}

/**
 * One series per card, in a deliberate order.
 *
 * Blood pressure leads, then the registry's order, then anything the
 * API returned that this build does not know about — an unrecognised
 * metric type should still be visible rather than silently dropped.
 */
export function toMetricSeries(metrics: HealthMetric[]): MetricSeries[] {
  const series: MetricSeries[] = [];

  for (const option of METRIC_FORM_OPTIONS) {
    if (option.value === BLOOD_PRESSURE) {
      const points = pairBloodPressure(metrics);

      if (points.length > 0) {
        series.push({
          kind: "paired",
          key: BLOOD_PRESSURE,
          label: "Blood pressure",
          unit: METRIC_BY_TYPE[SYSTOLIC].unit,
          points,
        });
      }

      continue;
    }

    const single = singleSeries(option.value, metrics);
    if (single) series.push(single);
  }

  const known = new Set([
    ...METRIC_FORM_OPTIONS.map((option) => option.value),
    SYSTOLIC,
    DIASTOLIC,
  ]);

  for (const metricType of new Set(
    metrics
      .map((metric) => metric.metric_type)
      .filter((metricType) => !known.has(metricType)),
  )) {
    const single = singleSeries(metricType, metrics);
    if (single) series.push(single);
  }

  return series;
}

const readingFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

export function formatReading(value: number): string {
  return readingFormatter.format(value);
}

export interface Trend {
  direction: "up" | "down" | "flat";
  /** Absolute change against the previous reading. */
  delta: number;
}

export function toTrend(latest: number, previous: number): Trend {
  const delta = latest - previous;

  if (delta === 0) return { direction: "flat", delta: 0 };

  return { direction: delta > 0 ? "up" : "down", delta: Math.abs(delta) };
}

