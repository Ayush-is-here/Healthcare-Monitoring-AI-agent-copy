import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import { useCreateMedicationReminder } from "@/features/medications/hooks/useCreateMedicationReminder";
import { useDeleteMedicationReminder } from "@/features/medications/hooks/useDeleteMedicationReminder";
import { useMedicationReminders } from "@/features/medications/hooks/useMedicationReminders";
import { useUpdateMedicationReminder } from "@/features/medications/hooks/useUpdateMedicationReminder";
import {
  reminderFormSchema,
  type ReminderFormValues,
} from "@/features/medications/medicationFormSchema";
import type { MedicationReminder } from "@/features/medications/types";
import { formatClockTime, toWholeMinuteTime } from "@/lib/dates";

export interface ReminderPanelProps {
  /** The medication's own PK, which the reminders route keys off. */
  medicationId: string;
  medicineName: string;
  /** Matches the `aria-controls` on the row's disclosure button. */
  id: string;
}

/**
 * One medication's reminder times.
 *
 * Rendered only while its row is expanded, so collapsing unmounts the
 * query observer rather than leaving a subscribed-but-hidden one behind.
 *
 * The copy says when a dose is due and stops there. Delivery runs
 * through Celery beat, Redis and Resend, none of which runs in this
 * environment, so a saved time is a stored intention — promising an
 * alert here would promise something the app cannot send. For the same
 * reason nothing claims that standing a medication down stops its
 * reminders: `get_due_medication_notifications` filters on the
 * reminder's own `is_active` and never checks the medication's, so a
 * deactivated medication's times still fire.
 */
export function ReminderPanel({
  medicationId,
  medicineName,
  id,
}: ReminderPanelProps) {
  const { data: reminders, isPending, error } = useMedicationReminders(
    medicationId,
    true,
  );
  const createReminder = useCreateMedicationReminder();
  const deleteReminder = useDeleteMedicationReminder();
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: { reminder_time: "" },
  });

  /* The API returns times `created_at DESC` — the order they were typed
     in, not the order they happen. Zero-padded `HH:MM:SS` sorts
     correctly as a string. */
  const times = [...(reminders ?? [])].sort((left, right) =>
    left.reminder_time.localeCompare(right.reminder_time),
  );

  const onSubmit = handleSubmit((values) => {
    const reminder_time = toWholeMinuteTime(values.reminder_time);

    /* There is no unique constraint server-side, so two identical rows
       would send two identical emails at the same minute. */
    if (times.some((reminder) => reminder.reminder_time === reminder_time)) {
      setError("reminder_time", {
        message: "That time is already set for this medication.",
      });
      return;
    }

    createReminder.mutate(
      { medication_id: medicationId, reminder_time },
      {
        onSuccess: (saved) => {
          reset({ reminder_time: "" });
          toast.success(
            `${medicineName} — dose due at ${formatClockTime(saved.reminder_time)}.`,
          );
        },
      },
    );
  });

  return (
    <div id={id} className="flex flex-col gap-4 border-t border-silver pt-5">
      <p className="type-caption text-stone">
        The times a dose is due. Kept with the medication, not sent as an
        alert.
      </p>

      {error ? (
        <p role="alert" className="type-body-sm text-critical">
          {error.message}
        </p>
      ) : null}

      {isPending ? (
        <p className="type-body-sm text-stone">Loading times…</p>
      ) : null}

      {times.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {times.map((reminder) => {
            const pending =
              deleteReminder.isPending &&
              deleteReminder.variables?.reminderId === reminder.id;

            return (
              <li
                key={reminder.id}
                className="rounded-input bg-paper px-3 py-2"
              >
                {editingId === reminder.id ? (
                  <ReminderTimeEditor
                    reminder={reminder}
                    medicineName={medicineName}
                    /* Every other saved time, for the duplicate guard —
                       a time is allowed to keep its own value. */
                    otherTimes={times
                      .filter((other) => other.id !== reminder.id)
                      .map((other) => other.reminder_time)}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Clock
                      aria-hidden
                      className="size-3.5 shrink-0 text-stone"
                      strokeWidth={1.5}
                    />

                    <span className="type-body-sm flex-1 text-graphite">
                      {formatClockTime(reminder.reminder_time)}
                    </span>

                    <PillButton
                      variant="quiet"
                      size="sm"
                      disabled={pending}
                      aria-label={`Change the ${formatClockTime(reminder.reminder_time)} dose time for ${medicineName}`}
                      onClick={() => setEditingId(reminder.id)}
                    >
                      <Pencil aria-hidden className="size-3.5" strokeWidth={2} />
                    </PillButton>

                    <PillButton
                      variant="quiet"
                      size="sm"
                      disabled={pending}
                      aria-label={`Remove the ${formatClockTime(reminder.reminder_time)} dose from ${medicineName}`}
                      onClick={() =>
                        deleteReminder.mutate(
                          { reminderId: reminder.id, medicationId },
                          {
                            onSuccess: () => toast.success("Time removed."),
                            onError: (removeError) =>
                              toast.error(removeError.message),
                          },
                        )
                      }
                    >
                      <Trash2 aria-hidden className="size-3.5" strokeWidth={2} />
                    </PillButton>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {!isPending && !error && times.length === 0 ? (
        <p className="type-body-sm text-stone">No times set yet.</p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        noValidate
      >
        <TextField
          label="Add a time"
          type="time"
          className="sm:w-40"
          error={errors.reminder_time?.message ?? null}
          {...register("reminder_time")}
        />

        <PillButton
          type="submit"
          variant="ghost"
          shape="rect"
          disabled={createReminder.isPending}
          /* Lines the control up with the input rather than its label. */
          className="sm:mt-[1.9rem]"
        >
          <Plus aria-hidden className="size-3.5" strokeWidth={2} />
          {createReminder.isPending ? "Adding…" : "Add"}
        </PillButton>
      </form>

      {createReminder.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {createReminder.error.message}
        </p>
      ) : null}
    </div>
  );
}

interface ReminderTimeEditorProps {
  reminder: MedicationReminder;
  medicineName: string;
  /** The medication's other saved times. The duplicate guard excludes
      the one being edited, so keeping its own value is allowed. */
  otherTimes: string[];
  onDone: () => void;
}

/**
 * Changing one saved reminder time, in place of its row.
 *
 * Reuses `reminderFormSchema` — the one `HH:MM` field — pre-filled with
 * the stored time. A save that doesn't change anything just closes, so an
 * unchanged edit costs no request; a change onto a time already on the
 * medication is caught here, the same guard the add form runs, since the
 * server has no unique constraint. Only `reminder_time` is sent.
 */
function ReminderTimeEditor({
  reminder,
  medicineName,
  otherTimes,
  onDone,
}: ReminderTimeEditorProps) {
  const updateReminder = useUpdateMedicationReminder();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: { reminder_time: reminder.reminder_time.slice(0, 5) },
  });
  const onSubmit = handleSubmit((values) => {
    const reminder_time = toWholeMinuteTime(values.reminder_time);

    /* Nothing changed — close without a round trip. */
    if (reminder_time === reminder.reminder_time) {
      onDone();
      return;
    }

    if (otherTimes.some((time) => time === reminder_time)) {
      setError("reminder_time", {
        message: "That time is already set for this medication.",
      });
      return;
    }

    updateReminder.mutate(
      { reminderId: reminder.id, patch: { reminder_time } },
      {
        onSuccess: (saved) => {
          toast.success(
            `${medicineName} — dose moved to ${formatClockTime(saved.reminder_time)}.`,
          );
          onDone();
        },
      },
    );
  });
  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        noValidate
      >
        <TextField
          label="Time"
          type="time"
          className="sm:w-40"
          error={errors.reminder_time?.message ?? null}
          {...register("reminder_time")}
        />

        <div className="flex gap-2 sm:mt-[1.9rem]">
          <PillButton
            type="submit"
            variant="ghost"
            shape="rect"
            disabled={updateReminder.isPending}
          >
            {updateReminder.isPending ? "Saving…" : "Save"}
          </PillButton>

          <PillButton
            type="button"
            variant="quiet"
            shape="rect"
            disabled={updateReminder.isPending}
            onClick={onDone}
          >
            Cancel
          </PillButton>
        </div>
      </form>

      {updateReminder.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {updateReminder.error.message}
        </p>
      ) : null}
    </div>
  );
}
