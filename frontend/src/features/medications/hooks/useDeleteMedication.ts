import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMedication } from "@/features/medications/api/medicationsApi";
import { medicationRemindersQueryKey } from "@/features/medications/hooks/useMedicationReminders";
import { MEDICATIONS_QUERY_KEY } from "@/features/medications/hooks/useMedications";
import { toApiError, type ApiError } from "@/lib/http";

/** Removes a medication. The API answers with an envelope, not a row. */
export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: async (medicationId) => {
      try {
        await deleteMedication(medicationId);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (_data, medicationId) => {
      /* Removed, not invalidated. The delete cascades server-side, so
         the cached reminder list is not stale — it is gone, and
         invalidating would leave a corpse that 404s on its next
         refetch. */
      queryClient.removeQueries({
        queryKey: medicationRemindersQueryKey(medicationId),
      });

      void queryClient.invalidateQueries({ queryKey: MEDICATIONS_QUERY_KEY });
    },
  });
}
