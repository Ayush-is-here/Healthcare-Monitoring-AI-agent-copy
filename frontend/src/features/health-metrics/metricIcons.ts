import {
  BedDouble,
  Droplet,
  Droplets,
  Flame,
  Footprints,
  Gauge,
  HeartPulse,
  Thermometer,
  Weight,
  type LucideIcon,
} from "lucide-react";

import {
  BLOOD_PRESSURE,
  DIASTOLIC,
  SYSTOLIC,
} from "@/features/health-metrics/types";

/* Kept out of `types.ts` deliberately: that module is the wire
   contract and the validation bounds, and nothing there should pull in
   a component. An icon is presentation, so it lives on its own.

   Keyed by wire value, plus the synthetic `blood_pressure` the paired
   card uses — `MetricSeries.key` is one or the other. */
const ICONS: Record<string, LucideIcon> = {
  [BLOOD_PRESSURE]: Gauge,
  [SYSTOLIC]: Gauge,
  [DIASTOLIC]: Gauge,
  heart_rate: HeartPulse,
  spo2: Droplets,
  body_temperature: Thermometer,
  blood_glucose: Droplet,
  weight: Weight,
  steps: Footprints,
  calories_burned: Flame,
  sleep_duration: BedDouble,
};

/**
 * The glyph for one metric type, or `null` for one this build does not
 * know about.
 *
 * Null rather than a generic fallback: a placeholder icon would imply
 * the app recognises a reading it cannot actually name, and the label
 * beside it already carries the meaning.
 */
export function metricIcon(key: string): LucideIcon | null {
  return ICONS[key] ?? null;
}
