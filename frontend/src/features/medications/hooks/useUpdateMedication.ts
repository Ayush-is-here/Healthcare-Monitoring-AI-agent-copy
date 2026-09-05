import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMedication } from "@/features/medications/api/medicationsApi";
import { MEDICATIONS_QUERY_KEY } from "@/features/medications/hooks/useMedications";
import type {
  Medication,
  UpdateMedicationPayload,
} from "@/features/medications/types";
import { toApiError, type ApiError } from "@/lib/http";

export interface UpdateMedicationVariables {
  medicationId: string;
  patch: UpdateMedicationPayload;
}

/**
 * Patches one medication — the "no longer taking" toggle and the edit
 * form both go through here.
 *
 * The response row is spliced into the cached list instead of
 * invalidating it, the same trade `useUpdateProfile` makes: PATCH
 * answers with the whole row, so a refetch would spend a round trip and
 * flash the list through a pending state just to move one card.
 *
 * Splicing is enough even when the edit form changes `start_date` or the
 * toggle flips `is_active`: `MedicationsView` re-partitions the two
 * sections and `MedicationList` re-sorts on every render, both from this
 * cache, so replacing the row re-places its card without a fetch.
 */
export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation<Medication, ApiError, UpdateMedicationVariables>({
    mutationFn: async ({ medicationId, patch }) => {
      try {
        return await updateMedication(medicationId, patch);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        MEDICATIONS_QUERY_KEY,
        (current: Medication[] | undefined) =>
          current?.map((medication) =>
            medication.id === updated.id ? updated : medication,
          ),
      );
    },
  });
}
