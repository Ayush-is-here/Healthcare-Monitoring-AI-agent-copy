import { useCallback, useMemo, useReducer } from "react";

import type { ChatMessage, ChatStatus } from "@/features/chat/types";
import type { HealthInsight } from "@/features/health-insight/types";

interface ChatState {
  messages: ChatMessage[];
  status: ChatStatus;
}

type ChatAction =
  | { type: "append"; message: ChatMessage }
  | { type: "status"; status: ChatStatus }
  | { type: "reset" };

const INITIAL_STATE: ChatState = { messages: [], status: "idle" };

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "append":
      return { ...state, messages: [...state.messages, action.message] };
    case "status":
      return { ...state, status: action.status };
    case "reset":
      return INITIAL_STATE;
    default:
      return state;
  }
}

let sequence = 0;

function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

/**
 * Transcript state for one chat session.
 *
 * Deliberately local rather than global: a transcript belongs to the
 * view that renders it, and nothing outside the chat needs to read it.
 */
export function useChatSession() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const appendUser = useCallback((text: string) => {
    dispatch({
      type: "append",
      message: { kind: "user", id: nextId("user"), text, createdAt: Date.now() },
    });
  }, []);

  const appendInsight = useCallback((insight: HealthInsight) => {
    dispatch({
      type: "append",
      message: {
        kind: "insight",
        id: nextId("insight"),
        insight,
        createdAt: Date.now(),
      },
    });
  }, []);

  const appendNotice = useCallback(
    (title: string, body?: string, tone: "info" | "error" = "error") => {
      dispatch({
        type: "append",
        message: {
          kind: "notice",
          id: nextId("notice"),
          tone,
          title,
          body,
          createdAt: Date.now(),
        },
      });
    },
    [],
  );

  const setStatus = useCallback((status: ChatStatus) => {
    dispatch({ type: "status", status });
  }, []);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return useMemo(
    () => ({
      messages: state.messages,
      status: state.status,
      isEmpty: state.messages.length === 0,
      appendUser,
      appendInsight,
      appendNotice,
      setStatus,
      reset,
    }),
    [
      state.messages,
      state.status,
      appendUser,
      appendInsight,
      appendNotice,
      setStatus,
      reset,
    ],
  );
}

export type ChatSession = ReturnType<typeof useChatSession>;
