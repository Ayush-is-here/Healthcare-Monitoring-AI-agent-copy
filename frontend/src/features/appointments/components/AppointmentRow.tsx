import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";

import { PillButton } from "@/components/primitives/PillButton";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
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
  /** Replaces the row with an inline edit form — one row at a time. */
  editing: boolean;
  onEdit: () => void;
  onDoneEdit: () => void;
}

/**
 * One visit, plus the two things you can do to it.
 *
 * Deliberately not a disclosure: `MedicationRow` is one only because it
 * owns a reminder panel it toggles. Editing here swaps the whole row for
 * the form in place rather than expanding beneath it, so there is still
 * no `aria-expanded` and no button-inside-button hazard — the edit form
 * simply takes the card over until it's dismissed.
 *
 * The confirm state and both mutations live above the row — delete and
 * its confirm in `AppointmentList`, the edit id in the view — the way
 * `MetricLogTable` holds them for its rows: one observer per section, and
 * only one row mid-confirm or mid-edit at a time.
 */
export function AppointmentRow({
  appointment,
  past,
  confirming,
  deleting,
  onDelete,
  onCancelConfirm,
  editing,
  onEdit,
  onDoneEdit,
}: AppointmentRowProps) {
  const { doctor_name, appointment_date, appointment_time } = appointment;

  /* In edit mode the card is given over to the form entirely — no
     details, no delete. `SurfaceCard` keeps the row's frame so nothing
     jumps as it swaps. `onDone` fires on both save and Cancel. */
  if (editing) {
    return (
      <SurfaceCard padding="tight" elevation="card">
        <AppointmentForm appointment={appointment} onDone={onDoneEdit} />
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard
      padding="tight"
      /* A past visit stays a card on the paper field but is plainly set
         apart from an upcoming one: a greyed paper-deep fill and a flat
         hairline shadow against the upcoming card's white face and
         lifted shadow, with quieter text on top — the same muting a
         stood-down medication gets. It keeps to shadow-and-fill rather
         than a border, and reads as distinctly muted, not identical. */
      elevation={past ? "hairline" : "card"}
      className={past ? "bg-paper-deep" : undefined}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* `min-w-0` on the whole chain, or `truncate` below silently
            stops working: both text columns are unbounded
            `sa.String()` server-side. */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <CalendarDays
            aria-hidden
            className={cn(
              "size-3.5 shrink-0",
              past ? "text-stone/70" : "text-stone",
            )}
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

        {/* Edit swaps the whole card for the form; delete destroys the
            record, which is why only that one asks first. There is still
            no cancel action — `status` is absent from both appointment
            schemas, so no endpoint can move a row to `cancelled`. */}
        <PillButton
          variant="quiet"
          size="sm"
          disabled={deleting}
          onClick={onEdit}
          aria-label={`Edit the appointment with ${doctor_name}`}
        >
          <Pencil aria-hidden className="size-3.5" strokeWidth={2} />
        </PillButton>

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
