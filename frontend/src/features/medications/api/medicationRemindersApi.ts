import { http } from "@/lib/http";
import {
  medicationReminderListSchema,
  medicationReminderSchema,
  type CreateMedicationReminderPayload,
  type MedicationReminder,
  type UpdateMedicationReminderPayload,
} from "@/features/medications/types";

/**
 * GET /medication-reminders/{medication_id}/reminders
 *
 * `medication_id` is the medication's own PK. There is no
 * list-all-reminders route, so times can only be read one medication at
 * a time — which is why the UI loads them on expand.
 *
 * A 404 here is deliberately **not** translated to an empty list, unlike
 * the one on `/medications/`. On this route it means the medication was
 * not found — deleted in another tab — and a 403 means it belongs to
 * someone else. Either shown as "no reminders yet" would be an empty
 * panel for a row that no longer exists, so both are left to throw.
 */
export async function fetchMedicationReminders(
  medicationId: string,
): Promise<MedicationReminder[]> {
  const { data } = await http.get(
    `/medication-reminders/${medicationId}/reminders`,
  );
  return medicationReminderListSchema.parse(data);
}

export async function createMedicationReminder(
  payload: CreateMedicationReminderPayload,
): Promise<MedicationReminder> {
  const { data } = await http.post("/medication-reminders/", payload);
  return medicationReminderSchema.parse(data);
}

/**
 * DELETE /medication-reminders/{id} — answers with an envelope.
 *
 * The body carries no `medication_id`, so a caller that needs to key a
 * cache off it has to remember which medication it asked about.
 */
export async function deleteMedicationReminder(
  reminderId: string,
): Promise<void> {
  await http.delete(`/medication-reminders/${reminderId}`);
}

/**
 * PATCH /medication-reminders/{id} — answers with the whole row.
 *
 * A true PATCH server-side (`exclude_unset`); the caller decides which
 * keys are sent — see `ReminderTimeEditor`, which sends only
 * `reminder_time`. The response carries `medication_id`, so the cache
 * key can be read straight from it. A 404 means the reminder is gone and
 * a 403 that it is someone else's; both surface.
 */
export async function updateMedicationReminder(
  reminderId: string,
  patch: UpdateMedicationReminderPayload,
): Promise<MedicationReminder> {
  const { data } = await http.patch(
    `/medication-reminders/${reminderId}`,
    patch,
  );
  return medicationReminderSchema.parse(data);
}
