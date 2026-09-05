import { useQuery } from "@tanstack/react-query";

import { useAccessToken } from "@/features/auth/hooks/useSession";
import { fetchDashboardAnalytics } from "@/features/dashboard/api/dashboardApi";

export const DASHBOARD_ANALYTICS_QUERY_KEY = ["dashboard", "analytics"] as const;

/** Medication and appointment counts, next visit, and per-metric trends. */
export function useDashboardAnalytics() {
  const token = useAccessToken();

  return useQuery({
    queryKey: DASHBOARD_ANALYTICS_QUERY_KEY,
    queryFn: fetchDashboardAnalytics,
    enabled: token !== null,
    retry: false,
    staleTime: 60 * 1000,
  });
}
