import { http } from "@/lib/http";
import { chatReplySchema, type ChatReply } from "@/features/chat/types";

/**
 * POST /ai/chat
 *
 * Sends one free-form message. The server persists it, pulls the
 * recent history and the patient's health context, and returns the
 * assistant's reply — the request carries nothing but the text.
 */
export async function sendChatMessage(
  message: string,
  signal?: AbortSignal,
): Promise<ChatReply> {
  const { data } = await http.post("/ai/chat", { message }, { signal });
  return chatReplySchema.parse(data);
}
