import { useQuery } from "@tanstack/react-query";

import { fetchAppointments } from "@/features/appointments/api/appointmentsApi";
import { useAccessToken } from "@/features/auth/hooks/useSession";

/* One root, unlike medications. Appointments own no child resource, so
   there is no sibling list a write here could needlessly refetch. */
export const APPOINTMENTS_QUERY_KEY = ["appointments"] as const;

/** Every appointment the signed-in patient has recorded. */
export function useAppointments() {
  const token = useAccessToken();

  return useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: fetchAppointments,
    enabled: token !== null,
    retry: false,
    staleTime: 60 * 1000,
  });
}
