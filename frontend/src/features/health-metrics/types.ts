import { z } from "zod";

/* Mirrors MetricType / MetricSource in app/models/enum.py. `value` is
   the wire format; everything else is ours — labels a patient should
   actually read, the unit the API is told to store, and bounds so a
   fat-fingered entry is caught before a round trip. */

export interface MetricTypeMeta {
  /** `MetricType` wire value. */
  value: string;
  label: string;
  /** Sent as `unit`; never typed by the patient. */
  unit: string;
  min: number;
  max: number;
  step: string;
  placeholder: string;
}

export const METRIC_TYPES = [
  {
    value: "heart_rate",
    label: "Heart rate",
    unit: "bpm",
    min: 20,
    max: 250,
    step: "1",
    placeholder: "e.g. 72",
  },
  {
    value: "blood_pressure_systolic",
    label: "Systolic",
    unit: "mmHg",
    min: 50,
    max: 260,
    step: "1",
    placeholder: "e.g. 120",
  },
  {
    value: "blood_pressure_diastolic",
    label: "Diastolic",
    unit: "mmHg",
    min: 30,
    max: 200,
    step: "1",
    placeholder: "e.g. 80",
  },
  {
    value: "spo2",
    label: "Oxygen saturation",
    unit: "%",
    min: 50,
    max: 100,
    step: "1",
    placeholder: "e.g. 98",
  },
  {
    value: "body_temperature",
    label: "Body temperature",
    unit: "°C",
    min: 30,
    max: 45,
    step: "0.1",
    placeholder: "e.g. 36.8",
  },
  {
    value: "blood_glucose",
    label: "Blood glucose",
    unit: "mg/dL",
    min: 20,
    max: 600,
    step: "1",
    placeholder: "e.g. 95",
  },
  {
    value: "weight",
    label: "Weight",
    unit: "kg",
    min: 2,
    max: 500,
    step: "0.1",
    placeholder: "e.g. 68",
  },
  {
    value: "steps",
    label: "Steps",
    unit: "steps",
    min: 0,
    max: 100000,
    step: "1",
    placeholder: "e.g. 8400",
  },
  {
    value: "calories_burned",
    label: "Calories burned",
    unit: "kcal",
    min: 0,
    max: 20000,
    step: "1",
    placeholder: "e.g. 520",
  },
  {
    value: "sleep_duration",
    label: "Sleep",
    unit: "hours",
    min: 0,
    max: 24,
    step: "0.1",
    placeholder: "e.g. 7.5",
  },
] as const satisfies readonly MetricTypeMeta[];

export const METRIC_SOURCES = [
  { value: "manual", label: "Manual" },
  { value: "google_health", label: "Google Health" },
  { value: "fitbit", label: "Fitbit" },
] as const;

export const METRIC_BY_TYPE: Record<string, MetricTypeMeta> =
  Object.fromEntries(METRIC_TYPES.map((metric) => [metric.value, metric]));

export const SYSTOLIC = "blood_pressure_systolic";
export const DIASTOLIC = "blood_pressure_diastolic";

/**
 * The picker's own value for a blood-pressure entry.
 *
 * Deliberately NOT a `MetricType`: one reading is two rows, so the
 * form needs a selection the wire format has no name for.
 */
export const BLOOD_PRESSURE = "blood_pressure";

/**
 * What the type picker offers.
 *
 * The two `blood_pressure_*` wire values are excluded on purpose —
 * they are only ever written as a pair, so offering them singly would
 * let someone save half a reading.
 */
export const METRIC_FORM_OPTIONS = [
  { value: BLOOD_PRESSURE, label: "Blood pressure" },
  ...METRIC_TYPES.filter(
    (metric) => metric.value !== SYSTOLIC && metric.value !== DIASTOLIC,
  ).map((metric) => ({ value: metric.value, label: metric.label })),
] as const;

/**
 * POST /health-metrics/ — request.
 *
 * `recorded_at` is required here even though the server types it
 * optional: omitting it is a 500, because the column is NOT NULL with
 * no default and the repository splats the payload straight into the
 * model.
 */
export interface CreateMetricPayload {
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
}

/** PATCH /health-metrics/{id} — request. Not used yet. */
export type UpdateMetricPayload = Partial<CreateMetricPayload>;

/** GET /health-metrics/ — one row. */
export const healthMetricSchema = z.object({
  id: z.string(),
  patient_profile_id: z.string(),
  metric_type: z.string(),
  value: z.number(),
  unit: z.string().nullable().optional(),
  source: z.string(),
  recorded_at: z.string(),
  created_at: z.string(),
});

export type HealthMetric = z.infer<typeof healthMetricSchema>;

export const healthMetricListSchema = z.array(healthMetricSchema);

/** Falls back to the wire value so an enum we don't know still reads. */
export function metricLabel(metricType: string): string {
  return METRIC_BY_TYPE[metricType]?.label ?? metricType;
}

export function sourceLabel(source: string): string {
  return (
    METRIC_SOURCES.find((candidate) => candidate.value === source)?.label ??
    source
  );
}

