import { useCallback, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchCurrentUser } from "@/features/auth/api/authApi";
import {
  clearToken,
  readToken,
  subscribeToToken,
} from "@/features/auth/tokenStore";
import type { CurrentUser } from "@/features/auth/types";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

/** Reactive view of the stored access token. */
export function useAccessToken(): string | null {
  return useSyncExternalStore(subscribeToToken, readToken, () => null);
}

export interface Session {
  token: string | null;
  user: CurrentUser | undefined;
  isAuthenticated: boolean;
  isResolving: boolean;
  signOut: () => void;
}

/**
 * Single source of truth for "is there a usable session".
 *
 * A token that the API rejects is cleared by the response
 * interceptor, so `isAuthenticated` settles on the truth rather
 * than on the mere presence of a string in storage.
 */
export function useSession(): Session {
  const token = useAccessToken();
  const queryClient = useQueryClient();

  const { data: user, isPending } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled: token !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /* Drop every cached query alongside the token. Anything keyed only
     by resource name — the profile, the current user — belongs to the
     account that just left, and the next one to sign in on this page
     must not inherit it. */
  const signOut = useCallback(() => {
    clearToken();
    queryClient.clear();
  }, [queryClient]);

  return {
    token,
    user,
    isAuthenticated: token !== null,
    isResolving: token !== null && isPending,
    signOut,
  };
}
