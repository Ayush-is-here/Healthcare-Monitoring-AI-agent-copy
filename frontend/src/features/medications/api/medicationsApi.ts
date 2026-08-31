import { http, toApiError } from "@/lib/http";
import {
  medicationListSchema,
  medicationSchema,
  type CreateMedicationPayload,
  type Medication,
  type UpdateMedicationPayload,
} from "@/features/medications/types";

/**
 * GET /medications/
 *
 * Ordered `start_date DESC` with no tiebreak and no pagination, so the
 * list is re-sorted for display rather than trusted as it arrives.
 */
export async function fetchMedications(): Promise<Medication[]> {
  try {
    const { data } = await http.get("/medications/");
    return medicationListSchema.parse(data);
  } catch (error) {
    const apiError = toApiError(error);

    /* The service 404s when the account has no profile. `RequireProfile`
       makes that unreachable here, and "nothing recorded" is the honest
       translation of it in any case — the same call
       `fetchHealthMetrics` makes. */
    if (apiError.status === 404) return [];

    throw apiError;
  }
}

export async function createMedication(
  payload: CreateMedicationPayload,
): Promise<Medication> {
  const { data } = await http.post("/medications/", payload);
  return medicationSchema.parse(data);
}

/**
 * PATCH /medications/{id} — answers with the whole row.
 *
 * A true PATCH (`exclude_unset`), so only the keys sent are touched.
 * Never send an explicit null for anything but `instructions` or
 * `end_date`: every other column is NOT NULL, and the null reaches the
 * database and returns a 500.
 */
export async function updateMedication(
  medicationId: string,
  patch: UpdateMedicationPayload,
): Promise<Medication> {
  const { data } = await http.patch(`/medications/${medicationId}`, patch);
  return medicationSchema.parse(data);
}

/**
 * DELETE /medications/{id} — answers with an envelope, not a row.
 *
 * The delete cascades to the medication's reminders server-side.
 */
export async function deleteMedication(medicationId: string): Promise<void> {
  await http.delete(`/medications/${medicationId}`);
}
