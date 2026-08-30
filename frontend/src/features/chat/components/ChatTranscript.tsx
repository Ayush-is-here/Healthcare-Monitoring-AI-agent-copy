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
}

/** Scroll container for the conversation. Owns no chat logic. */
export function ChatTranscript({
  messages,
  status,
  onLaunch,
}: ChatTranscriptProps) {
  const scrollRef = useAutoScroll(`${messages.length}:${status}`);
  const isEmpty = messages.length === 0 && status === "idle";

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hairline min-h-0 flex-1 overflow-y-auto"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 pb-8 sm:px-6">
        {isEmpty ? (
          <EntryPointPrompt onLaunch={onLaunch} />
        ) : (
          <>
            <div className="h-6" />
            {messages.map((message) => (
              <ChatTurn key={message.id} message={message} />
            ))}
            {status === "working" ? <PendingTurn /> : null}
          </>
        )}
      </div>
    </div>
  );
}
