import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  /** Overrides the default emphatic value type — a long value (a date)
      reads better one step down from the big count the others use. */
  valueClassName?: string;
  caption?: ReactNode;
  /** When set, the whole tile is a link to that page. */
  to?: string;
}

/**
 * One headline number, dressed as a card on the paper field.
 *
 * Kept generic and taxonomy-free: the dashboard view supplies the label,
 * value and icon, so this stays a plain presentational tile the metric
 * snapshots and the count tiles can both lean on.
 */
export function StatTile({
  icon: Icon,
  label,
  value,
  valueClassName,
  caption,
  to,
}: StatTileProps) {
  const card = (
    <SurfaceCard
      padding="tight"
      className={cn(
        "flex h-full flex-col gap-2",
        to && "transition-shadow duration-200 hover:shadow-raised",
      )}
    >
      {/* `min-h-[2lh]` reserves two lines for every label and `items-start`
          pins the icon to the first line, so a label that wraps ("Active
          medications") and one that does not ("Reminders today") still line
          their icons and their values up across the row. Without both, a
          two-line label pushed its own number down and centred its icon
          against two lines — the tiles read as fine alone but ragged side
          by side. */}
      <h3 className="type-eyebrow flex min-h-[2lh] items-start gap-1.5 text-stone">
        <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.5} />
        {label}
      </h3>

      <p className={valueClassName ?? "type-heading text-ink"}>{value}</p>

      {caption ? <p className="type-caption text-stone">{caption}</p> : null}
    </SurfaceCard>
  );

  if (!to) return card;

  return (
    <Link
      to={to}
      className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/10"
    >
      {card}
    </Link>
  );
}
