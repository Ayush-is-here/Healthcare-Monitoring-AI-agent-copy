import { z } from "zod";

import type {
  CreateMedicationPayload,
  Medication,
  UpdateMedicationPayload,
} from "@/features/medications/types";
import {
  CLOCK_TIME,
  ISO_DATE,
  isOnOrAfter,
  toDateInputValue,
} from "@/lib/dates";

/**
 * The add-a-medication form.
 *
 * Number and date inputs hand back strings, so bounds run on the parsed
 * value and the cast happens in the payload mapper — the same approach
 * as `metricFormSchema`. These rules are the only field-level feedback
 * that exists: every 422 from this API is the literal string
 * "Validation failed", with no indication of which field was wrong.
 */
export const medicationFormSchema = z
  .object({
    medicine_name: z.string().min(1, "Enter the medicine's name"),
    dosage: z.string().min(1, "Enter the dose"),
    /* Plain strings rather than enums, so the unselected `""` default
       is representable — same as the profile selects. */
    dosage_unit: z.string().min(1, "Select a unit"),
    frequency: z.string().min(1, "Select how often it's taken"),
    start_date: z
      .string()
      .min(1, "Enter when this course started")
      .regex(ISO_DATE, "Enter a valid date"),
    /* No upper bound. Starting a course tomorrow is normal, unlike a
       health reading, which cannot be in the future. */
    end_date: z.string(),
    instructions: z.string(),
  })
  .superRefine((form, ctx) => {
    const dosage = Number(form.dosage);

    if (Number.isNaN(dosage)) {
      ctx.addIssue({ code: "custom", message: "Enter a number", path: ["dosage"] });
    } else if (dosage <= 0) {
      /* The backend accepts 0 and negatives, which is meaningless for
         a dose, so this is the only thing stopping one. */
      ctx.addIssue({
        code: "custom",
        message: "Enter a dose greater than zero",
        path: ["dosage"],
      });
    }

    if (form.end_date.length === 0) return;

    if (!ISO_DATE.test(form.end_date)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid date",
        path: ["end_date"],
      });
      return;
    }

    /* The backend has no such validator — nothing server-side would
       reject a course that ends before it starts. */
    if (
      ISO_DATE.test(form.start_date) &&
      !isOnOrAfter(form.end_date, form.start_date)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "The end date cannot be before the start date",
        path: ["end_date"],
      });
    }
  });

export type MedicationFormValues = z.infer<typeof medicationFormSchema>;

export function emptyMedicationForm(
  now: Date = new Date(),
): MedicationFormValues {
  return {
    medicine_name: "",
    dosage: "",
    dosage_unit: "",
    frequency: "",
    start_date: toDateInputValue(now),
    end_date: "",
    instructions: "",
  };
}

/**
 * The row a submission writes.
 *
 * Built field by field rather than by spreading `values`: the form's
 * shape and the API's are not the same thing, and `MedicationCreate`
 * sets `extra="forbid"`, so any leaked key is a 422. Both dates go
 * through verbatim — a `date` input already yields `YYYY-MM-DD`, and
 * `toISOString()` would shift the day across a timezone boundary.
 * Blank optionals stay `undefined` so `JSON.stringify` drops the keys
 * instead of sending `""`.
 */
export function toMedicationPayload(
  values: MedicationFormValues,
): CreateMedicationPayload {
  const instructions = values.instructions.trim();

  return {
    medicine_name: values.medicine_name.trim(),
    dosage: Number(values.dosage),
    dosage_unit: values.dosage_unit,
    frequency: values.frequency,
    start_date: values.start_date,
    end_date: values.end_date.length > 0 ? values.end_date : undefined,
    instructions: instructions.length > 0 ? instructions : undefined,
  };
}

/**
 * A saved row, as the edit form's fields.
 *
 * The API returns `start_date`/`end_date` as `YYYY-MM-DD` already — the
 * shape a date input wants — so both pass straight through; a missing
 * `end_date` becomes the empty string the form reads as "no end". The
 * dose is a number on the row and a string in the field, so it is cast
 * here and back in `toMedicationUpdatePayload`. The mirror of
 * `emptyMedicationForm`, for editing rather than adding.
 */
export function medicationToFormValues(
  medication: Medication,
): MedicationFormValues {
  return {
    medicine_name: medication.medicine_name,
    dosage: String(medication.dosage),
    dosage_unit: medication.dosage_unit,
    frequency: medication.frequency,
    start_date: medication.start_date,
    end_date: medication.end_date ?? "",
    instructions: medication.instructions ?? "",
  };
}

/**
 * The keys an edit sends.
 *
 * A cleared optional goes as an explicit `null`, not dropped: the PATCH
 * is `exclude_unset`, so a dropped key leaves the column unchanged, and
 * clearing a field is meant to empty it. Only `instructions` and
 * `end_date` are nullable server-side; every other column is NOT NULL
 * and always carries a value here, so none can reach the database as a
 * null. `is_active` is absent on purpose — the "no longer taking" toggle
 * owns that flag, the same reason it is off the add form.
 */
export function toMedicationUpdatePayload(
  values: MedicationFormValues,
): UpdateMedicationPayload {
  const instructions = values.instructions.trim();

  return {
    medicine_name: values.medicine_name.trim(),
    dosage: Number(values.dosage),
    dosage_unit: values.dosage_unit,
    frequency: values.frequency,
    start_date: values.start_date,
    end_date: values.end_date.length > 0 ? values.end_date : null,
    instructions: instructions.length > 0 ? instructions : null,
  };
}

/** The add-a-reminder-time form. One field, so one schema. */
export const reminderFormSchema = z.object({
  reminder_time: z
    .string()
    .min(1, "Pick a time")
    .regex(CLOCK_TIME, "Enter a valid time"),
});

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;
