import { useId, useState } from "react";
import { ChevronDown, Pill, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { ReminderPanel } from "@/features/medications/components/ReminderPanel";
import { useDeleteMedication } from "@/features/medications/hooks/useDeleteMedication";
import { useUpdateMedication } from "@/features/medications/hooks/useUpdateMedication";
import {
  formatDosage,
  frequencyLabel,
  type Medication,
} from "@/features/medications/types";
import { formatIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface MedicationRowProps {
  medication: Medication;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * One medication: what it is, and the two things you can do to it.
 *
 * The mutations are called here rather than in the list so `isPending`
 * disables this row's buttons alone. Deleting asks once inline, the same
 * way the reading log does — the record is medical, so a stray click
 * should not remove a course, but the app has no modal primitive and
 * does not need one for this.
 */
export function MedicationRow({
  medication,
  expanded,
  onToggle,
}: MedicationRowProps) {
  const panelId = useId();
  const updateMedication = useUpdateMedication();
  const deleteMedication = useDeleteMedication();
  const [confirming, setConfirming] = useState(false);

  const active = medication.is_active;

  const onToggleActive = () =>
    updateMedication.mutate(
      /* Exactly one key. The PATCH is `exclude_unset`, and an explicit
         null on any NOT NULL column reaches the database as a 500. */
      { medicationId: medication.id, patch: { is_active: !active } },
      {
        onSuccess: (updated) =>
          toast.success(
            updated.is_active
              ? `Back on ${updated.medicine_name}.`
              : `${updated.medicine_name} moved to no longer taking.`,
          ),
        onError: (error) => toast.error(error.message),
      },
    );

  const onDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setConfirming(false);

    /* Collapse before deleting. `useDeleteMedication` drops this row's
       reminder cache once the server confirms, and TanStack re-creates
       and refetches a removed query that still has a live observer — so
       an open panel here would fire a `GET` for a medication that no
       longer exists and take a 404 for it. */
    if (expanded) {
      onToggle();
    }

    deleteMedication.mutate(medication.id, {
      onSuccess: () => toast.success(`${medication.medicine_name} deleted.`),
      onError: (error) => toast.error(error.message),
    });
  };

  const busy = updateMedication.isPending || deleteMedication.isPending;

  return (
    <SurfaceCard
      padding="tight"
      elevation={active ? "card" : "none"}
      className={cn(!active && "border border-silver bg-paper/40")}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* The summary itself is the disclosure control. The two action
            buttons are siblings of it, never inside — a button within a
            button is invalid and the inner one stops working. */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-input text-left transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/10"
        >
          <Pill
            aria-hidden
            className={cn("size-3.5 shrink-0", active ? "text-stone" : "text-silver")}
            strokeWidth={1.5}
          />

          <span className="flex min-w-0 flex-col">
            <span
              className={cn(
                "type-body-sm truncate font-medium",
                active ? "text-graphite" : "text-slate",
              )}
            >
              {medication.medicine_name}
            </span>

            <span className="type-caption text-stone">
              {formatDosage(medication.dosage, medication.dosage_unit)} · from{" "}
              <time dateTime={medication.start_date}>
                {formatIsoDate(medication.start_date)}
              </time>
              {medication.end_date ? (
                <>
                  {" until "}
                  <time dateTime={medication.end_date}>
                    {formatIsoDate(medication.end_date)}
                  </time>
                </>
              ) : null}
            </span>
          </span>

          {/* Decoration. `aria-expanded` is what announces the state. */}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-stone transition-transform duration-200",
              expanded && "rotate-180",
            )}
            strokeWidth={2}
          />
        </button>

        <Tag>{frequencyLabel(medication.frequency)}</Tag>

        <PillButton
          variant="quiet"
          size="sm"
          disabled={busy}
          onClick={onToggleActive}
        >
          {active ? "No longer taking" : "Taking again"}
        </PillButton>

        <PillButton
          variant="quiet"
          size="sm"
          disabled={busy}
          onClick={onDelete}
          onBlur={() => setConfirming(false)}
          aria-label={
            confirming
              ? `Confirm deleting ${medication.medicine_name}`
              : `Delete ${medication.medicine_name}`
          }
          className={confirming ? "text-critical" : undefined}
        >
          <Trash2 aria-hidden className="size-3.5" strokeWidth={2} />
          {confirming ? "Confirm" : null}
        </PillButton>
      </div>

      {medication.instructions ? (
        <p className="type-body-sm mt-3 text-slate">{medication.instructions}</p>
      ) : null}

      {expanded ? (
        <div className="mt-4">
          <ReminderPanel
            id={panelId}
            medicationId={medication.id}
            medicineName={medication.medicine_name}
          />
        </div>
      ) : null}
    </SurfaceCard>
  );
}
