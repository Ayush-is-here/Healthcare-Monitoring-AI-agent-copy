/**
 * Shared HTTP client.
 *
 * Everything the app sends to the API goes through here so that
 * auth, error shape, and base URL live in exactly one place.
 */
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "@/config/env";
import { clearToken, readToken } from "@/features/auth/tokenStore";

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** Normalised error surface so UI never has to poke at axios internals. */
export interface ApiError {
  status: number | null;
  message: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  isUnauthorized: boolean;
}

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";
const UNREACHABLE_MESSAGE = "Cannot reach the server. Is the API running?";
const TIMEOUT_MESSAGE = "That took longer than expected. Please try again.";

/* The dev proxy answers with a gateway error when nothing is
   listening on the API port, so these mean "never arrived" rather
   than "the API said no". */
const UNREACHABLE_STATUSES = new Set([502, 503, 504]);

function extractMessage(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) return payload;

  if (payload && typeof payload === "object") {
    /* This API wraps every error it raises deliberately as
       { success: false, error: { status_code, message } } — see
       app/core/exceptions/exception_handler.py. */
    const envelope = (payload as { error?: unknown }).error;

    if (envelope && typeof envelope === "object") {
      const enveloped = (envelope as { message?: unknown }).message;
      if (typeof enveloped === "string" && enveloped.trim()) return enveloped;
    }

    const detail = (payload as { detail?: unknown }).detail;

    if (typeof detail === "string" && detail.trim()) return detail;

    // FastAPI validation errors arrive as a list of issue objects.
    if (Array.isArray(detail)) {
      const first = detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === "string") return first.msg;
    }

    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return null;
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? null;
    const isTimeout = axiosError.code === "ECONNABORTED";
    const isUnreachable =
      status === null || UNREACHABLE_STATUSES.has(status);

    let message: string;

    if (isTimeout) {
      message = TIMEOUT_MESSAGE;
    } else if (isUnreachable) {
      message = UNREACHABLE_MESSAGE;
    } else if (status !== null && status >= 500) {
      /* A server-side fault gives the user nothing to act on, and its
         own wording ("Internal server error") reads worse than a
         plain apology. The cause belongs in the server log. */
      message = FALLBACK_MESSAGE;
    } else {
      message = extractMessage(axiosError.response?.data) ?? FALLBACK_MESSAGE;
    }

    return {
      status,
      message,
      isNetworkError: isUnreachable && !isTimeout,
      isTimeout,
      isUnauthorized: status === 401,
    };
  }

  return {
    status: null,
    message: error instanceof Error ? error.message : FALLBACK_MESSAGE,
    isNetworkError: false,
    isTimeout: false,
    isUnauthorized: false,
  };
}

/* A 401 means the stored token is no longer usable — drop it so the
   router can fall back to the sign-in view on the next render. */
http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (toApiError(error).isUnauthorized) {
      clearToken();
    }

    return Promise.reject(error);
  },
);
