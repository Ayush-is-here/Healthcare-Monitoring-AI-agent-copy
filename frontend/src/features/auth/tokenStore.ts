/**
 * Access-token persistence.
 *
 * Kept outside React so the axios interceptor can read it
 * synchronously, with a tiny subscription so components can still
 * re-render when it changes.
 */

const STORAGE_KEY = "aurea.access_token";

type Listener = () => void;

const listeners = new Set<Listener>();

let cached: string | null = null;
let hydrated = false;

function hydrate(): void {
  if (hydrated) return;

  try {
    cached = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private browsing or a blocked storage partition — hold the
    // token in memory for this tab only.
    cached = null;
  }

  hydrated = true;
}

export function readToken(): string | null {
  hydrate();
  return cached;
}

export function writeToken(token: string): void {
  hydrate();
  cached = token;

  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* memory-only fallback */
  }

  emit();
}

export function clearToken(): void {
  hydrate();
  cached = null;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* memory-only fallback */
  }

  emit();
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeToToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
