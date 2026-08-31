import { http, toApiError } from "@/lib/http";
import {
  appointmentListSchema,
  appointmentSchema,
  type Appointment,
  type CreateAppointmentPayload,
} from "@/features/appointments/types";

/**
 * GET /appointments/
 *
 * No query parameters exist — no filter, no pagination, no date range —
 * so the whole history comes back every call. Ordered
 * `appointment_date ASC, appointment_time ASC` with no tiebreak, so the
 * list is re-sorted for display rather than trusted as it arrives.
 */
export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const { data } = await http.get("/appointments/");
    return appointmentListSchema.parse(data);
  } catch (error) {
    const apiError = toApiError(error);

    /* The service 404s when the account has no profile, and that is its
       only cause here. `RequireProfile` makes it unreachable, and
       "nothing recorded" is the honest translation of it in any case —
       the same call `fetchMedications` makes. A DELETE 404 means
       something else entirely and is never swallowed. */
    if (apiError.status === 404) return [];

    throw apiError;
  }
}

/** POST /appointments/ — the trailing slash matters; without it, a 307. */
export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await http.post("/appointments/", payload);
  return appointmentSchema.parse(data);
}

/**
 * DELETE /appointments/{id} — answers with an envelope, not a row.
 *
 * The body is not parsed: the route hardcodes `success: True` after the
 * service has either raised or succeeded, so there is no
 * `{success: false}` with a 200 to handle. 404 means the appointment
 * does not exist and 403 means it is someone else's; both must surface.
 */
export async function deleteAppointment(appointmentId: string): Promise<void> {
  await http.delete(`/appointments/${appointmentId}`);
}
