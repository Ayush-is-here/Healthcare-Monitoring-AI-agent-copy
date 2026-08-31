import { CalendarDays, MapPin, Trash2 } from "lucide-react";

import { PillButton } from "@/components/primitives/PillButton";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { statusLabel, type Appointment } from "@/features/appointments/types";
import { formatClockTime, formatIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface AppointmentRowProps {
  appointment: Appointment;
  /** Renders at reduced emphasis, the way a stood-down medication does. */
  past: boolean;
  confirming: boolean;
  deleting: boolean;
  onDelete: () => void;
  onCancelConfirm: () => void;
}

/**
 * One visit, plus the one thing you can do to it.
 *
 * Deliberately not a disclosure: `MedicationRow` is one only because it
 * owns a reminder panel, and nothing expands here. So there is no
 * `useId`, no `aria-expanded`, and no button-inside-button hazard — the
 * two-click delete confirm never depended on any of that.
 *
 * The confirm state and the mutation both live in `AppointmentList`, the
 * way `MetricLogTable` holds them for its rows: one mutation observer
 * for the whole section rather than one per row, and only one row can be
 * mid-confirm.
 */
export function AppointmentRow({
  appointment,
  past,
  confirming,
  deleting,
  onDelete,
  onCancelConfirm,
}: AppointmentRowProps) {
  const { doctor_name, appointment_date, appointment_time } = appointment;

  return (
    <SurfaceCard
      padding="tight"
      elevation={past ? "none" : "card"}
      className={cn(past && "border border-silver bg-paper/40")}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* `min-w-0` on the whole chain, or `truncate` below silently
            stops working: both text columns are unbounded
            `sa.String()` server-side. */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <CalendarDays
            aria-hidden
            className={cn("size-3.5 shrink-0", past ? "text-silver" : "text-stone")}
            strokeWidth={1.5}
          />

          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                "type-body-sm truncate font-medium",
                past ? "text-slate" : "text-graphite",
              )}
            >
              {doctor_name}
            </span>

            {/* The date and the time are one moment, so one `<time>`
                carries both. A `dateTime` of the date alone would throw
                the time away. */}
            <time
              dateTime={`${appointment_date}T${appointment_time}`}
              className="type-caption text-stone"
            >
              {formatIsoDate(appointment_date)} · {formatClockTime(appointment_time)}
            </time>
          </div>
        </div>

        {/* Every row created over HTTP is `pending`, so this never shows
            — a tag on all of them would carry no information. It exists
            so the page stops being wrong if the column is ever changed
            directly in the database, where a `cancelled` visit would
            otherwise sit under Upcoming looking live. */}
        {appointment.status === "pending" ? null : (
          <Tag>{statusLabel(appointment.status)}</Tag>
        )}

        {/* There is no cancel: `status` is absent from both appointment
            schemas, so no endpoint can move a row to `cancelled`. Delete
            destroys the record, which is why it asks first. */}
        <PillButton
          variant="quiet"
          size="sm"
          disabled={deleting}
          onClick={onDelete}
          onBlur={onCancelConfirm}
          aria-label={
            confirming
              ? `Confirm deleting the appointment with ${doctor_name}`
              : `Delete the appointment with ${doctor_name}`
          }
          className={confirming ? "text-critical" : undefined}
        >
          <Trash2 aria-hidden className="size-3.5" strokeWidth={2} />
          {confirming ? "Confirm" : null}
        </PillButton>
      </div>

      <p
        className={cn(
          "type-body-sm mt-3 break-words",
          past ? "text-slate" : "text-graphite",
        )}
      >
        {appointment.purpose}
      </p>

      {appointment.location ? (
        <p className="type-caption mt-1.5 flex items-start gap-1.5 text-stone">
          <MapPin
            aria-hidden
            className="mt-0.5 size-3 shrink-0"
            strokeWidth={1.5}
          />
          {/* `min-w-0` as well as `break-words`: as a flex item this span
              defaults to `min-width: auto`, which holds it at its
              max-content width, and an unbroken 400-character location
              then overflows the card no matter what wrapping says. */}
          <span className="min-w-0 break-words">{appointment.location}</span>
        </p>
      ) : null}

      {/* `break-words` rather than a line clamp: the column is unbounded
          and a pasted paragraph must not overflow the card, but hiding
          part of a medical note with no way to reveal it is worse than a
          tall card. */}
      {appointment.notes ? (
        <p className="type-body-sm mt-3 break-words text-slate">
          {appointment.notes}
        </p>
      ) : null}
    </SurfaceCard>
  );
}
