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
 * Patches one medication. Currently only the `is_active` toggle uses it.
 *
 * The response row is spliced into the cached list instead of
 * invalidating it, the same trade `useUpdateProfile` makes: PATCH
 * answers with the whole row, so a refetch would spend a round trip and
 * flash the whole list through a pending state just to move one card
 * between the "currently taking" and "no longer taking" sections.
 *
 * That shortcut holds only because nothing here can patch `start_date`,
 * which is what the list is sorted by. An edit form would have to
 * invalidate instead.
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
