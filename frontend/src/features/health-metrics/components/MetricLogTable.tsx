import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { useDeleteMetric } from "@/features/health-metrics/hooks/useDeleteMetric";
import { parseRecordedAt } from "@/features/health-metrics/metricFormSchema";
import { metricIcon } from "@/features/health-metrics/metricIcons";
import { formatReading } from "@/features/health-metrics/metricSeries";
import {
  METRIC_BY_TYPE,
  metricLabel,
  sourceLabel,
  type HealthMetric,
} from "@/features/health-metrics/types";

const stampFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export interface MetricLogTableProps {
  /** As the API returns them: oldest first. */
  metrics: HealthMetric[];
}

/**
 * Every reading, newest first.
 *
 * Deleting asks once inline rather than through a dialog: the record
 * is medical, so a single stray click should not remove a reading, but
 * the app has no modal primitive and does not need one for this.
 */
export function MetricLogTable({ metrics }: MetricLogTableProps) {
  const deleteMetric = useDeleteMetric();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  /* The API orders by `recorded_at` ascending, which is what the
     sparklines want; a log reads the other way round. */
  const newestFirst = [...metrics].reverse();

  const onDelete = (metric: HealthMetric) => {
    const description = `${metricLabel(metric.metric_type)} reading`;

    if (confirmingId !== metric.id) {
      setConfirmingId(metric.id);
      return;
    }

    setConfirmingId(null);

    deleteMetric.mutate(metric.id, {
      onSuccess: () => toast.success(`${description} deleted.`),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <SurfaceCard padding="flush" className="overflow-hidden">
      <ul className="divide-y divide-silver">
        {newestFirst.map((metric) => {
          const recorded = parseRecordedAt(metric.recorded_at);
          const unit = METRIC_BY_TYPE[metric.metric_type]?.unit ?? metric.unit;
          const Icon = metricIcon(metric.metric_type);
          const confirming = confirmingId === metric.id;
          const pending =
            deleteMetric.isPending && deleteMetric.variables === metric.id;

          return (
            <li
              key={metric.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-5"
            >
              {/* The icon is a sibling of the text rather than inline
                  with the label, so the label and its timestamp share
                  one left edge and the icons line up down the log. The
                  slot is held even when there is no icon, so an
                  unrecognised type does not break that column. */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex size-3.5 shrink-0 items-center justify-center text-stone"
                >
                  {Icon ? (
                    <Icon className="size-3.5" strokeWidth={1.5} />
                  ) : null}
                </span>

                <div className="flex min-w-0 flex-col">
                  <span className="type-body-sm font-medium text-graphite">
                    {metricLabel(metric.metric_type)}
                  </span>
                  <time
                    dateTime={recorded.toISOString()}
                    className="type-caption text-stone"
                  >
                    {stampFormatter.format(recorded)}
                  </time>
                </div>
              </div>

              <span className="type-body-sm text-graphite">
                {formatReading(metric.value)}
                {unit ? (
                  <span className="text-slate"> {unit}</span>
                ) : null}
              </span>

              {metric.source === "manual" ? null : (
                <Tag>{sourceLabel(metric.source)}</Tag>
              )}

              <PillButton
                variant="quiet"
                size="sm"
                disabled={pending}
                onClick={() => onDelete(metric)}
                onBlur={() => setConfirmingId(null)}
                aria-label={
                  confirming
                    ? `Confirm deleting this ${metricLabel(metric.metric_type)} reading`
                    : `Delete this ${metricLabel(metric.metric_type)} reading`
                }
                className={confirming ? "text-critical" : undefined}
              >
                <Trash2 aria-hidden className="size-3.5" strokeWidth={2} />
                {confirming ? "Confirm" : null}
              </PillButton>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}

