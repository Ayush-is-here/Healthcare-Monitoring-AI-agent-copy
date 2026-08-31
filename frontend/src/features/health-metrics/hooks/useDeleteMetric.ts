import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteHealthMetric } from "@/features/health-metrics/api/healthMetricsApi";
import { HEALTH_METRICS_QUERY_KEY } from "@/features/health-metrics/hooks/useHealthMetrics";
import { toApiError, type ApiError } from "@/lib/http";

/** Removes a single reading. The API answers with an envelope, not a row. */
export function useDeleteMetric() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: async (metricId) => {
      try {
        await deleteHealthMetric(metricId);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HEALTH_METRICS_QUERY_KEY });
    },
  });
}
