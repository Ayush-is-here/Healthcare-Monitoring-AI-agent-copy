import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { MetricTypeCard } from "@/features/health-metrics/components/MetricTypeCard";
import { useHealthMetrics } from "@/features/health-metrics/hooks/useHealthMetrics";
import { toMetricSeries } from "@/features/health-metrics/metricSeries";

/**
 * Where things stand, one card per metric type.
 *
 * Split out from the log so that reading your record and adding to it
 * are two different jobs in two different places. It shares the
 * `useHealthMetrics` query with the log rather than fetching its own
 * copy — the charts need the full history, and neither dashboard
 * endpoint returns a series, only the latest value per type.
 */
export function TrendsView() {
  const { data: metrics, isPending, error } = useHealthMetrics();

  const series = toMetricSeries(metrics ?? []);

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
              <h1 className="type-heading-lg text-ink">Where things stand.</h1>
              <p className="type-body text-slate">
                The latest reading for everything you track, how far it moved,
                and the history behind it.
              </p>
            </div>
          </header>

          {error ? (
            <p role="alert" className="type-body-sm text-critical">
              {error.message}
            </p>
          ) : null}

          {isPending ? (
            <p className="type-body-sm text-stone">Loading your readings…</p>
          ) : null}

          {series.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {series.map((entry) => (
                <MetricTypeCard key={entry.key} series={entry} />
              ))}
            </div>
          ) : null}

          {/* A trends page with nothing to trend is a dead end, so the
              empty state carries the way out of it. */}
          {!isPending && !error && series.length === 0 ? (
            <p className="type-body-sm text-stone">
              Nothing to show yet.{" "}
              <Link
                to={PATHS.metrics}
                className="font-medium text-graphite underline decoration-silver underline-offset-4 transition-colors hover:text-ink hover:decoration-stone"
              >
                Log a reading
              </Link>{" "}
              and its history will appear here.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
