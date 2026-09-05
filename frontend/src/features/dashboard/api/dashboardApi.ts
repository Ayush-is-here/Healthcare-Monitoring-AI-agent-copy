import { http, toApiError } from "@/lib/http";
import {
  dashboardAnalyticsSchema,
  dashboardOverviewSchema,
  type DashboardAnalytics,
  type DashboardOverview,
} from "@/features/dashboard/types";

/**
 * GET /dashboard/overview
 *
 * Read only for the patient's name and age (see `types.ts`). The service
 * 404s for an account with no profile, but `RequireProfile` guards the
 * route, so that is unreachable here — left to surface if it ever isn't.
 */
export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  try {
    const { data } = await http.get("/dashboard/overview");
    return dashboardOverviewSchema.parse(data);
  } catch (error) {
    throw toApiError(error);
  }
}

/** GET /dashboard/analytics — counts, next/upcoming visits, metric trends. */
export async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const { data } = await http.get("/dashboard/analytics");
    return dashboardAnalyticsSchema.parse(data);
  } catch (error) {
    throw toApiError(error);
  }
}
