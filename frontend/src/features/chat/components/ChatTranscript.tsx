import { ChatTurn } from "@/features/chat/components/ChatTurn";
import { EntryPointPrompt } from "@/features/chat/components/EntryPointPrompt";
import { PendingTurn } from "@/features/chat/components/PendingTurn";
import type {
  ChatEntryPointId,
  ChatMessage,
  ChatStatus,
} from "@/features/chat/types";
import { useAutoScroll } from "@/hooks/useAutoScroll";

export interface ChatTranscriptProps {
  messages: ChatMessage[];
  status: ChatStatus;
  onLaunch: (id: ChatEntryPointId) => void;
  /** Copy for the waiting card; falls back to PendingTurn's defaults. */
  pendingTitle?: string;
  pendingHint?: string;
}

/** Scroll container for the conversation. Owns no chat logic. */
export function ChatTranscript({
  messages,
  status,
  onLaunch,
  pendingTitle,
  pendingHint,
}: ChatTranscriptProps) {
  const scrollRef = useAutoScroll(`${messages.length}:${status}`);
  const isEmpty = messages.length === 0 && status === "idle";

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hairline flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center px-5 pb-8 sm:px-6">
          <EntryPointPrompt onLaunch={onLaunch} />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl shrink-0 flex-col gap-5 px-5 pb-8 sm:px-6">
          <div className="h-6" />
          {messages.map((message) => (
            <ChatTurn key={message.id} message={message} />
          ))}
          {status === "working" ? (
            <PendingTurn title={pendingTitle} hint={pendingHint} />
          ) : null}
        </div>
      )}
    </div>
  );
}
