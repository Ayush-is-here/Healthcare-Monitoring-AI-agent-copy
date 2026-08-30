import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProfile } from "@/features/profile/api/profileApi";
import { PROFILE_QUERY_KEY } from "@/features/profile/hooks/useProfile";
import type {
  CreateProfilePayload,
  PatientProfile,
} from "@/features/profile/types";
import { toApiError, type ApiError } from "@/lib/http";

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation<PatientProfile, ApiError, CreateProfilePayload>({
    mutationFn: async (payload) => {
      try {
        return await createProfile(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (profile) => {
      /* Seed the cache directly — the gate reads this query, and a
         refetch round trip would flash the form again. */
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
}
