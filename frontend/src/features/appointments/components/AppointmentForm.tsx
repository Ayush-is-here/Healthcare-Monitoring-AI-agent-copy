import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import {
  appointmentFormSchema,
  appointmentToFormValues,
  emptyAppointmentForm,
  FIELD_MAX,
  PAST_DATE_HINT,
  toAppointmentPayload,
  toAppointmentUpdatePayload,
  type AppointmentFormValues,
} from "@/features/appointments/appointmentFormSchema";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useCreateAppointment } from "@/features/appointments/hooks/useCreateAppointment";
import { useUpdateAppointment } from "@/features/appointments/hooks/useUpdateAppointment";
import { nowParts, type Appointment } from "@/features/appointments/types";
import { toWholeMinuteTime } from "@/lib/dates";

export interface AppointmentFormProps {
  /**
   * When present, the form edits this row in place instead of recording
   * a new one: pre-filled, saving through PATCH, with a Cancel.
   */
  appointment?: Appointment;
  /** Leaves edit mode — called after a successful save or on Cancel. */
  onDone?: () => void;
}

/**
 * Recording an appointment, or editing one.
 *
 * `status` is not on the form: `AppointmentCreate` and `AppointmentUpdate`
 * both forbid extra fields, so sending it is a 422. Every row is created
 * `pending` and no route can move it anywhere else, which is also why
 * there is no cancel action on a saved row — see `AppointmentRow`.
 */
export function AppointmentForm({ appointment, onDone }: AppointmentFormProps = {}) {
  const editing = appointment !== undefined;
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  /* Already in cache — the page above renders from the same query, so
     this costs no request. It is here for the duplicate check. */
  const { data: appointments } = useAppointments();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: appointment
      ? appointmentToFormValues(appointment)
      : emptyAppointmentForm(),
  });

  const { today } = nowParts();
  /* `useWatch` rather than `watch()`: the returned value is a plain one,
     so the component stays memoizable. */
  const chosenDate = useWatch({ control, name: "appointment_date" });
  const isPast = chosenDate.length > 0 && chosenDate < today;

  const mutation = editing ? updateAppointment : createAppointment;

  const onSubmit = handleSubmit((values) => {
    const doctorName = values.doctor_name.trim();
    const appointmentDate = values.appointment_date;
    const appointmentTime = toWholeMinuteTime(values.appointment_time);

    /* There is no unique constraint server-side, so re-submitting the
       same visit silently creates a twin. The same guard `ReminderPanel`
       runs before adding a time. The row being edited is excluded — it
       matches itself by definition. */
    const duplicate = (appointments ?? []).some(
      (existing) =>
        existing.id !== appointment?.id &&
        existing.appointment_date === appointmentDate &&
        existing.appointment_time === appointmentTime &&
        existing.doctor_name.trim().toLowerCase() === doctorName.toLowerCase(),
    );

    if (duplicate) {
      setError("appointment_time", {
        message: "That visit is already recorded.",
      });
      return;
    }

    if (appointment) {
      updateAppointment.mutate(
        {
          appointmentId: appointment.id,
          patch: toAppointmentUpdatePayload(values),
        },
        {
          onSuccess: (saved) => {
            toast.success(`Appointment with ${saved.doctor_name} updated.`);
            onDone?.();
          },
        },
      );
      return;
    }

    createAppointment.mutate(toAppointmentPayload(values), {
      onSuccess: (saved) => {
        reset(emptyAppointmentForm());
        toast.success(`Appointment with ${saved.doctor_name} recorded.`);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Doctor or clinic"
        placeholder="e.g. Dr Mehta"
        autoComplete="off"
        maxLength={FIELD_MAX.doctor_name}
        error={errors.doctor_name?.message ?? null}
        {...register("doctor_name")}
      />

      {/* A date without its time is half an appointment, so the two
          share a row. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Date"
          type="date"
          /* Non-blocking. Recording a visit you already had is
             legitimate, so a mistyped year should be visible without
             being rejected. `TextField` renders one message node where
             a real error wins, so this never stacks with one. */
          hint={isPast ? PAST_DATE_HINT : "Defaults to today."}
          error={errors.appointment_date?.message ?? null}
          {...register("appointment_date")}
        />

        <TextField
          label="Time"
          type="time"
          error={errors.appointment_time?.message ?? null}
          {...register("appointment_time")}
        />
      </div>

      <TextField
        label="What it's for"
        placeholder="e.g. Diabetes review"
        autoComplete="off"
        maxLength={FIELD_MAX.purpose}
        error={errors.purpose?.message ?? null}
        {...register("purpose")}
      />

      <TextField
        label="Where"
        placeholder="e.g. Apollo Clinic, Andheri"
        autoComplete="off"
        hint="Optional."
        maxLength={FIELD_MAX.location}
        error={errors.location?.message ?? null}
        {...register("location")}
      />

      <TextField
        label="Notes"
        placeholder="e.g. Bring the last blood report"
        autoComplete="off"
        hint="Optional."
        maxLength={FIELD_MAX.notes}
        error={errors.notes?.message ?? null}
        {...register("notes")}
      />

      {mutation.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {mutation.error.message}
        </p>
      ) : null}

      {/* In edit mode the pair sits inline — Cancel leaves without saving
          and the primary label names the action. On create there is
          nothing to cancel back to, so the button stands alone. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillButton
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="w-full sm:w-fit"
        >
          {mutation.isPending
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Add appointment"}
        </PillButton>

        {editing ? (
          <PillButton
            type="button"
            variant="ghost"
            size="lg"
            disabled={mutation.isPending}
            onClick={() => onDone?.()}
            className="w-full sm:w-fit"
          >
            Cancel
          </PillButton>
        ) : null}
      </div>
    </form>
  );
}
