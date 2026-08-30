import { http } from "@/lib/http";
import {
  healthInsightSchema,
  type HealthInsight,
} from "@/features/health-insight/types";

/**
 * POST /ai/health-insights
 *
 * The endpoint takes no request body — the server assembles the
 * patient's context from their own record.
 */
export async function generateHealthInsight(
  signal?: AbortSignal,
): Promise<HealthInsight> {
  const { data } = await http.post("/ai/health-insights", undefined, { signal });
  return healthInsightSchema.parse(data);
}
