import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@/features/profile/api/profileApi";
import { PROFILE_QUERY_KEY } from "@/features/profile/hooks/useProfile";
import type {
  PatientProfile,
  UpdateProfilePayload,
} from "@/features/profile/types";
import { toApiError, type ApiError } from "@/lib/http";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<PatientProfile, ApiError, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      try {
        return await updateProfile(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (profile) => {
      /* PATCH answers with the whole row, so the cache can be seeded
         from the response instead of spending a refetch on it. */
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
}
