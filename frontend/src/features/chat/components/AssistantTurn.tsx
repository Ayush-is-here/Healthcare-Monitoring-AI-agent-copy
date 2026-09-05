export interface AssistantTurnProps {
  text: string;
}

/**
 * A free-form reply from the assistant. Mirrors UserTurn, but on the
 * left and on a light surface. `whitespace-pre-wrap` preserves the
 * line breaks the model sends — the app has no Markdown renderer yet,
 * so the text is shown as-is rather than parsed.
 */
export function AssistantTurn({ text }: AssistantTurnProps) {
  return (
    <div className="animate-rise-in flex justify-start">
      <p className="type-body-sm max-w-[52ch] whitespace-pre-wrap rounded-panel rounded-bl-[4px] bg-white px-4 py-3 text-graphite shadow-card">
        {text}
      </p>
    </div>
  );
}
