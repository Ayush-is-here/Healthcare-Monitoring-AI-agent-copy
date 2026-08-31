import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMedication } from "@/features/medications/api/medicationsApi";
import { MEDICATIONS_QUERY_KEY } from "@/features/medications/hooks/useMedications";
import type {
  CreateMedicationPayload,
  Medication,
} from "@/features/medications/types";
import { toApiError, type ApiError } from "@/lib/http";

/** Adds a medication. Server-side ordering means the list is refetched. */
export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation<Medication, ApiError, CreateMedicationPayload>({
    mutationFn: async (payload) => {
      try {
        return await createMedication(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MEDICATIONS_QUERY_KEY });
    },
  });
}
