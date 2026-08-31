import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createHealthMetric } from "@/features/health-metrics/api/healthMetricsApi";
import { HEALTH_METRICS_QUERY_KEY } from "@/features/health-metrics/hooks/useHealthMetrics";
import type {
  CreateMetricPayload,
  HealthMetric,
} from "@/features/health-metrics/types";
import { toApiError, type ApiError } from "@/lib/http";

export interface LogMetricError extends ApiError {
  /** Rows that did land before the failure. */
  savedCount: number;
}

/**
 * Writes one reading, or two for a blood pressure.
 *
 * The POSTs run in sequence rather than concurrently so a failure can
 * be attributed to a specific half of the pair, and so the error can
 * say how much of the reading was actually stored.
 */
export function useLogMetric() {
  const queryClient = useQueryClient();

  return useMutation<HealthMetric[], LogMetricError, CreateMetricPayload[]>({
    mutationFn: async (payloads) => {
      const saved: HealthMetric[] = [];

      for (const payload of payloads) {
        try {
          saved.push(await createHealthMetric(payload));
        } catch (error) {
          throw { ...toApiError(error), savedCount: saved.length };
        }
      }

      return saved;
    },
    /* Settled, not success: a pair that half-landed still changed the
       record, and the list has to reflect what is actually stored.
       Server-side ordering also means the response rows cannot simply
       be appended to the cache. */
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: HEALTH_METRICS_QUERY_KEY });
    },
  });
}
