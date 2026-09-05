import { http, toApiError } from "@/lib/http";
import {
  healthMetricListSchema,
  healthMetricSchema,
  type CreateMetricPayload,
  type HealthMetric,
  type UpdateMetricPayload,
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

/**
 * PATCH /health-metrics/{id} — answers with the whole row.
 *
 * A true PATCH server-side (`exclude_unset`), so the edit form decides
 * which columns are touched by which keys it sends — see
 * `toMetricUpdatePayload`, which sends only `value` and `recorded_at`. A
 * 404 means the reading does not exist and a 403 means it is someone
 * else's; both surface.
 */
export async function updateHealthMetric(
  metricId: string,
  patch: UpdateMetricPayload,
): Promise<HealthMetric> {
  const { data } = await http.patch(`/health-metrics/${metricId}`, patch);
  return healthMetricSchema.parse(data);
}

/** DELETE /health-metrics/{id} — answers with an envelope, not a row. */
export async function deleteHealthMetric(metricId: string): Promise<void> {
  await http.delete(`/health-metrics/${metricId}`);
}
