import { useQuery } from "@tanstack/react-query";

import { useAccessToken } from "@/features/auth/hooks/useSession";
import { fetchMedications } from "@/features/medications/api/medicationsApi";

/* Reminders live under their own root, `["medication-reminders", id]`,
   rather than nested under this one. TanStack invalidates by prefix, so
   a nested key would make every medication write — create, toggle,
   delete — refetch whatever reminder list happened to be open, and
   adding one medication has nothing to do with another's schedule. */
export const MEDICATIONS_QUERY_KEY = ["medications"] as const;

/** Every medication the signed-in patient has recorded. */
export function useMedications() {
  const token = useAccessToken();

  return useQuery({
    queryKey: MEDICATIONS_QUERY_KEY,
    queryFn: fetchMedications,
    enabled: token !== null,
    retry: false,
    staleTime: 60 * 1000,
  });
}
