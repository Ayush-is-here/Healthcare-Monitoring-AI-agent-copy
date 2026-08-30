import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: ReactNode;
  error?: string | null;
}

/**
 * Label + input + message, wired together so the caller never has
 * to invent an id or remember aria-describedby.
 */
export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-body-sm text-graphite font-medium">
        {label}
      </label>

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          "type-body-sm h-11 w-full rounded-input bg-white px-3.5",
          "border border-silver text-graphite placeholder:text-stone",
          "transition-[border-color,box-shadow] duration-200",
          "hover:border-stone/60",
          "focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
          error && "border-critical focus:border-critical focus:ring-critical/10",
          className,
        )}
        {...props}
      />

      {message ? (
        <p
          id={messageId}
          className={cn(
            "type-caption",
            error ? "text-critical" : "text-slate",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
