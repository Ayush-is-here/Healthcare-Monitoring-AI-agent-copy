import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { MetricLogForm } from "@/features/health-metrics/components/MetricLogForm";
import { MetricLogTable } from "@/features/health-metrics/components/MetricLogTable";
import { useHealthMetrics } from "@/features/health-metrics/hooks/useHealthMetrics";

/**
 * Adding to the record, and the record itself.
 *
 * The per-type cards live on [TrendsView] instead: logging a reading
 * and reviewing what it means are two different jobs, and putting them
 * on one page meant scrolling past nine charts to reach the log.
 */
export function MetricsView() {
  const { data: metrics, isPending, error } = useHealthMetrics();

  const hasReadings = (metrics?.length ?? 0) > 0;

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
              <h1 className="type-heading-lg text-ink">Your readings.</h1>
              <p className="type-body text-slate">
                A review can only work with what it can see. Every reading you
                log here is what the trends and the insight are built from.
              </p>
            </div>
          </header>

          <SurfaceCard padding="roomy">
            <MetricLogForm />
          </SurfaceCard>

          {error ? (
            <p role="alert" className="type-body-sm text-critical">
              {error.message}
            </p>
          ) : null}

          {isPending ? (
            <p className="type-body-sm text-stone">Loading your readings…</p>
          ) : null}

          {hasReadings && metrics ? (
            <section className="flex flex-col gap-4">
              <h2 className="type-heading-sm text-ink">Full log</h2>
              <MetricLogTable metrics={metrics} />
            </section>
          ) : null}

          {!isPending && !error && !hasReadings ? (
            <p className="type-body-sm text-stone">
              Nothing logged yet. Your first reading will show up here.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
