import { z } from "zod";

import { toDateInputValue } from "@/lib/dates";

/* Mirrors AppointmentStatus in app/models/enum.py. Every row created
   over HTTP is `pending`: `status` is absent from both AppointmentCreate
   and AppointmentUpdate, both of which set `extra="forbid"`, and no
   worker touches the column. So `scheduled`, `completed` and
   `cancelled` are unreachable through the API — they are reachable in
   the database, which is the only reason they are labelled here. */
export const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Falls back to the wire value so a status we don't know still reads. */
export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/**
 * POST /appointments/ — request.
 *
 * `status` is absent on purpose: `AppointmentCreate` sets
 * `extra="forbid"`, so sending it is a 422. Optional keys are left
 * `undefined` rather than null so `JSON.stringify` drops them —
 * `location: ""` would be accepted and silently stored, then hidden by
 * every falsy check that renders it while still reaching the AI prompt
 * as a bare "Location:" line.
 */
export interface CreateAppointmentPayload {
  doctor_name: string;
  /** `YYYY-MM-DD`. A naive `Date` column — no offset, no conversion. */
  appointment_date: string;
  /** `HH:MM:SS`. A naive `Time` column, likewise. */
  appointment_time: string;
  purpose: string;
  location?: string;
  notes?: string;
}

/* No update payload: nothing patches this pass. PATCH /appointments/{id}
   exists, but a correction is delete-and-re-add, the same call the
   medications pass made. */

/**
 * GET /appointments/ — one row. No `patient_profile_id` is returned.
 *
 * `status` stays `z.string()` rather than an enum: an unknown value
 * would fail the whole array parse, and `statusLabel` already falls
 * back. Neither timestamp is ever rendered — both are naive
 * server-local strings with no offset, so the browser would read them
 * as local time and be wrong by the server's offset.
 */
export const appointmentSchema = z.object({
  id: z.string(),
  doctor_name: z.string(),
  appointment_date: z.string(),
  appointment_time: z.string(),
  purpose: z.string(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const appointmentListSchema = z.array(appointmentSchema);

export interface Now {
  /** `YYYY-MM-DD`, local. */
  today: string;
  /** `HH:MM:00`, local — seconds zeroed, see `isUpcoming`. */
  nowTime: string;
}

/**
 * The instant the Upcoming/Past line is drawn at.
 *
 * Both halves come from **one** Date, so they cannot straddle midnight.
 * That is the bug the backend's own `get_upcoming_appointments` has: it
 * calls `datetime.now()` twice (`appointment_repository.py:17-18`), so a
 * call at 23:59:59.999 can take the date from one day and the time from
 * the next, and drop or duplicate the boundary row.
 */
export function nowParts(now: Date = new Date()): Now {
  const pad = (part: number) => String(part).padStart(2, "0");

  return {
    today: toDateInputValue(now),
    /* Zero-padded to match the stored `HH:MM:SS` exactly. Unpadded
       hours would sort "9:05:00" after "14:30:00", filing every morning
       appointment behind every afternoon one. */
    nowTime: `${pad(now.getHours())}:${pad(now.getMinutes())}:00`,
  };
}

/**
 * Is this visit still to come?
 *
 * Compared as zero-padded strings, never as Dates: the columns are a
 * naive `Date` and a naive `Time` with no offset stored anywhere, so
 * the wall-clock values are the truth and building a Date from them
 * would invent a timezone. `nowTime` has its seconds zeroed, which puts
 * an appointment in the current minute under Upcoming — the right side
 * of the line for something you are about to attend. The backend
 * compares at full precision and would file it as past 1 second in.
 *
 * "Now" is the browser's local time, so a patient travelling is
 * classified against where they are rather than where the clinic is.
 * Unfixable while the schema stores no zone.
 */
export function isUpcoming(appointment: Appointment, now: Now): boolean {
  if (appointment.appointment_date !== now.today) {
    return appointment.appointment_date > now.today;
  }

  return appointment.appointment_time >= now.nowTime;
}

