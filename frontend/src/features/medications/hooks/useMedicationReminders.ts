import { useQuery } from "@tanstack/react-query";

import { useAccessToken } from "@/features/auth/hooks/useSession";
import { fetchMedicationReminders } from "@/features/medications/api/medicationRemindersApi";

/* A root of its own, not a branch of `["medications"]` — see the note
   in `useMedications`. */
export const medicationRemindersQueryKey = (medicationId: string) =>
  ["medication-reminders", medicationId] as const;

/**
 * One medication's reminder times.
 *
 * The app's first dependent query: there is no list-all-reminders
 * route, so loading every medication's times up front would be a
 * request per row. Nothing is fetched until a row is expanded.
 */
export function useMedicationReminders(medicationId: string, enabled: boolean) {
  const token = useAccessToken();

  return useQuery({
    queryKey: medicationRemindersQueryKey(medicationId),
    queryFn: () => fetchMedicationReminders(medicationId),
    enabled: token !== null && enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
}
