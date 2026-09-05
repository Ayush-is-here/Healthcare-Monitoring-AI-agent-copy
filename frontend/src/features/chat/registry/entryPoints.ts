import type { ChatEntryPoint, ChatEntryPointId } from "@/features/chat/types";

/**
 * The structured actions the chat shell can launch.
 *
 * Free-form questions now go straight to /ai/chat, so the composer is
 * always open; this registry is just the set of one-tap actions
 * offered alongside it. Add an entry to grow that set.
 */
export const CHAT_ENTRY_POINTS: readonly ChatEntryPoint[] = [
  {
    id: "HEALTH_INSIGHT",
    eyebrow: "Available now",
    label: "Health Insight",
    description: "A full clinical review of your record.",
    utterance: "Review my health record and generate an insight.",
    available: true,
  },
];

export function getEntryPoint(id: ChatEntryPointId): ChatEntryPoint {
  const entry = CHAT_ENTRY_POINTS.find((candidate) => candidate.id === id);

  if (!entry) {
    throw new Error(`Unknown chat entry point: ${id}`);
  }

  return entry;
}
