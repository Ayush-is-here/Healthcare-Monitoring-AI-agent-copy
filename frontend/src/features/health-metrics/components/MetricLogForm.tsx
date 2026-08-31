import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { SelectField } from "@/components/primitives/SelectField";
import { TextField } from "@/components/primitives/TextField";
import { useLogMetric } from "@/features/health-metrics/hooks/useLogMetric";
import {
  emptyMetricForm,
  metricFormSchema,
  toMetricPayloads,
  type MetricFormValues,
} from "@/features/health-metrics/metricFormSchema";
import {
  BLOOD_PRESSURE,
  DIASTOLIC,
  METRIC_BY_TYPE,
  METRIC_FORM_OPTIONS,
  SYSTOLIC,
  metricLabel,
} from "@/features/health-metrics/types";

/**
 * Logging one reading.
 *
 * `recorded_at` is always sent. The server types it optional, but
 * omitting it is a 500 — the column is NOT NULL with no default — so
 * the field is part of the form rather than left to the API.
 */
export function MetricLogForm() {
  const logMetric = useLogMetric();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MetricFormValues>({
    resolver: zodResolver(metricFormSchema),
    defaultValues: emptyMetricForm(),
  });

  /* `useWatch` rather than `watch()`: the returned value is a plain
     one, so the component stays memoizable. */
  const selection = useWatch({ control, name: "metric_type" });
  const isBloodPressure = selection === BLOOD_PRESSURE;
  const meta = METRIC_BY_TYPE[selection];

  const onSubmit = handleSubmit((values) =>
    logMetric.mutate(toMetricPayloads(values), {
      onSuccess: (saved) => {
        /* Keep the type, clear the numbers, re-stamp the time: logging
           a second reading of the same thing is the common next move. */
        reset({ ...emptyMetricForm(), metric_type: values.metric_type });

        toast.success(
          saved.length > 1
            ? "Blood pressure logged."
            : `${metricLabel(saved[0].metric_type)} logged.`,
        );
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <SelectField
        label="What did you measure?"
        placeholder="Select…"
        options={METRIC_FORM_OPTIONS}
        error={errors.metric_type?.message ?? null}
        {...register("metric_type")}
      />

      {isBloodPressure ? (
        /* Both halves in one pass. They are stored as two rows so each
           can be averaged on its own, but nobody should have to enter
           a blood pressure twice. */
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Systolic"
            type="number"
            inputMode="decimal"
            step={METRIC_BY_TYPE[SYSTOLIC].step}
            placeholder={METRIC_BY_TYPE[SYSTOLIC].placeholder}
            hint={METRIC_BY_TYPE[SYSTOLIC].unit}
            error={errors.systolic?.message ?? null}
            {...register("systolic")}
          />

          <TextField
            label="Diastolic"
            type="number"
            inputMode="decimal"
            step={METRIC_BY_TYPE[DIASTOLIC].step}
            placeholder={METRIC_BY_TYPE[DIASTOLIC].placeholder}
            hint={METRIC_BY_TYPE[DIASTOLIC].unit}
            error={errors.diastolic?.message ?? null}
            {...register("diastolic")}
          />
        </div>
      ) : (
        <TextField
          label="Reading"
          type="number"
          inputMode="decimal"
          step={meta?.step ?? "any"}
          placeholder={meta?.placeholder ?? ""}
          hint={meta?.unit ?? "Pick what you measured first."}
          /* Read-only rather than disabled: a disabled input drops out
             of the form values and the schema would see `undefined`. */
          readOnly={!meta}
          error={errors.value?.message ?? null}
          {...register("value")}
        />
      )}

      <TextField
        label="When"
        type="datetime-local"
        hint="Defaults to now."
        error={errors.recorded_at?.message ?? null}
        {...register("recorded_at")}
      />

      {logMetric.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {logMetric.error.savedCount > 0
            ? `Only part of that reading was saved — the systolic value is stored, the diastolic one is not. ${logMetric.error.message}`
            : logMetric.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={logMetric.isPending}
        className="w-full sm:w-fit sm:self-start"
      >
        {logMetric.isPending ? "Saving…" : "Log reading"}
      </PillButton>
    </form>
  );
}
