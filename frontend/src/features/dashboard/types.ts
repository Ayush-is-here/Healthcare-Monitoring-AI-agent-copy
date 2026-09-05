import { z } from "zod";

/* Mirrors the two dashboard endpoints in
   backend/app/api/routes/dashboard.py. Only the fields the page renders
   are declared — zod drops unknown keys, so the always-0.0
   `adherence_rate` never reaches the app. That is deliberate: there is no
   mechanism behind adherence to show. The 7- and 30-day averages, once
   dropped here too, are now read: the snapshot card shows both so its
   movement chip has the two numbers it actually compares. */

/**
 * GET /dashboard/overview — modelled down to the patient identity alone.
 *
 * Its counts, next appointment and metric snapshot all overlap with
 * /analytics, which is the richer source for each, so only the two
 * fields unique to this endpoint — name and age — are read from it.
 */
export const dashboardOverviewSchema = z.object({
  patient: z.object({
    full_name: z.string(),
    age: z.number(),
  }),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;

/**
 * One entry of GET /dashboard/analytics `metrics`.
 *
 * `metric_type` is a MetricType wire value; `latest_value` is the single
 * most-recent reading, while `average_7_days` / `average_30_days` are the
 * means of each window and `change_percentage` is how the first sits
 * against the second. The nullable fields mirror the server's `| None`
 * (a window with nothing in it, or no baseline to compare against).
 */
export const dashboardMetricSchema = z.object({
  metric_type: z.string(),
  latest_value: z.number(),
  average_7_days: z.number().nullable().optional(),
  average_30_days: z.number().nullable().optional(),
  change_percentage: z.number().nullable().optional(),
  last_updated: z.string().nullable().optional(),
});

export type DashboardMetric = z.infer<typeof dashboardMetricSchema>;

/** GET /dashboard/analytics. `adherence_rate` is intentionally omitted. */
export const dashboardAnalyticsSchema = z.object({
  metrics: z.array(dashboardMetricSchema),
  medications: z.object({
    active_medications: z.number(),
    reminders_today: z.number(),
  }),
  appointments: z.object({
    next_appointment: z.string().nullable().optional(),
    upcoming_count: z.number(),
  }),
});

export type DashboardAnalytics = z.infer<typeof dashboardAnalyticsSchema>;
