import { useQuery } from "@tanstack/react-query";

import { useAccessToken } from "@/features/auth/hooks/useSession";
import { fetchHealthMetrics } from "@/features/health-metrics/api/healthMetricsApi";

export const HEALTH_METRICS_QUERY_KEY = ["health-metrics"] as const;

/** Every reading the signed-in patient has logged, oldest first. */
export function useHealthMetrics() {
  const token = useAccessToken();

  return useQuery({
    queryKey: HEALTH_METRICS_QUERY_KEY,
    queryFn: fetchHealthMetrics,
    enabled: token !== null,
    retry: false,
    staleTime: 60 * 1000,
  });
}
