import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMedicationReminder } from "@/features/medications/api/medicationRemindersApi";
import { medicationRemindersQueryKey } from "@/features/medications/hooks/useMedicationReminders";
import type {
  MedicationReminder,
  UpdateMedicationReminderPayload,
} from "@/features/medications/types";
import { toApiError, type ApiError } from "@/lib/http";

export interface UpdateMedicationReminderVariables {
  reminderId: string;
  patch: UpdateMedicationReminderPayload;
}

/**
 * Patches one reminder time.
 *
 * Only that medication's reminder list is invalidated — an edited time
 * does not touch the medication row. The key comes from the response's
 * `medication_id` rather than the variables, the same authoritative
 * source `useCreateMedicationReminder` keys off; editing the time never
 * moves a reminder to another medication, so the two always agree, but
 * reading it from the row keeps the two hooks identical.
 */
export function useUpdateMedicationReminder() {
  const queryClient = useQueryClient();

  return useMutation<
    MedicationReminder,
    ApiError,
    UpdateMedicationReminderVariables
  >({
    mutationFn: async ({ reminderId, patch }) => {
      try {
        return await updateMedicationReminder(reminderId, patch);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (reminder) => {
      void queryClient.invalidateQueries({
        queryKey: medicationRemindersQueryKey(reminder.medication_id),
      });
    },
  });
}
