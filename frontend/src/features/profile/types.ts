import { z } from "zod";

/* Mirrors app/models/enum.py. Values are the wire format; labels are
   what a patient should actually read. */

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "transgender", label: "Transgender" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const BLOOD_GROUPS = [
  { value: "A+", label: "A positive (A+)" },
  { value: "A-", label: "A negative (A−)" },
  { value: "B+", label: "B positive (B+)" },
  { value: "B-", label: "B negative (B−)" },
  { value: "AB+", label: "AB positive (AB+)" },
  { value: "AB-", label: "AB negative (AB−)" },
  { value: "O+", label: "O positive (O+)" },
  { value: "O-", label: "O negative (O−)" },
] as const;

export const SMOKING_STATUSES = [
  { value: "never_smoked", label: "Never smoked" },
  { value: "current_regular", label: "Currently smoke regularly" },
  { value: "current_occasional", label: "Currently smoke occasionally" },
  { value: "former_smoker", label: "Used to smoke" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const DRINKING_STATUSES = [
  { value: "never_drank", label: "Never drank" },
  { value: "current_regular", label: "Currently drink regularly" },
  { value: "current_social", label: "Currently drink socially" },
  { value: "former_drinker", label: "Used to drink" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [string, ...string[]];

export const genderSchema = z.enum(values(GENDERS));
export const bloodGroupSchema = z.enum(values(BLOOD_GROUPS));
export const smokingStatusSchema = z.enum(values(SMOKING_STATUSES));
export const drinkingStatusSchema = z.enum(values(DRINKING_STATUSES));

/**
 * POST /profile/ — request.
 *
 * The server schema is `extra="forbid"`, so this carries only the seven
 * required fields; the optional ones are left unset rather than sent
 * as nulls.
 */
export interface CreateProfilePayload {
  date_of_birth: string;
  gender: string;
  height_cm: number;
  weight_kg: number;
  blood_group: string;
  smoking_status: string;
  drinking_status: string;
}

/**
 * PATCH /profile/ — request.
 *
 * The server applies `exclude_unset`, so an absent key means "leave
 * this column alone" rather than "set it to null".
 */
export type UpdateProfilePayload = Partial<CreateProfilePayload>;

/** GET /profile/ — response. Only the fields the UI reads. */
export const patientProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  date_of_birth: z.string(),
  gender: z.string(),
  height_cm: z.number(),
  weight_kg: z.number(),
  blood_group: z.string(),
  smoking_status: z.string(),
  drinking_status: z.string(),
  allergies: z.array(z.string()).nullable().optional(),
  chronic_conditions: z.array(z.string()).nullable().optional(),
  emergency_contact_name: z.string().nullable().optional(),
  emergency_contact_phone: z.string().nullable().optional(),
  emergency_contact_relationship: z.string().nullable().optional(),
});

export type PatientProfile = z.infer<typeof patientProfileSchema>;
