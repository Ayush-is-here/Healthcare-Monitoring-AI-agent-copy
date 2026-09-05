import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateHealthMetric } from "@/features/health-metrics/api/healthMetricsApi";
import { HEALTH_METRICS_QUERY_KEY } from "@/features/health-metrics/hooks/useHealthMetrics";
import type {
  HealthMetric,
  UpdateMetricPayload,
} from "@/features/health-metrics/types";
import { toApiError, type ApiError } from "@/lib/http";

export interface UpdateMetricVariables {
  metricId: string;
  patch: UpdateMetricPayload;
}

/**
 * Patches one reading.
 *
 * Invalidates rather than splicing the returned row in: an edit can move
 * `recorded_at`, which is the key both the log order and every sparkline
 * are built from, so the row's place in the series can change. A refetch
 * is the honest way to resettle it — the same trade `useLogMetric` makes
 * for the same reason.
 */
export function useUpdateMetric() {
  const queryClient = useQueryClient();

  return useMutation<HealthMetric, ApiError, UpdateMetricVariables>({
    mutationFn: async ({ metricId, patch }) => {
      try {
        return await updateHealthMetric(metricId, patch);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HEALTH_METRICS_QUERY_KEY });
    },
  });
}
