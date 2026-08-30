import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/auth/api/authApi";
import { writeToken } from "@/features/auth/tokenStore";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useSession";
import type { LoginCredentials } from "@/features/auth/types";
import { toApiError, type ApiError } from "@/lib/http";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      try {
        const { access_token } = await login(credentials);
        writeToken(access_token);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}
