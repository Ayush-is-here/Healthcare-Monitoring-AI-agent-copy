import { useQuery } from "@tanstack/react-query";

import { fetchProfile } from "@/features/profile/api/profileApi";
import { useAccessToken } from "@/features/auth/hooks/useSession";

export const PROFILE_QUERY_KEY = ["profile"] as const;

/**
 * The signed-in patient's profile, or null when they have not filled
 * one in yet. `isPending` while unresolved, so callers can hold off
 * on deciding whether to send someone to onboarding.
 */
export function useProfile() {
  const token = useAccessToken();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    enabled: token !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
