import { z } from "zod";

/* Mirrors MedicationFrequency / DosageUnit in app/models/enum.py.
   `value` is the wire format; `label` is ours — what a patient should
   actually read. Nothing else is carried: an expected-dose count per
   frequency was considered and dropped, because `as_needed` has no
   schedule, a weekly dose has one time for seven days, and the backend
   enforces no relationship between frequency and reminder count. A
   warning that fires on correct data is worse than no warning. */

export const FREQUENCIES = [
  { value: "once_daily", label: "Once a day" },
  { value: "twice_daily", label: "Twice a day" },
  { value: "three_times_daily", label: "Three times a day" },
  { value: "four_times_daily", label: "Four times a day" },
  { value: "every_other_day", label: "Every other day" },
  { value: "weekly", label: "Once a week" },
  { value: "as_needed", label: "As needed" },
] as const;

export const DOSAGE_UNITS = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "ml", label: "ml" },
  { value: "tablet", label: "tablet" },
  { value: "capsule", label: "capsule" },
  { value: "drop", label: "drop" },
  { value: "puff", label: "puff" },
  { value: "unit", label: "unit" },
] as const;

export const FREQUENCY_BY_VALUE: Record<string, { label: string }> =
  Object.fromEntries(FREQUENCIES.map((entry) => [entry.value, entry]));

/** Falls back to the wire value so an enum we don't know still reads. */
export function frequencyLabel(frequency: string): string {
  return FREQUENCY_BY_VALUE[frequency]?.label ?? frequency;
}

/* Doses are not integers — 0.125 mg is a real prescription — and they
   are not readings either, so `formatReading` is deliberately not
   reused: it rounds to one decimal, which would show that dose as
   `0.1`. */
const dosageFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

export function formatDosage(dosage: number, unit: string): string {
  return `${dosageFormatter.format(dosage)} ${unit}`;
}

/**
 * POST /medications/ — request.
 *
 * `is_active` is absent on purpose: `MedicationCreate` sets
 * `extra="forbid"`, so sending it is a 422. Optional keys are left
 * `undefined` rather than null so `JSON.stringify` drops them.
 */
export interface CreateMedicationPayload {
  medicine_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  instructions?: string;
  start_date: string;
  end_date?: string;
}

/**
 * PATCH /medications/{id} — request.
 *
 * Its own interface rather than `Partial<CreateMedicationPayload>`:
 * `is_active` is forbidden on create and allowed here, so the two
 * shapes are not related by `Partial`.
 *
 * Only `instructions` and `end_date` may be explicitly null. Every
 * other column is NOT NULL and the repository writes the value
 * straight through, so an explicit null reaches the database and
 * comes back a 500 rather than a 422.
 */
export interface UpdateMedicationPayload {
  medicine_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency?: string;
  instructions?: string | null;
  start_date?: string;
  end_date?: string | null;
  is_active?: boolean;
}

/** GET /medications/ — one row. No `patient_profile_id` is returned. */
export const medicationSchema = z.object({
  id: z.string(),
  medicine_name: z.string(),
  dosage: z.number(),
  dosage_unit: z.string(),
  frequency: z.string(),
  instructions: z.string().nullable().optional(),
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Medication = z.infer<typeof medicationSchema>;

export const medicationListSchema = z.array(medicationSchema);

/** POST /medication-reminders/ — request. */
export interface CreateMedicationReminderPayload {
  medication_id: string;
  /** `HH:MM:SS`. The worker only matches whole minutes, so seconds are `00`. */
  reminder_time: string;
}

/** GET /medication-reminders/{medication_id}/reminders — one row. */
export const medicationReminderSchema = z.object({
  id: z.string(),
  medication_id: z.string(),
  reminder_time: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MedicationReminder = z.infer<typeof medicationReminderSchema>;

export const medicationReminderListSchema = z.array(medicationReminderSchema);
