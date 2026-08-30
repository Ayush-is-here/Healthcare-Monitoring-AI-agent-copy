import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login, registerAccount } from "@/features/auth/api/authApi";
import { writeToken } from "@/features/auth/tokenStore";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useSession";
import type { RegisterCredentials } from "@/features/auth/types";
import { toApiError, type ApiError } from "@/lib/http";

/**
 * Creates the account and signs it in.
 *
 * `POST /auth/register` returns the user record, not a token, so the
 * login call is chained here rather than sending someone who just
 * typed their password back to a sign-in form to type it again.
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, RegisterCredentials>({
    mutationFn: async (credentials) => {
      try {
        await registerAccount(credentials);

        const { access_token } = await login({
          email: credentials.email,
          password: credentials.password,
        });

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
