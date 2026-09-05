import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAppointment } from "@/features/appointments/api/appointmentsApi";
import { APPOINTMENTS_QUERY_KEY } from "@/features/appointments/hooks/useAppointments";
import type {
  Appointment,
  UpdateAppointmentPayload,
} from "@/features/appointments/types";
import { toApiError, type ApiError } from "@/lib/http";

export interface UpdateAppointmentVariables {
  appointmentId: string;
  patch: UpdateAppointmentPayload;
}

/**
 * Patches one appointment.
 *
 * Invalidates rather than splicing the returned row into the cache — the
 * trade `useUpdateMedication` spelled out. An edit here can move
 * `appointment_date` or `appointment_time`, which is exactly what both
 * lists sort on and what the Upcoming/Past split is drawn from, so the
 * saved row may belong in a different place, or a different section, than
 * where it was. A refetch is the honest way to resettle it.
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<Appointment, ApiError, UpdateAppointmentVariables>({
    mutationFn: async ({ appointmentId, patch }) => {
      try {
        return await updateAppointment(appointmentId, patch);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
