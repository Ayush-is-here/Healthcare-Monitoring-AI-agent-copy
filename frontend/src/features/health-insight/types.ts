import { z } from "zod";

/**
 * Mirrors the API's HealthInsightResponse. Parsed rather than cast so
 * a schema drift on the server surfaces here instead of as a blank
 * section three components deep.
 */
export const healthInsightSchema = z.object({
  summary: z.string(),
  key_findings: z.array(z.string()).default([]),
  risk_assessment: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  when_to_seek_care: z.string(),
});

export type HealthInsight = z.infer<typeof healthInsightSchema>;
