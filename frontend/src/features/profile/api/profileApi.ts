import { http, toApiError } from "@/lib/http";
import {
  patientProfileSchema,
  type CreateProfilePayload,
  type PatientProfile,
  type UpdateProfilePayload,
} from "@/features/profile/types";

/**
 * GET /profile/
 *
 * Returns null rather than throwing when the profile does not exist
 * yet — for a freshly registered account that is the expected state,
 * not an error the caller should handle as one.
 */
export async function fetchProfile(): Promise<PatientProfile | null> {
  try {
    const { data } = await http.get("/profile/");
    return patientProfileSchema.parse(data);
  } catch (error) {
    const apiError = toApiError(error);

    if (apiError.status === 404) return null;

    /* Normalised so the gate can render `error.message` without
       reaching into axios internals. */
    throw apiError;
  }
}

export async function createProfile(
  payload: CreateProfilePayload,
): Promise<PatientProfile> {
  const { data } = await http.post("/profile/", payload);
  return patientProfileSchema.parse(data);
}

/** PATCH /profile/ — send only the fields that changed. */
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<PatientProfile> {
  const { data } = await http.patch("/profile/", payload);
  return patientProfileSchema.parse(data);
}
