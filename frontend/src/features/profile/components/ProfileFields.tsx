import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { SelectField } from "@/components/primitives/SelectField";
import { TextField } from "@/components/primitives/TextField";
import type { ProfileFormValues } from "@/features/profile/profileFormSchema";
import {
  BLOOD_GROUPS,
  DRINKING_STATUSES,
  GENDERS,
  SMOKING_STATUSES,
} from "@/features/profile/types";

export interface ProfileFieldsProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

/**
 * The seven fields `PatientProfileCreate` requires, in one place so
 * onboarding and editing cannot drift apart.
 */
export function ProfileFields({ register, errors }: ProfileFieldsProps) {
  return (
    <>
      <TextField
        label="Date of birth"
        type="date"
        autoComplete="bday"
        error={errors.date_of_birth?.message ?? null}
        {...register("date_of_birth")}
      />

      <SelectField
        label="Gender"
        placeholder="Select…"
        options={GENDERS}
        error={errors.gender?.message ?? null}
        {...register("gender")}
      />

      <TextField
        label="Height"
        type="number"
        inputMode="decimal"
        step="0.1"
        placeholder="Centimetres — e.g. 172"
        error={errors.height_cm?.message ?? null}
        {...register("height_cm")}
      />

      <TextField
        label="Weight"
        type="number"
        inputMode="decimal"
        step="0.1"
        placeholder="Kilograms — e.g. 68"
        error={errors.weight_kg?.message ?? null}
        {...register("weight_kg")}
      />

      <SelectField
        label="Blood group"
        placeholder="Select…"
        options={BLOOD_GROUPS}
        error={errors.blood_group?.message ?? null}
        {...register("blood_group")}
      />

      <SelectField
        label="Smoking"
        placeholder="Select…"
        options={SMOKING_STATUSES}
        error={errors.smoking_status?.message ?? null}
        {...register("smoking_status")}
      />

      <SelectField
        label="Drinking"
        placeholder="Select…"
        options={DRINKING_STATUSES}
        error={errors.drinking_status?.message ?? null}
        {...register("drinking_status")}
      />
    </>
  );
}
