import { ArrowRight, Sparkles } from "lucide-react";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { CHAT_ENTRY_POINTS } from "@/features/chat/registry/entryPoints";
import type { ChatEntryPointId } from "@/features/chat/types";

export interface EntryPointPromptProps {
  onLaunch: (id: ChatEntryPointId) => void;
  disabled?: boolean;
}

/**
 * Opening state of the transcript. Renders whatever the registry
 * advertises, so it grows with the API rather than with edits here.
 */
export function EntryPointPrompt({
  onLaunch,
  disabled = false,
}: EntryPointPromptProps) {
  return (
    <div className="animate-rise-in mx-auto flex w-full max-w-2xl flex-col items-center gap-10 py-10 text-center sm:py-16">
      <header className="flex flex-col items-center gap-5">
        <span className="type-eyebrow flex items-center gap-2 text-stone">
          <Sparkles aria-hidden className="size-3.5" strokeWidth={2} />
          Health intelligence
        </span>

        <h1 className="type-display max-w-[22ch] text-balance text-ink">
          Your record, read closely.
        </h1>

        <p className="type-subheading max-w-[52ch] text-balance text-slate">
          Every metric, medication and appointment you have logged, reviewed
          together and weighed against current clinical evidence.
        </p>
      </header>

      <ul className="flex w-full flex-col gap-3">
        {CHAT_ENTRY_POINTS.map((entry) => (
          <li key={entry.id}>
            <SurfaceCard
              padding="flush"
              className="overflow-hidden transition-shadow duration-200 ease-[var(--ease-out-soft)] hover:shadow-raised"
            >
              <button
                type="button"
                onClick={() => onLaunch(entry.id)}
                disabled={disabled || !entry.available}
                className="group flex w-full items-center gap-5 p-6 text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
                  <Tag tone="neutral">{entry.eyebrow}</Tag>
                  <span className="type-heading-sm text-ink">{entry.label}</span>
                  <span className="type-body-sm text-slate">
                    {entry.description}
                  </span>
                </span>

                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-pill bg-paper text-graphite transition-[background-color,color,transform] duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-white"
                >
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </button>
            </SurfaceCard>
          </li>
        ))}
      </ul>

      <p className="type-caption max-w-[46ch] text-balance text-stone">
        Health Insight is the only topic available today. Open-ended
        conversation arrives once the assistant can answer it safely.
      </p>
    </div>
  );
}
