import type { ChatEntryPoint, ChatEntryPointId } from "@/features/chat/types";

/**
 * The chat shell offers exactly what this registry advertises.
 *
 * Health Insight is the only capability the API exposes today. When
 * the server grows a free-form chat branch, add an entry here and
 * ungate the composer — the shell needs no other change.
 */
export const CHAT_ENTRY_POINTS: readonly ChatEntryPoint[] = [
  {
    id: "HEALTH_INSIGHT",
    eyebrow: "Available now",
    label: "Health Insight",
    description:
      "A full review of your record — metrics, medications and appointments — checked against current clinical literature.",
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

/** Free-form input stays closed until a second entry point exists. */
export const COMPOSER_UNLOCKED = CHAT_ENTRY_POINTS.length > 1;
