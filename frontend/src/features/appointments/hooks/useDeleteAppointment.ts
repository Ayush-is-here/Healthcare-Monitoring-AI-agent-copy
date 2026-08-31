import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAppointment } from "@/features/appointments/api/appointmentsApi";
import { APPOINTMENTS_QUERY_KEY } from "@/features/appointments/hooks/useAppointments";
import { toApiError, type ApiError } from "@/lib/http";

/**
 * Removes an appointment. The API answers with an envelope, not a row.
 *
 * Invalidate and nothing else: appointments own no child resource, so
 * there is no cache to remove alongside — the surgery
 * `useDeleteMedication` does for reminders has no counterpart here.
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: async (appointmentId) => {
      try {
        await deleteAppointment(appointmentId);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
