import { z } from "zod";

/** POST /auth/login — response */
export const loginResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

/** GET /auth/me — response */
export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

export interface LoginCredentials {
  email: string;
  password: string;
}

/** POST /auth/register — response (201) */
export const registerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  role: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

/**
 * `role` is omitted on purpose — the API defaults new accounts to
 * `patient`, and self-service sign-up must not let a caller pick a
 * privileged role for itself.
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
