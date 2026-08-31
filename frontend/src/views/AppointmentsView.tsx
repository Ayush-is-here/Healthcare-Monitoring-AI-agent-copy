import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { AppointmentList } from "@/features/appointments/components/AppointmentList";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { isUpcoming, nowParts } from "@/features/appointments/types";

/* Past visits grow without bound and the API has no pagination — the
   whole history arrives every call — so a patient with years of records
   would push "Upcoming" off the top of a page of history. Capping what
   is rendered is honest here precisely because the server already sent
   everything: it is a choice about display, not a hidden fetch. */
const PAST_SHOWN = 20;

/**
 * Visits recorded, upcoming and past.
 *
 * No local state at all: nothing on this page expands, so unlike
 * `MedicationsView` there is no `expandedId` to own and no derived-id
 * guard to go with it. Each section owns its own confirm state.
 */
export function AppointmentsView() {
  const { data: appointments, isPending, error } = useAppointments();

  const rows = appointments ?? [];
  /* One `now` for the whole render, so the two sections cannot disagree
     about where the line is. */
  const now = nowParts();

  const upcoming = rows.filter((appointment) => isUpcoming(appointment, now));
  const past = rows.filter((appointment) => !isUpcoming(appointment, now));
  const shownPast = past.slice(0, PAST_SHOWN);

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
              <h1 className="type-heading-lg text-ink">Your appointments.</h1>
              {/* Says what the page does not do. Nothing in the backend
                  sends an appointment reminder — no beat entry, no
                  worker — so promising one would promise something the
                  app cannot deliver. */}
              <p className="type-body text-slate">
                Who you're seeing, when, and what for. This keeps the
                record and feeds it into your health insight; it doesn't
                remind you.
              </p>
            </div>
          </header>

          <SurfaceCard padding="roomy">
            <AppointmentForm />
          </SurfaceCard>

          {error ? (
            <p role="alert" className="type-body-sm text-critical">
              {error.message}
            </p>
          ) : null}

          {isPending ? (
            <p className="type-body-sm text-stone">
              Loading your appointments…
            </p>
          ) : null}

          {upcoming.length > 0 ? (
            <AppointmentList
              title="Upcoming"
              appointments={upcoming}
              direction="asc"
            />
          ) : null}

          {shownPast.length > 0 ? (
            <AppointmentList
              title="Past visits"
              appointments={shownPast}
              direction="desc"
              past
              footnote={
                past.length > shownPast.length
                  ? `Showing the ${PAST_SHOWN} most recent of ${past.length} past visits.`
                  : null
              }
            />
          ) : null}

          {!isPending && !error && rows.length === 0 ? (
            <p className="type-body-sm text-stone">
              Nothing recorded yet. The first appointment you add will show
              up here.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
