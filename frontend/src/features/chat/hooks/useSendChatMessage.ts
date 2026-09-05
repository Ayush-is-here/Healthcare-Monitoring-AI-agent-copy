import { useMutation } from "@tanstack/react-query";

import { sendChatMessage } from "@/features/chat/api/chatApi";
import type { ChatReply } from "@/features/chat/types";
import { toApiError, type ApiError } from "@/lib/http";

/**
 * One chat turn. Modelled as a mutation rather than a query because
 * it is an explicit, user-triggered, side-effectful action — the
 * server persists the message — and must never fire on mount or
 * refocus. The mutation variable is the message text.
 */
export function useSendChatMessage(options: {
  onSuccess: (reply: ChatReply) => void;
  onError: (error: ApiError) => void;
}) {
  return useMutation<ChatReply, ApiError, string>({
    mutationFn: async (message: string) => {
      try {
        return await sendChatMessage(message);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}
