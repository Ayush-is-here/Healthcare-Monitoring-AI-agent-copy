import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppointmentRow } from "@/features/appointments/components/AppointmentRow";
import { useDeleteAppointment } from "@/features/appointments/hooks/useDeleteAppointment";
import type { Appointment } from "@/features/appointments/types";

export interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
  /** `asc` for Upcoming — soonest first; `desc` for Past. */
  direction: "asc" | "desc";
  /** Reduced emphasis on every row in the section. */
  past?: boolean;
  footnote?: ReactNode;
}

/**
 * One section of the appointments page.
 *
 * It owns the sort because the API orders on
 * `appointment_date, appointment_time` with **no** tiebreak
 * (`appointment_repository.py:103`), so two visits in the same slot can
 * swap places between refetches. `created_at` settles it meaningfully —
 * whichever was recorded first — and `id` catches the same-second case,
 * since `created_at` comes from `datetime.now()` in Python rather than
 * the database.
 *
 * The delete mutation and the confirm state live here rather than in the
 * row, the way `MetricLogTable` holds them: one observer per section,
 * and only one row mid-confirm at a time. A `confirmingId` left pointing
 * at a deleted row is inert, so nothing has to reset it.
 */
export function AppointmentList({
  title,
  appointments,
  direction,
  past = false,
  footnote,
}: AppointmentListProps) {
  const deleteAppointment = useDeleteAppointment();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const sign = direction === "asc" ? 1 : -1;

  const ordered = [...appointments].sort((left, right) => {
    const leftMoment = `${left.appointment_date}T${left.appointment_time}`;
    const rightMoment = `${right.appointment_date}T${right.appointment_time}`;

    if (leftMoment !== rightMoment) {
      return sign * leftMoment.localeCompare(rightMoment);
    }

    if (left.created_at !== right.created_at) {
      return left.created_at.localeCompare(right.created_at);
    }

    return left.id.localeCompare(right.id);
  });

  const onDelete = (appointment: Appointment) => {
    if (confirmingId !== appointment.id) {
      setConfirmingId(appointment.id);
      return;
    }

    setConfirmingId(null);

    deleteAppointment.mutate(appointment.id, {
      onSuccess: () =>
        toast.success(`Appointment with ${appointment.doctor_name} deleted.`),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="type-heading-sm text-ink">{title}</h2>

      <ul className="flex flex-col gap-3">
        {ordered.map((appointment) => (
          <li key={appointment.id}>
            <AppointmentRow
              appointment={appointment}
              past={past}
              confirming={confirmingId === appointment.id}
              deleting={
                deleteAppointment.isPending &&
                deleteAppointment.variables === appointment.id
              }
              onDelete={() => onDelete(appointment)}
              onCancelConfirm={() => setConfirmingId(null)}
            />
          </li>
        ))}
      </ul>

      {footnote ? (
        <p className="type-caption text-stone">{footnote}</p>
      ) : null}
    </section>
  );
}
