import { MedicationRow } from "@/features/medications/components/MedicationRow";
import type { Medication } from "@/features/medications/types";

export interface MedicationListProps {
  title: string;
  medications: Medication[];
  /** Which row is open, across every section. `null` means none. */
  expandedId: string | null;
  onExpandedChange: (medicationId: string | null) => void;
}

/**
 * One section's worth of rows.
 *
 * Stateless on purpose: the view renders this twice, once per
 * `is_active` group, and the accordion is shared across both — so the
 * open row lives one level up rather than once per list.
 */
export function MedicationList({
  title,
  medications,
  expandedId,
  onExpandedChange,
}: MedicationListProps) {
  /* The API orders by `start_date DESC` with no tiebreak, so two
     medications started the same day can swap places between refetches.
     `id` settles it. */
  const ordered = [...medications].sort((left, right) => {
    if (left.start_date !== right.start_date) {
      return right.start_date.localeCompare(left.start_date);
    }

    return left.id.localeCompare(right.id);
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="type-heading-sm text-ink">{title}</h2>

      <ul className="flex flex-col gap-3">
        {ordered.map((medication) => (
          <li key={medication.id}>
            <MedicationRow
              medication={medication}
              expanded={expandedId === medication.id}
              onToggle={() =>
                onExpandedChange(
                  expandedId === medication.id ? null : medication.id,
                )
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
