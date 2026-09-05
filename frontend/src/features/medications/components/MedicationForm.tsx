import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { SelectField } from "@/components/primitives/SelectField";
import { TextField } from "@/components/primitives/TextField";
import { UnitSelect } from "@/features/medications/components/UnitSelect";
import { useCreateMedication } from "@/features/medications/hooks/useCreateMedication";
import { useUpdateMedication } from "@/features/medications/hooks/useUpdateMedication";
import {
  emptyMedicationForm,
  medicationFormSchema,
  medicationToFormValues,
  toMedicationPayload,
  toMedicationUpdatePayload,
  type MedicationFormValues,
} from "@/features/medications/medicationFormSchema";
import { FREQUENCIES, type Medication } from "@/features/medications/types";

export interface MedicationFormProps {
  /**
   * When present, the form edits this medication in place instead of
   * adding a new one: pre-filled, saving through PATCH, with a Cancel.
   */
  medication?: Medication;
  /** Leaves edit mode — called after a successful save or on Cancel. */
  onDone?: () => void;
}

/**
 * Adding a medication, or editing one.
 *
 * `is_active` is on neither path: `MedicationCreate` forbids extra fields
 * so sending it on add is a 422, and on edit the "no longer taking"
 * toggle owns it (see `MedicationRow`). A new medication is active by
 * definition, and any row can be stood down from that toggle afterwards.
 */
export function MedicationForm({ medication, onDone }: MedicationFormProps = {}) {
  const editing = medication !== undefined;
  const createMedication = useCreateMedication();
  const updateMedication = useUpdateMedication();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: medication
      ? medicationToFormValues(medication)
      : emptyMedicationForm(),
  });

  const mutation = editing ? updateMedication : createMedication;

  const onSubmit = handleSubmit((values) => {
    if (medication) {
      updateMedication.mutate(
        {
          medicationId: medication.id,
          patch: toMedicationUpdatePayload(values),
        },
        {
          onSuccess: (saved) => {
            toast.success(`${saved.medicine_name} updated.`);
            onDone?.();
          },
        },
      );
      return;
    }

    createMedication.mutate(toMedicationPayload(values), {
      onSuccess: (saved) => {
        /* Cleared completely, unlike the reading form: you rarely add
           the same medication twice. */
        reset(emptyMedicationForm());
        toast.success(`${saved.medicine_name} added.`);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <TextField
        label="Medicine"
        placeholder="e.g. Metformin"
        autoComplete="off"
        error={errors.medicine_name?.message ?? null}
        {...register("medicine_name")}
      />

      {/* A dose without its unit means nothing, so the two share a row. */}
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <TextField
          label="Dose"
          type="number"
          inputMode="decimal"
          /* `any`, not a fixed step: 0.125 mg is a real prescription. */
          step="any"
          min="0"
          placeholder="e.g. 500"
          error={errors.dosage?.message ?? null}
          {...register("dosage")}
        />

        {/* Its own dropdown, not a native `SelectField`: the open list
            shows a glyph beside every unit, which a `<select>` can't
            render. Controlled, so it goes through `Controller`. */}
        <Controller
          control={control}
          name="dosage_unit"
          render={({ field }) => (
            <UnitSelect
              label="Unit"
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.dosage_unit?.message ?? null}
              className="sm:w-36"
            />
          )}
        />
      </div>

      <SelectField
        label="How often"
        placeholder="Select…"
        options={FREQUENCIES}
        error={errors.frequency?.message ?? null}
        {...register("frequency")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Started"
          type="date"
          hint="Defaults to today."
          error={errors.start_date?.message ?? null}
          {...register("start_date")}
        />

        <TextField
          label="Ends"
          type="date"
          hint="Leave blank if it's ongoing."
          error={errors.end_date?.message ?? null}
          {...register("end_date")}
        />
      </div>

      <TextField
        label="Instructions"
        placeholder="e.g. Take with food"
        autoComplete="off"
        hint="Optional."
        error={errors.instructions?.message ?? null}
        {...register("instructions")}
      />

      {mutation.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {mutation.error.message}
        </p>
      ) : null}

      {/* In edit mode the pair sits inline — Cancel leaves without
          saving and the primary label names the action. On add there is
          nothing to cancel back to, so the button stands alone. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillButton
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="w-full sm:w-fit"
        >
          {mutation.isPending
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Add medication"}
        </PillButton>

        {editing ? (
          <PillButton
            type="button"
            variant="ghost"
            size="lg"
            disabled={mutation.isPending}
            onClick={() => onDone?.()}
            className="w-full sm:w-fit"
          >
            Cancel
          </PillButton>
        ) : null}
      </div>
    </form>
  );
}
