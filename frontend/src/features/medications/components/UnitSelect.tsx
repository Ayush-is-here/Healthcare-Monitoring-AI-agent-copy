import { useId } from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { MedicationUnitIcon } from "@/features/medications/medicationIcons";
import { DOSAGE_UNITS } from "@/features/medications/types";
import { cn } from "@/lib/utils";

export interface UnitSelectProps {
  label: string;
  /** Controlled value — the DosageUnit wire value, or `""` when unset. */
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  /** Applied to the outer wrapper, so the caller can size the column. */
  className?: string;
}

const UNIT_LABEL: Record<string, string> = Object.fromEntries(
  DOSAGE_UNITS.map((unit) => [unit.value, unit.label]),
);

/**
 * The dosage-unit chooser.
 *
 * A Base UI Select rather than the native {@link SelectField}, for the
 * one thing a native `<select>` cannot do: draw the dosage-form glyph
 * beside every option in the open list, not only on the trigger once a
 * unit is chosen. Dressed to match `SelectField` down to the height,
 * radius, border and focus ring, so the Dose and Unit controls read as
 * one pair. Controlled, so react-hook-form drives it through a
 * `Controller` (see {@link MedicationForm}).
 */
export function UnitSelect({
  label,
  value,
  onValueChange,
  onBlur,
  error,
  className,
}: UnitSelectProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const selectedLabel = value ? (UNIT_LABEL[value] ?? value) : null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-body-sm text-graphite font-medium">
        {label}
      </label>

      {/* Base UI can emit `null` for "no selection"; the form field is
          a plain string where "" means unset, so null folds to "". */}
      <SelectPrimitive.Root
        value={value}
        onValueChange={(next) => onValueChange(next ?? "")}
      >
        <SelectPrimitive.Trigger
          id={id}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          className={cn(
            "type-body-sm flex h-11 w-full items-center gap-2.5 rounded-input bg-white",
            "border border-silver pr-3 pl-3.5 text-graphite select-none",
            "transition-[border-color,box-shadow] duration-200",
            "hover:border-stone/60",
            "focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10",
            "data-[popup-open]:border-ink data-[popup-open]:ring-2 data-[popup-open]:ring-ink/10",
            error &&
              "border-critical focus:border-critical focus:ring-critical/10 data-[popup-open]:border-critical data-[popup-open]:ring-critical/10",
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            {selectedLabel ? (
              <>
                <MedicationUnitIcon
                  unit={value}
                  aria-hidden
                  className="text-stone size-4 shrink-0"
                  strokeWidth={1.5}
                />
                <span className="truncate">{selectedLabel}</span>
              </>
            ) : (
              <span className="text-stone">Select…</span>
            )}
          </span>

          <SelectPrimitive.Icon
            render={
              <ChevronDown
                aria-hidden
                className="text-stone size-4 shrink-0"
                strokeWidth={1.5}
              />
            }
          />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner
            side="bottom"
            sideOffset={6}
            align="start"
            alignItemWithTrigger={false}
            className="z-50"
          >
            <SelectPrimitive.Popup
              className={cn(
                "max-h-[var(--available-height)] min-w-[var(--anchor-width)]",
                "overflow-y-auto rounded-panel bg-white p-1 shadow-ringed",
                "transition-[opacity,transform] duration-200 ease-[var(--ease-out-soft)]",
                "data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0",
                "data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0",
              )}
            >
              <SelectPrimitive.List>
                {DOSAGE_UNITS.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "type-body-sm flex cursor-default items-center gap-2.5",
                      "text-graphite rounded-input px-2.5 py-2 select-none",
                      "outline-none data-[highlighted]:bg-paper-deep",
                    )}
                  >
                    <MedicationUnitIcon
                      unit={option.value}
                      aria-hidden
                      className="text-stone size-4 shrink-0"
                      strokeWidth={1.5}
                    />
                    <SelectPrimitive.ItemText className="flex-1">
                      {option.label}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator
                      render={
                        <Check
                          aria-hidden
                          className="text-ink size-4 shrink-0"
                          strokeWidth={2}
                        />
                      }
                    />
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.List>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error ? (
        <p id={messageId} className="type-caption text-critical">
          {error}
        </p>
      ) : null}
    </div>
  );
}
