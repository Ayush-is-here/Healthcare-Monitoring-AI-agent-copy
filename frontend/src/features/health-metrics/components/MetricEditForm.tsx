import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { TextField } from "@/components/primitives/TextField";
import { useUpdateMetric } from "@/features/health-metrics/hooks/useUpdateMetric";
import {
  makeMetricEditSchema,
  metricToEditValues,
  toMetricUpdatePayload,
  type MetricEditFormValues,
} from "@/features/health-metrics/metricFormSchema";
import {
  METRIC_BY_TYPE,
  metricLabel,
  type HealthMetric,
} from "@/features/health-metrics/types";

export interface MetricEditFormProps {
  metric: HealthMetric;
  /** Leaves edit mode — called after a successful save or on Cancel. */
  onDone: () => void;
}

/**
 * Correcting one stored reading, in place of its row.
 *
 * Only the number and the timestamp are editable: the type is fixed once
 * a reading is written, so it is stated rather than offered — see
 * `toMetricUpdatePayload`. The schema is built from the row's own type so
 * the value is held to that type's bounds, the same ones the log form
 * enforces.
 */
export function MetricEditForm({ metric, onDone }: MetricEditFormProps) {
  const updateMetric = useUpdateMetric();
  const meta = METRIC_BY_TYPE[metric.metric_type];

  /* Rebuilt only if the type changes, which for one row it never does —
     so this is stable for the life of the editor. */
  const schema = useMemo(
    () => makeMetricEditSchema(metric.metric_type),
    [metric.metric_type],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetricEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: metricToEditValues(metric),
  });

  const onSubmit = handleSubmit((values) =>
    updateMetric.mutate(
      { metricId: metric.id, patch: toMetricUpdatePayload(values) },
      {
        onSuccess: () => {
          toast.success(`${metricLabel(metric.metric_type)} reading updated.`);
          onDone();
        },
      },
    ),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <p className="type-caption text-stone">
        Editing your {metricLabel(metric.metric_type).toLowerCase()} reading.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Reading"
          type="number"
          inputMode="decimal"
          step={meta?.step ?? "any"}
          placeholder={meta?.placeholder ?? ""}
          hint={meta?.unit ?? undefined}
          error={errors.value?.message ?? null}
          {...register("value")}
        />

        <TextField
          label="When"
          type="datetime-local"
          error={errors.recorded_at?.message ?? null}
          {...register("recorded_at")}
        />
      </div>

      {updateMetric.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {updateMetric.error.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillButton type="submit" disabled={updateMetric.isPending}>
          {updateMetric.isPending ? "Saving…" : "Save changes"}
        </PillButton>

        <PillButton
          type="button"
          variant="ghost"
          disabled={updateMetric.isPending}
          onClick={onDone}
        >
          Cancel
        </PillButton>
      </div>
    </form>
  );
}
