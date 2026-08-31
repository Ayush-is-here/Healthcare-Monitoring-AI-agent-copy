import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAppointment } from "@/features/appointments/api/appointmentsApi";
import { APPOINTMENTS_QUERY_KEY } from "@/features/appointments/hooks/useAppointments";
import type {
  Appointment,
  CreateAppointmentPayload,
} from "@/features/appointments/types";
import { toApiError, type ApiError } from "@/lib/http";

/** Records an appointment. The list is ordered server-side, so refetch. */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<Appointment, ApiError, CreateAppointmentPayload>({
    mutationFn: async (payload) => {
      try {
        return await createAppointment(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    /* `onSuccess`, not `onSettled`: a failed write leaves the cache
       already correct, so there is nothing to reconcile. */
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
