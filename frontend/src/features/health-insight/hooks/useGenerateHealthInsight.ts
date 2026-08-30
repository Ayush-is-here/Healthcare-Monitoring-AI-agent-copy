import { useMutation } from "@tanstack/react-query";

import { generateHealthInsight } from "@/features/health-insight/api/healthInsightApi";
import type { HealthInsight } from "@/features/health-insight/types";
import { toApiError, type ApiError } from "@/lib/http";

/**
 * One insight generation. Modelled as a mutation rather than a query
 * because it is an explicit, user-triggered, side-effectful action —
 * and because it must never fire on mount or refocus.
 */
export function useGenerateHealthInsight(options: {
  onSuccess: (insight: HealthInsight) => void;
  onError: (error: ApiError) => void;
}) {
  return useMutation<HealthInsight, ApiError, void>({
    mutationFn: async () => {
      try {
        return await generateHealthInsight();
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}
