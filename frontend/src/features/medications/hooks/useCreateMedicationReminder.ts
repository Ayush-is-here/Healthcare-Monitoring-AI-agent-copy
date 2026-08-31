import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMedicationReminder } from "@/features/medications/api/medicationRemindersApi";
import { medicationRemindersQueryKey } from "@/features/medications/hooks/useMedicationReminders";
import type {
  CreateMedicationReminderPayload,
  MedicationReminder,
} from "@/features/medications/types";
import { toApiError, type ApiError } from "@/lib/http";

/**
 * Adds one reminder time to a medication.
 *
 * Only that medication's reminder list is invalidated — a new time does
 * not change the medication row, so refetching the whole list would be
 * waste. The key comes from the response rather than from the variables
 * because the response is the authoritative answer to which medication
 * the row landed on.
 */
export function useCreateMedicationReminder() {
  const queryClient = useQueryClient();

  return useMutation<
    MedicationReminder,
    ApiError,
    CreateMedicationReminderPayload
  >({
    mutationFn: async (payload) => {
      try {
        return await createMedicationReminder(payload);
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
