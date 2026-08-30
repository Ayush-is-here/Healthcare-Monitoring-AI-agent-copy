import { LifeBuoy } from "lucide-react";

export interface SeekCareCalloutProps {
  guidance: string;
}

/**
 * The single chromatic surface an insight is allowed. Escalation
 * guidance is the one thing that must not be scannable-past, so it
 * gets the only wash and the only coloured rule on the card.
 */
export function SeekCareCallout({ guidance }: SeekCareCalloutProps) {
  return (
    <aside className="flex gap-3.5 rounded-input bg-critical-wash px-4 py-3.5">
      <LifeBuoy
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-critical"
        strokeWidth={1.75}
      />

      <div className="flex flex-col gap-1">
        <h3 className="type-eyebrow text-critical">When to seek care</h3>
        <p className="type-body text-graphite">{guidance}</p>
      </div>
    </aside>
  );
}
