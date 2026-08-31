import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMedicationReminder } from "@/features/medications/api/medicationRemindersApi";
import { medicationRemindersQueryKey } from "@/features/medications/hooks/useMedicationReminders";
import { toApiError, type ApiError } from "@/lib/http";

export interface DeleteMedicationReminderVariables {
  reminderId: string;
  /**
   * Which medication the time belonged to.
   *
   * Carried purely to key the invalidation: the DELETE body is a
   * success envelope, so unlike create there is no `medication_id` in
   * the response to read it from.
   */
  medicationId: string;
}

/** Removes one reminder time. */
export function useDeleteMedicationReminder() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, DeleteMedicationReminderVariables>({
    mutationFn: async ({ reminderId }) => {
      try {
        await deleteMedicationReminder(reminderId);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (_data, { medicationId }) => {
      void queryClient.invalidateQueries({
        queryKey: medicationRemindersQueryKey(medicationId),
      });
    },
  });
}
