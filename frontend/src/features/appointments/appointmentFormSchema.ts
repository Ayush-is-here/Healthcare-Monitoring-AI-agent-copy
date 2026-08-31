import { z } from "zod";

import type { CreateAppointmentPayload } from "@/features/appointments/types";
import {
  CLOCK_TIME,
  ISO_DATE,
  toDateInputValue,
  toWholeMinuteTime,
} from "@/lib/dates";

/* The text columns are unbounded `sa.String()` server-side, so these
   caps are ours alone — another client could write longer, which is why
   the row renders defensively as well as capping here. */
const NAME_MAX = 120;
const PURPOSE_MAX = 200;
const LOCATION_MAX = 200;
const NOTES_MAX = 2000;

/**
 * The record-an-appointment form.
 *
 * These rules are the only field-level feedback that exists: the backend
 * has no validators at all, and every 422 it raises is the literal
 * string "Validation failed" with no indication of which field was
 * wrong. So the aim is that a 422 is unreachable in practice.
 *
 * The required text is checked **trimmed**, in `superRefine` rather than
 * through `min(1)` on the raw string: `toAppointmentPayload` trims on
 * the way out, so an untrimmed check would let "   " through and write
 * an empty required field. With no PATCH this pass, a blank
 * `doctor_name` is a row that can only be repaired by deleting it.
 */
export const appointmentFormSchema = z
  .object({
    doctor_name: z.string().max(NAME_MAX, "That name is too long"),
    appointment_date: z
      .string()
      .min(1, "Enter the date of the visit")
      .regex(ISO_DATE, "Enter a valid date"),
    appointment_time: z
      .string()
      .min(1, "Pick a time")
      .regex(CLOCK_TIME, "Enter a valid time"),
    purpose: z.string().max(PURPOSE_MAX, "That's too long — put detail in Notes"),
    location: z.string().max(LOCATION_MAX, "That's too long"),
    notes: z.string().max(NOTES_MAX, "That's too long"),
  })
  .superRefine((form, ctx) => {
    if (form.doctor_name.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Enter who the visit is with",
        path: ["doctor_name"],
      });
    }

    if (form.purpose.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Enter what the visit is for",
        path: ["purpose"],
      });
    }
  });

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/* No past-date rule. Recording a visit you already had is legitimate —
   `health_context_service` feeds the whole history into the AI prompt,
   past visits included — so a hard error here would reject correct
   data. The form shows a non-blocking note instead. */
export const PAST_DATE_HINT =
  "That's in the past — it'll be saved under Past visits.";

export function emptyAppointmentForm(
  now: Date = new Date(),
): AppointmentFormValues {
  return {
    doctor_name: "",
    appointment_date: toDateInputValue(now),
    /* Blank, not the current clock: defaulting the time to "now" would
       be actively wrong for a visit that hasn't happened. */
    appointment_time: "",
    purpose: "",
    location: "",
    notes: "",
  };
}

/**
 * The row a submission writes.
 *
 * Built field by field rather than by spreading `values`: the form's
 * shape and the API's are not the same thing, and `AppointmentCreate`
 * sets `extra="forbid"`, so any leaked key is an opaque 422. The date
 * passes through verbatim — a `date` input already yields `YYYY-MM-DD`,
 * and `toISOString()` would shift the day across a timezone boundary.
 * Blank optionals stay `undefined` so `JSON.stringify` drops the keys
 * instead of sending `""`, which the backend would accept and store.
 */
export function toAppointmentPayload(
  values: AppointmentFormValues,
): CreateAppointmentPayload {
  const location = values.location.trim();
  const notes = values.notes.trim();

  return {
    doctor_name: values.doctor_name.trim(),
    appointment_date: values.appointment_date,
    appointment_time: toWholeMinuteTime(values.appointment_time),
    purpose: values.purpose.trim(),
    location: location.length > 0 ? location : undefined,
    notes: notes.length > 0 ? notes : undefined,
  };
}

export const FIELD_MAX = {
  doctor_name: NAME_MAX,
  purpose: PURPOSE_MAX,
  location: LOCATION_MAX,
  notes: NOTES_MAX,
} as const;
