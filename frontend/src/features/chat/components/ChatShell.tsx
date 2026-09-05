import { useCallback, useState } from "react";
import { RotateCcw } from "lucide-react";

import { PillButton } from "@/components/primitives/PillButton";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatTranscript } from "@/features/chat/components/ChatTranscript";
import { useSendChatMessage } from "@/features/chat/hooks/useSendChatMessage";
import { getEntryPoint } from "@/features/chat/registry/entryPoints";
import { useChatSession } from "@/features/chat/store/useChatSession";
import type { ChatEntryPointId } from "@/features/chat/types";
import { useGenerateHealthInsight } from "@/features/health-insight/hooks/useGenerateHealthInsight";

/**
 * Container for the chat feature: owns the transcript, dispatches
 * entry points, and translates request outcomes into turns.
 *
 * It knows *that* an entry point produces an insight; it does not
 * know what an insight looks like. Rendering is the feature's job.
 */
export function ChatShell() {
  const session = useChatSession();
  const busy = session.status === "working";

  // Which flow is mid-flight, so the waiting card can describe it.
  const [pendingKind, setPendingKind] = useState<"insight" | "chat" | null>(
    null,
  );

  const generate = useGenerateHealthInsight({
    onSuccess: (insight) => {
      session.appendInsight(insight);
      session.setStatus("idle");
      setPendingKind(null);
    },
    onError: (error) => {
      session.appendNotice(
        error.isUnauthorized
          ? "Your session expired."
          : "That insight could not be generated.",
        error.message,
      );
      session.setStatus("idle");
      setPendingKind(null);
    },
  });

  const chat = useSendChatMessage({
    onSuccess: (response) => {
      session.appendAssistant(response.reply);
      session.setStatus("idle");
      setPendingKind(null);
    },
    onError: (error) => {
      session.appendNotice(
        error.isUnauthorized
          ? "Your session expired."
          : "That message could not be sent.",
        error.message,
      );
      session.setStatus("idle");
      setPendingKind(null);
    },
  });

  const launch = useCallback(
    (id: ChatEntryPointId) => {
      if (busy) return;

      session.appendUser(getEntryPoint(id).utterance);
      session.setStatus("working");
      setPendingKind("insight");
      generate.mutate();
    },
    [busy, generate, session],
  );

  const send = useCallback(
    (text: string) => {
      if (busy) return;

      session.appendUser(text);
      session.setStatus("working");
      setPendingKind("chat");
      chat.mutate(text);
    },
    [busy, chat, session],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatTranscript
        messages={session.messages}
        status={session.status}
        onLaunch={launch}
        pendingTitle={
          pendingKind === "chat" ? "Thinking through your question" : undefined
        }
        pendingHint={
          pendingKind === "chat"
            ? "Reading your health record and this conversation so far."
            : undefined
        }
      />

      <div className="border-t border-hairline bg-paper/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-5 py-5 sm:px-6">
          <ChatComposer onSend={send} onLaunch={launch} busy={busy} />

          {!session.isEmpty ? (
            <div className="flex justify-center">
              <PillButton
                variant="quiet"
                size="sm"
                onClick={session.reset}
                disabled={busy}
              >
                <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
                Start over
              </PillButton>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
