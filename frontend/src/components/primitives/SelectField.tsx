import { useId, type ReactNode, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "children"> {
  label: string;
  options: readonly SelectOption[];
  /** Shown as a disabled first option while nothing is chosen. */
  placeholder?: string;
  hint?: ReactNode;
  error?: string | null;
}

/**
 * Native select dressed to match {@link TextField}. Native because
 * the control is a plain one-of-N choice, and the platform already
 * gets keyboard, screen reader, and mobile pickers right.
 */
export function SelectField({
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-body-sm text-graphite font-medium">
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "type-body-sm h-11 w-full appearance-none rounded-input bg-white",
            "border border-silver pl-3.5 pr-10 text-graphite",
            "transition-[border-color,box-shadow] duration-200",
            "hover:border-stone/60",
            "focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
            error &&
              "border-critical focus:border-critical focus:ring-critical/10",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron. aria-hidden — the select announces itself. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="text-stone pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {message ? (
        <p
          id={messageId}
          className={cn("type-caption", error ? "text-critical" : "text-slate")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
