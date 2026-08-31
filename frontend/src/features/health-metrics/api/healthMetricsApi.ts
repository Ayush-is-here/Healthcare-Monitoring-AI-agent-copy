import { http, toApiError } from "@/lib/http";
import {
  healthMetricListSchema,
  healthMetricSchema,
  type CreateMetricPayload,
  type HealthMetric,
} from "@/features/health-metrics/types";

/**
 * GET /health-metrics/
 *
 * Rows come back oldest-first with no limit and no pagination, which
 * is what the sparklines want; the log reverses for display.
 */
export async function fetchHealthMetrics(): Promise<HealthMetric[]> {
  try {
    const { data } = await http.get("/health-metrics/");
    return healthMetricListSchema.parse(data);
  } catch (error) {
    const apiError = toApiError(error);

    /* The service 404s when the account has no profile. `RequireProfile`
       makes that unreachable here, and "no readings" is the honest
       translation of it in any case. */
    if (apiError.status === 404) return [];

    throw apiError;
  }
}

export async function createHealthMetric(
  payload: CreateMetricPayload,
): Promise<HealthMetric> {
  const { data } = await http.post("/health-metrics/", payload);
  return healthMetricSchema.parse(data);
}

/** DELETE /health-metrics/{id} — answers with an envelope, not a row. */
export async function deleteHealthMetric(metricId: string): Promise<void> {
  await http.delete(`/health-metrics/${metricId}`);
}
