import { NoticeTurn } from "@/features/chat/components/NoticeTurn";
import { UserTurn } from "@/features/chat/components/UserTurn";
import type { ChatMessage } from "@/features/chat/types";
import { InsightMessage } from "@/features/health-insight/components/InsightMessage";

export interface ChatTurnProps {
  message: ChatMessage;
}

/**
 * The single dispatch point between the chat shell and whatever
 * feature produced a turn. Mirrors the response_type branch on the
 * server: one union, one switch.
 */
export function ChatTurn({ message }: ChatTurnProps) {
  switch (message.kind) {
    case "user":
      return <UserTurn text={message.text} />;

    case "insight":
      return (
        <InsightMessage
          insight={message.insight}
          createdAt={message.createdAt}
        />
      );

    case "notice":
      return (
        <NoticeTurn
          tone={message.tone}
          title={message.title}
          body={message.body}
        />
      );

    default: {
      // Exhaustiveness guard — a new message kind fails the build here.
      const unreachable: never = message;
      return unreachable;
    }
  }
}
