import { z } from "zod";

import type {
  CreateProfilePayload,
  PatientProfile,
  UpdateProfilePayload,
} from "@/features/profile/types";

/* Bounds mirror the exclusive gt/lt on PatientProfileCreate. Kept
   client-side so a typo is caught before a round trip. */
const MIN_HEIGHT_CM = 30;
const MAX_HEIGHT_CM = 300;
const MIN_WEIGHT_KG = 2;
const MAX_WEIGHT_KG = 500;

/* Number inputs hand back strings, so the range check runs on the
   parsed value and the conversion happens on the way out. */
const measurement = (noun: string, min: number, max: number, unit: string) =>
  z
    .string()
    .min(1, `Enter your ${noun}`)
    .refine((value) => !Number.isNaN(Number(value)), "Enter a number")
    .refine(
      (value) => Number(value) > min && Number(value) < max,
      `Enter a ${noun} between ${min} and ${max} ${unit}`,
    );

/**
 * One schema for onboarding and for editing.
 *
 * PATCH accepts a subset, but a field the user has chosen to touch
 * has to satisfy the same rules either way — so the difference lives
 * in what gets *sent*, not in what counts as valid.
 */
export const profileFormSchema = z.object({
  date_of_birth: z
    .string()
    .min(1, "Enter your date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date")
    .refine(
      (value) => new Date(value) <= new Date(),
      "Date of birth cannot be in the future",
    ),
  gender: z.string().min(1, "Select an option"),
  height_cm: measurement("height", MIN_HEIGHT_CM, MAX_HEIGHT_CM, "cm"),
  weight_kg: measurement("weight", MIN_WEIGHT_KG, MAX_WEIGHT_KG, "kg"),
  blood_group: z.string().min(1, "Select an option"),
  smoking_status: z.string().min(1, "Select an option"),
  drinking_status: z.string().min(1, "Select an option"),
  allergies: z.string(),
  chronic_conditions: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  date_of_birth: "",
  gender: "",
  height_cm: "",
  weight_kg: "",
  blood_group: "",
  smoking_status: "",
  drinking_status: "",
  allergies: "",
  chronic_conditions: "",
};

/**
 * Form strings to wire payload; the measurements are the only cast.
 * Allergies and chronic_conditions are converted from comma-separated strings to arrays.
 */
export function toProfilePayload(
  values: ProfileFormValues,
): CreateProfilePayload & { allergies?: string[]; chronic_conditions?: string[] } {
  const allergiesArray = values.allergies
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const chronicConditionsArray = values.chronic_conditions
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    date_of_birth: values.date_of_birth,
    gender: values.gender,
    height_cm: Number(values.height_cm),
    weight_kg: Number(values.weight_kg),
    blood_group: values.blood_group,
    smoking_status: values.smoking_status,
    drinking_status: values.drinking_status,
    ...(allergiesArray.length > 0 && { allergies: allergiesArray }),
    ...(chronicConditionsArray.length > 0 && { chronic_conditions: chronicConditionsArray }),
  };
}

/**
 * A stored profile as form values.
 *
 * Inputs deal in strings, and `date_of_birth` already arrives as
 * `YYYY-MM-DD`, which is exactly what a date input wants.
 * Allergies and chronic_conditions are converted from arrays to comma-separated strings.
 */
export function toProfileFormValues(
  profile: PatientProfile,
): ProfileFormValues {
  return {
    date_of_birth: profile.date_of_birth,
    gender: profile.gender,
    height_cm: String(profile.height_cm),
    weight_kg: String(profile.weight_kg),
    blood_group: profile.blood_group,
    smoking_status: profile.smoking_status,
    drinking_status: profile.drinking_status,
    allergies: profile.allergies?.join(', ') ?? '',
    chronic_conditions: profile.chronic_conditions?.join(', ') ?? '',
  };
}

/**
 * Narrows a full form to just what the user touched.
 *
 * `PatientProfileUpdate` is applied with `exclude_unset`, so an
 * untouched field must be absent rather than resent — that keeps a
 * save from overwriting a column with a value the user never looked at.
 */
export function toProfilePatch(
  values: ProfileFormValues,
  dirtyFields: Partial<Record<keyof ProfileFormValues, boolean>>,
): UpdateProfilePayload {
  const full = toProfilePayload(values);
  const patch: UpdateProfilePayload = {};

  for (const key of Object.keys(full) as (keyof CreateProfilePayload)[]) {
    if (dirtyFields[key]) {
      Object.assign(patch, { [key]: full[key] });
    }
  }

  return patch;
}
