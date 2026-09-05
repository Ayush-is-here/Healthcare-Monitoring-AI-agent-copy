import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  CalendarDays,
  Pill,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { MetricSnapshotTile } from "@/features/dashboard/components/MetricSnapshotTile";
import { StatTile } from "@/features/dashboard/components/StatTile";
import { useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboardAnalytics";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import type { DashboardMetric } from "@/features/dashboard/types";
import { metricIcon } from "@/features/health-metrics/metricIcons";
import { METRIC_BY_TYPE, metricLabel } from "@/features/health-metrics/types";
import { formatIsoDateTime } from "@/lib/dates";

/**
 * The latest reading per metric type, first occurrence kept.
 *
 * `/analytics` can hand back the same `metric_type` more than once — on
 * this account heart rate arrives as two rows with conflicting latest
 * values (86 and 74) and everything else identical, a backend quirk this
 * app cannot reach in to fix. The dashboard's model is one latest value
 * per type, so a repeat collapses to its first row: two tiles both
 * labelled "Heart rate" would read as a bug to the patient, and their
 * shared `metric_type` would collide as a React key besides. Systolic
 * and diastolic are distinct types and pass through untouched, so blood
 * pressure still resolves to its two tiles.
 */
function latestPerType(metrics: DashboardMetric[]): DashboardMetric[] {
  const seen = new Set<string>();

  return metrics.filter((metric) => {
    if (seen.has(metric.metric_type)) return false;
    seen.add(metric.metric_type);
    return true;
  });
}

/**
 * A calm overview: who you are, what you are taking, your next visit,
 * and where each reading stands.
 *
 * Wires the two /dashboard endpoints the app never consumed. It reaches
 * into the health-metrics registry for each metric's label, unit and
 * icon here in the view — the composition layer, which may cross into a
 * feature the way TrendsView does — so the dashboard feature itself
 * stays free of that dependency. Deliberately lighter than Trends: the
 * analytics endpoint returns a latest value and a change per type, not a
 * series, so there is nothing to chart.
 */
export function DashboardView() {
  const overview = useDashboardOverview();
  const analytics = useDashboardAnalytics();

  const isPending = overview.isPending || analytics.isPending;
  const error = overview.error ?? analytics.error;

  const patient = overview.data?.patient;
  const firstName = patient?.full_name.split(/\s+/)[0];

  const data = analytics.data;
  const metrics = latestPerType(data?.metrics ?? []);

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-12">
          <header className="flex flex-col gap-5">
            <Link
              to={PATHS.chat}
              className="type-caption inline-flex w-fit items-center gap-1.5 text-stone transition-colors duration-200 hover:text-graphite"
            >
              <ArrowLeft aria-hidden className="size-3.5" strokeWidth={2} />
              Back to chat
            </Link>

            <div className="flex flex-col gap-3">
              <h1 className="type-heading-lg text-ink">
                {firstName ? `Hello, ${firstName}.` : "Your dashboard."}
              </h1>
              {patient ? (
                <p className="type-body text-slate">Age {patient.age}</p>
              ) : null}
            </div>
          </header>

          {error ? (
            <p role="alert" className="type-body-sm text-critical">
              {error.message}
            </p>
          ) : null}

          {isPending ? (
            <p className="type-body-sm text-stone">Loading your dashboard…</p>
          ) : null}

          {data ? (
            <>
              <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile
                  icon={Pill}
                  label="Active medications"
                  value={data.medications.active_medications}
                  to={PATHS.medications}
                />
                <StatTile
                  icon={BellRing}
                  label="Reminders today"
                  value={data.medications.reminders_today}
                  to={PATHS.medications}
                />
                <StatTile
                  icon={CalendarDays}
                  label="Next appointment"
                  value={
                    data.appointments.next_appointment
                      ? formatIsoDateTime(data.appointments.next_appointment)
                      : "None scheduled"
                  }
                  valueClassName="type-body font-medium text-graphite"
                  to={PATHS.appointments}
                />
                <StatTile
                  icon={CalendarClock}
                  label="Upcoming visits"
                  value={data.appointments.upcoming_count}
                  to={PATHS.appointments}
                />
              </section>

              {metrics.length > 0 ? (
                <section className="flex flex-col gap-4">
                  <h2 className="type-eyebrow text-stone">Metric summary</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {metrics.map((metric) => (
                      <MetricSnapshotTile
                        key={metric.metric_type}
                        icon={metricIcon(metric.metric_type)}
                        label={metricLabel(metric.metric_type)}
                        value={metric.latest_value}
                        unit={METRIC_BY_TYPE[metric.metric_type]?.unit ?? ""}
                        average7={metric.average_7_days ?? null}
                        average30={metric.average_30_days ?? null}
                        changePercent={metric.change_percentage ?? null}
                        lastUpdated={metric.last_updated ?? null}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <p className="type-body-sm text-stone">
                  No readings yet.{" "}
                  <Link
                    to={PATHS.metrics}
                    className="font-medium text-graphite underline decoration-silver underline-offset-4 transition-colors hover:text-ink hover:decoration-stone"
                  >
                    Log a reading
                  </Link>{" "}
                  and it will show here.
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
