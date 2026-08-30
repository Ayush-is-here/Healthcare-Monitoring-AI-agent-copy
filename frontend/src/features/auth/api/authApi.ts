import { http } from "@/lib/http";
import {
  currentUserSchema,
  loginResponseSchema,
  registerResponseSchema,
  type CurrentUser,
  type LoginCredentials,
  type LoginResponse,
  type RegisterCredentials,
  type RegisterResponse,
} from "@/features/auth/types";

/**
 * The login endpoint is an OAuth2 password flow, so it expects
 * form-encoded fields with the email supplied as `username`.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", credentials.email);
  body.set("password", credentials.password);

  const { data } = await http.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return loginResponseSchema.parse(data);
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const { data } = await http.get("/auth/me");
  return currentUserSchema.parse(data);
}

/**
 * Creates the account. Unlike login this returns the user record
 * rather than a token, so callers that want an authenticated session
 * have to follow up with `login`.
 */
export async function registerAccount(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const { data } = await http.post("/auth/register", credentials);
  return registerResponseSchema.parse(data);
}
