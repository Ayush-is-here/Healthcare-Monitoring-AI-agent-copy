import { http } from "@/lib/http";
import {
  medicationReminderListSchema,
  medicationReminderSchema,
  type CreateMedicationReminderPayload,
  type MedicationReminder,
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

/* PATCH /medication-reminders/{id} is not wired. Nothing edits a saved
   time — delete-then-add covers a correction — and the reminder's own
   `is_active` flag is not exposed in the UI. */
