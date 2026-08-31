import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PillButton } from "@/components/primitives/PillButton";
import { SelectField } from "@/components/primitives/SelectField";
import { TextField } from "@/components/primitives/TextField";
import { useCreateMedication } from "@/features/medications/hooks/useCreateMedication";
import {
  emptyMedicationForm,
  medicationFormSchema,
  toMedicationPayload,
  type MedicationFormValues,
} from "@/features/medications/medicationFormSchema";
import { DOSAGE_UNITS, FREQUENCIES } from "@/features/medications/types";

/**
 * Adding a medication.
 *
 * `is_active` is not on the form: `MedicationCreate` forbids extra
 * fields, so sending it is a 422. A new medication is active by
 * definition, and the row can be stood down afterwards.
 */
export function MedicationForm() {
  const createMedication = useCreateMedication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: emptyMedicationForm(),
  });

  const onSubmit = handleSubmit((values) =>
    createMedication.mutate(toMedicationPayload(values), {
      onSuccess: (saved) => {
        /* Cleared completely, unlike the reading form: you rarely add
           the same medication twice. */
        reset(emptyMedicationForm());
        toast.success(`${saved.medicine_name} added.`);
      },
    }),
  );

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

        <SelectField
          label="Unit"
          placeholder="Select…"
          options={DOSAGE_UNITS}
          error={errors.dosage_unit?.message ?? null}
          className="sm:w-36"
          {...register("dosage_unit")}
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

      {createMedication.error ? (
        <p role="alert" className="type-body-sm text-critical">
          {createMedication.error.message}
        </p>
      ) : null}

      <PillButton
        type="submit"
        size="lg"
        disabled={createMedication.isPending}
        className="w-full sm:w-fit sm:self-start"
      >
        {createMedication.isPending ? "Saving…" : "Add medication"}
      </PillButton>
    </form>
  );
}
