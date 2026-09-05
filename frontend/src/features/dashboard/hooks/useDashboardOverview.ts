import { useQuery } from "@tanstack/react-query";

import { useAccessToken } from "@/features/auth/hooks/useSession";
import { fetchDashboardOverview } from "@/features/dashboard/api/dashboardApi";

export const DASHBOARD_OVERVIEW_QUERY_KEY = ["dashboard", "overview"] as const;

/** The signed-in patient's name and age, for the dashboard greeting. */
export function useDashboardOverview() {
  const token = useAccessToken();

  return useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: fetchDashboardOverview,
    enabled: token !== null,
    retry: false,
    staleTime: 60 * 1000,
  });
}
