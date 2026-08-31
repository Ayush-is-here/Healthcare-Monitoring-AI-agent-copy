import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import {
  appointmentFormSchema,
  emptyAppointmentForm,
  FIELD_MAX,
  PAST_DATE_HINT,
  toAppointmentPayload,
  type AppointmentFormValues,
} from "@/features/appointments/appointmentFormSchema";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { useCreateAppointment } from "@/features/appointments/hooks/useCreateAppointment";
import { nowParts } from "@/features/appointments/types";

/**
 * Recording an appointment.
 *
 * `status` is not on the form: `AppointmentCreate` forbids extra fields,
 * so sending it is a 422. Every row is created `pending` and no route can
 * move it anywhere else, which is also why there is no cancel — see
 * `AppointmentRow`.
 */
export function AppointmentForm() {
  const createAppointment = useCreateAppointment();
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
    defaultValues: emptyAppointmentForm(),
  });

  const { today } = nowParts();
  /* `useWatch` rather than `watch()`: the returned value is a plain one,
     so the component stays memoizable. */
  const chosenDate = useWatch({ control, name: "appointment_date" });
  const isPast = chosenDate.length > 0 && chosenDate < today;

  const onSubmit = handleSubmit((values) => {
    const payload = toAppointmentPayload(values);

    /* There is no unique constraint server-side, so re-submitting the
       same visit silently creates a twin. The same guard
       `ReminderPanel` runs before adding a time. */
    const duplicate = (appointments ?? []).some(
      (appointment) =>
        appointment.appointment_date === payload.appointment_date &&
        appointment.appointment_time === payload.appointment_time &&
        appointment.doctor_name.trim().toLowerCase() ===
          payload.doctor_name.toLowerCase(),
    );

    if (duplicate) {
      setError("appointment_time", {
        message: "That visit is already recorded.",
      });
      return;
    }

    createAppointment.mutate(payload, {
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

      {createAppointment.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {createAppointment.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={createAppointment.isPending}
        className="w-full sm:w-fit sm:self-start"
      >
        {createAppointment.isPending ? "Saving…" : "Add appointment"}
      </PillButton>
    </form>
  );
}
