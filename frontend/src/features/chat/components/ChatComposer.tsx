import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Lock } from "lucide-react";

import { PillButton } from "@/components/primitives/PillButton";
import {
  COMPOSER_UNLOCKED,
  CHAT_ENTRY_POINTS,
} from "@/features/chat/registry/entryPoints";
import type { ChatEntryPointId } from "@/features/chat/types";
import { cn } from "@/lib/utils";

export interface ChatComposerProps {
  onSend: (text: string) => void;
  onLaunch: (id: ChatEntryPointId) => void;
  busy: boolean;
}

/**
 * The composer is present but honestly gated: the API exposes no
 * free-form chat branch yet, so free text is disabled and the one
 * real capability is offered as an explicit action instead of
 * pretending typed input does something.
 */
export function ChatComposer({ onSend, onLaunch, busy }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const primaryEntry = CHAT_ENTRY_POINTS[0];
  const canSend = COMPOSER_UNLOCKED && draft.trim().length > 0 && !busy;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;

    onSend(draft.trim());
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-panel bg-white p-3 shadow-card transition-shadow duration-200 focus-within:shadow-raised"
    >
      <label htmlFor="chat-draft" className="sr-only">
        Message
      </label>

      <textarea
        id="chat-draft"
        rows={2}
        value={draft}
        disabled={!COMPOSER_UNLOCKED || busy}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={
          COMPOSER_UNLOCKED
            ? "Ask about your health record…"
            : "Free-form questions are not available yet."
        }
        className={cn(
          "type-body block w-full resize-none bg-transparent px-2 pt-1.5",
          "text-graphite placeholder:text-stone focus:outline-none",
          "disabled:cursor-not-allowed",
        )}
      />

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="type-caption flex items-center gap-1.5 pl-2 text-stone">
          {COMPOSER_UNLOCKED ? (
            <>Enter to send · Shift + Enter for a new line</>
          ) : (
            <>
              <Lock aria-hidden className="size-3" strokeWidth={2} />
              Health Insight only
            </>
          )}
        </p>

        {COMPOSER_UNLOCKED ? (
          <PillButton
            type="submit"
            size="icon"
            disabled={!canSend}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" strokeWidth={2.25} />
          </PillButton>
        ) : (
          <PillButton
            size="sm"
            disabled={busy}
            onClick={() => onLaunch(primaryEntry.id)}
          >
            {busy ? "Generating…" : `Generate ${primaryEntry.label}`}
          </PillButton>
        )}
      </div>
    </form>
  );
}
