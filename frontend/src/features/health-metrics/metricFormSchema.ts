import { z } from "zod";

import {
  BLOOD_PRESSURE,
  DIASTOLIC,
  METRIC_BY_TYPE,
  SYSTOLIC,
  type CreateMetricPayload,
} from "@/features/health-metrics/types";

/**
 * `recorded_at` as the wire wants it.
 *
 * The column is a naive `datetime` — no offset is stored — so the
 * local wall-clock reading is sent verbatim. `toISOString()` would
 * convert to UTC and store a reading at the wrong time of day.
 */
export function toNaiveIso(dateTimeLocal: string): string {
  /* A `datetime-local` input yields `YYYY-MM-DDTHH:mm`; some browsers
     append seconds already. */
  return dateTimeLocal.length === 16 ? `${dateTimeLocal}:00` : dateTimeLocal;
}

/** A Date as a `datetime-local` input value, in local time. */
export function toDateTimeInputValue(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

/**
 * A stored `recorded_at` as a Date.
 *
 * An offset-less date-time is parsed as local time per spec, which is
 * the mirror of how `toNaiveIso` writes it — so a reading displays at
 * the time it was entered.
 */
export function parseRecordedAt(recordedAt: string): Date {
  return new Date(recordedAt);
}

/* Number inputs hand back strings, so bounds are checked on the parsed
   value and the cast happens on the way out — same approach as
   `profileFormSchema`. Bounds are ours alone: `HealthMetricCreate`
   accepts any float, so this is the only thing standing between a
   typo and the record. */
function checkReading(
  ctx: z.RefinementCtx,
  path: "value" | "systolic" | "diastolic",
  raw: string,
  metricType: string,
) {
  const meta = METRIC_BY_TYPE[metricType];
  if (!meta) return;

  const fail = (message: string) =>
    ctx.addIssue({ code: "custom", message, path: [path] });

  if (raw.trim().length === 0) {
    fail(`Enter a ${meta.label.toLowerCase()} reading`);
    return;
  }

  const parsed = Number(raw);

  if (Number.isNaN(parsed)) {
    fail("Enter a number");
    return;
  }

  if (parsed < meta.min || parsed > meta.max) {
    fail(`Enter a value between ${meta.min} and ${meta.max} ${meta.unit}`);
  }
}

/**
 * One schema for every metric type.
 *
 * Which value fields are required depends on the selection, so the
 * per-field rules live in `superRefine` rather than on the fields:
 * blood pressure needs the pair, everything else needs the single.
 */
export const metricFormSchema = z
  .object({
    /* A plain string rather than the enum, so the unselected `""`
       default is representable — same as the profile selects. */
    metric_type: z.string().min(1, "Select what you measured"),
    value: z.string(),
    systolic: z.string(),
    diastolic: z.string(),
    recorded_at: z
      .string()
      .min(1, "Enter when this was recorded")
      .refine(
        (input) => !Number.isNaN(Date.parse(input)),
        "Enter a valid date and time",
      )
      .refine(
        (input) => new Date(input) <= new Date(),
        "A reading cannot be in the future",
      ),
  })
  .superRefine((form, ctx) => {
    if (form.metric_type === BLOOD_PRESSURE) {
      checkReading(ctx, "systolic", form.systolic, SYSTOLIC);
      checkReading(ctx, "diastolic", form.diastolic, DIASTOLIC);
      return;
    }

    if (form.metric_type) {
      checkReading(ctx, "value", form.value, form.metric_type);
    }
  });

export type MetricFormValues = z.infer<typeof metricFormSchema>;

export function emptyMetricForm(now: Date = new Date()): MetricFormValues {
  return {
    metric_type: "",
    value: "",
    systolic: "",
    diastolic: "",
    recorded_at: toDateTimeInputValue(now),
  };
}

/**
 * The rows a submission writes.
 *
 * Blood pressure becomes two rows sharing one identical `recorded_at`
 * — stored separately, as the schema intends, so the backend's
 * per-type averaging still works, but entered in a single pass.
 */
export function toMetricPayloads(
  values: MetricFormValues,
): CreateMetricPayload[] {
  const recorded_at = toNaiveIso(values.recorded_at);

  if (values.metric_type === BLOOD_PRESSURE) {
    return [
      {
        metric_type: SYSTOLIC,
        value: Number(values.systolic),
        unit: METRIC_BY_TYPE[SYSTOLIC].unit,
        recorded_at,
      },
      {
        metric_type: DIASTOLIC,
        value: Number(values.diastolic),
        unit: METRIC_BY_TYPE[DIASTOLIC].unit,
        recorded_at,
      },
    ];
  }

  return [
    {
      metric_type: values.metric_type,
      value: Number(values.value),
      unit: METRIC_BY_TYPE[values.metric_type].unit,
      recorded_at,
    },
  ];
}

