import { ArrowRight, Sparkles } from "lucide-react";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
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

      <ul className="mx-auto flex w-full max-w-[36rem] flex-col gap-3">
        {CHAT_ENTRY_POINTS.map((entry) => (
          <li key={entry.id}>
            <SurfaceCard
              padding="flush"
              className="transition-shadow duration-200 ease-[var(--ease-out-soft)] hover:shadow-raised"
            >
              <button
                type="button"
                onClick={() => onLaunch(entry.id)}
                disabled={disabled || !entry.available}
                className="group flex w-full items-center gap-4 p-5 text-left disabled:cursor-not-allowed disabled:opacity-50 sm:gap-5 sm:p-6"
              >
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-panel bg-paper text-ink"
                >
                  <Sparkles className="size-5" strokeWidth={1.75} />
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="type-heading-sm text-ink">{entry.label}</span>
                  <span className="type-body-sm text-slate">
                    {entry.description}
                  </span>
                </span>

                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-stone transition-[color,transform] duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:text-ink"
                  strokeWidth={2}
                />
              </button>
            </SurfaceCard>
          </li>
        ))}
      </ul>

      <p className="type-caption max-w-[46ch] text-balance text-stone">
        Start with a full Health Insight, or ask a question of your own in the
        box below — your record and this conversation come with it.
      </p>
    </div>
  );
}
