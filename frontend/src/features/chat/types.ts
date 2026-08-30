import type { HealthInsight } from "@/features/health-insight/types";

/**
 * A turn in the transcript.
 *
 * Discriminated on `kind` so the renderer can dispatch without
 * knowing which feature produced the turn — adding a second
 * capability later means adding a variant here and a branch in
 * ChatTurn, nothing more.
 */
export type ChatMessage =
  | {
      kind: "user";
      id: string;
      text: string;
      createdAt: number;
    }
  | {
      kind: "insight";
      id: string;
      insight: HealthInsight;
      createdAt: number;
    }
  | {
      kind: "notice";
      id: string;
      tone: "info" | "error";
      title: string;
      body?: string;
      createdAt: number;
    };

export type ChatStatus = "idle" | "working";

/** Which capabilities the chat can currently invoke. */
export type ChatEntryPointId = "HEALTH_INSIGHT";

export interface ChatEntryPoint {
  id: ChatEntryPointId;
  eyebrow: string;
  label: string;
  description: string;
  /** Echoed into the transcript as the user's own turn. */
  utterance: string;
  available: boolean;
}
