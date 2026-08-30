/**
 * Runtime configuration.
 *
 * In development the API is reached through the Vite dev proxy
 * (see vite.config.ts) because the FastAPI app does not register
 * CORS middleware. Set VITE_API_BASE_URL to talk to a deployed
 * API directly.
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "/api";

/** Insight generation runs a planner call, external tool lookups and a
 *  generation call in sequence, so it needs a generous ceiling. */
export const REQUEST_TIMEOUT_MS = 90_000;

export const APP_NAME = "Aurea";
export const APP_TAGLINE = "Health Intelligence";
