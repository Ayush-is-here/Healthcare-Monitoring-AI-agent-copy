export interface UserTurnProps {
  text: string;
}

/** The reader's own turn. Inverted surface, right-aligned, compact. */
export function UserTurn({ text }: UserTurnProps) {
  return (
    <div className="animate-rise-in flex justify-end">
      <p className="type-body-sm max-w-[46ch] rounded-panel rounded-br-[4px] bg-ink px-4 py-3 text-white">
        {text}
      </p>
    </div>
  );
}
