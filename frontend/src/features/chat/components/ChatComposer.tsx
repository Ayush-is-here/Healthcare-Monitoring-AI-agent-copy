import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { PillButton } from "@/components/primitives/PillButton";
import { CHAT_ENTRY_POINTS } from "@/features/chat/registry/entryPoints";
import type { ChatEntryPointId } from "@/features/chat/types";
import { cn } from "@/lib/utils";

export interface ChatComposerProps {
  onSend: (text: string) => void;
  onLaunch: (id: ChatEntryPointId) => void;
  busy: boolean;
}

/**
 * Free-form input with a persistent shortcut to the one structured
 * action. Typed questions go to /ai/chat; the pill on the left runs a
 * full Health Insight without the reader having to phrase it.
 */
export function ChatComposer({ onSend, onLaunch, busy }: ChatComposerProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const primaryEntry = CHAT_ENTRY_POINTS[0];
  const canSend = draft.trim().length > 0 && !busy;

  // Rest at a single line and grow with the message, capped so a long
  // paste scrolls instead of swallowing the transcript.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

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
      className="rounded-panel bg-white p-2.5 shadow-card transition-shadow duration-200 focus-within:shadow-raised"
    >
      <label htmlFor="chat-draft" className="sr-only">
        Message
      </label>

      <textarea
        id="chat-draft"
        ref={textareaRef}
        rows={1}
        value={draft}
        disabled={busy}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask about your health record…"
        className={cn(
          "type-body block w-full resize-none overflow-y-auto bg-transparent px-2 pt-1.5",
          "text-graphite placeholder:text-stone focus:outline-none",
          "disabled:cursor-not-allowed",
        )}
      />

      <div className="flex items-center justify-between gap-3 pt-0.5">
        <PillButton
          type="button"
          variant="quiet"
          size="md"
          disabled={busy}
          onClick={() => onLaunch(primaryEntry.id)}
          className="-ml-4"
        >
          <Sparkles aria-hidden className="size-4" strokeWidth={2} />
          Generate {primaryEntry.label}
        </PillButton>

        <PillButton
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label="Send message"
        >
          <ArrowUp className="size-4" strokeWidth={2.25} />
        </PillButton>
      </div>
    </form>
  );
}
