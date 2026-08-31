import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { MedicationForm } from "@/features/medications/components/MedicationForm";
import { MedicationList } from "@/features/medications/components/MedicationList";
import { useMedications } from "@/features/medications/hooks/useMedications";

/**
 * What you're taking, and when a dose is due.
 *
 * One row is open at a time across both sections, so `expandedId` lives
 * here rather than in either list: a per-list copy would let a row stay
 * open in each, which is two reminder requests in flight and two panels
 * to reconcile.
 */
export function MedicationsView() {
  const { data: medications, isPending, error } = useMedications();
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = medications ?? [];
  const active = rows.filter((medication) => medication.is_active);
  /* Strictly `is_active`. A past `end_date` does not move a row here:
     the backend never flips the flag on its own, so inferring it would
     show the record as stopped while the server still holds it open. */
  const inactive = rows.filter((medication) => !medication.is_active);

  /* Derived rather than reset in an effect — deleting the open row would
     otherwise leave `openId` pointing at nothing. */
  const expandedId = rows.some((medication) => medication.id === openId)
    ? openId
    : null;

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
              <h1 className="type-heading-lg text-ink">Your medications.</h1>
              <p className="type-body text-slate">
                What you take, how much, and how often. Open a medication to
                set the times a dose is due.
              </p>
            </div>
          </header>

          <SurfaceCard padding="roomy">
            <MedicationForm />
          </SurfaceCard>

          {error ? (
            <p role="alert" className="type-body-sm text-critical">
              {error.message}
            </p>
          ) : null}

          {isPending ? (
            <p className="type-body-sm text-stone">Loading your medications…</p>
          ) : null}

          {active.length > 0 ? (
            <MedicationList
              title="Currently taking"
              medications={active}
              expandedId={expandedId}
              onExpandedChange={setOpenId}
            />
          ) : null}

          {inactive.length > 0 ? (
            <MedicationList
              title="No longer taking"
              medications={inactive}
              expandedId={expandedId}
              onExpandedChange={setOpenId}
            />
          ) : null}

          {!isPending && !error && rows.length === 0 ? (
            <p className="type-body-sm text-stone">
              Nothing recorded yet. The first medication you add will show up
              here.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
