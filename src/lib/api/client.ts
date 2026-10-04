import { ApiError } from "./errors";
import type { Health } from "./types";

export { ApiError } from "./errors";
export type { Health } from "./types";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Set on streams so the response is returned unparsed. */
  accept?: string;
}

let refreshInFlight: Promise<boolean> | null = null;

/** One refresh at a time; concurrent 401s share it. */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
    headers: { "X-Medynium-Client": "web" },
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

export function redirectToSignIn(): void {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/sign-in")) return;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  // A hard navigation on purpose: it discards every in-memory cache and half-finished request.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `/sign-in?next=${next}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
    details?: unknown;
  } | null;
  const retryAfter = Number(response.headers.get("Retry-After"));
  return new ApiError(
    response.status,
    body?.error ?? "unknown",
    body?.message ?? response.statusText,
    response.headers.get("X-Request-Id"),
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
    body?.details ?? null,
  );
}

/** Same-origin call to /api/*. On 401 it refreshes the session once and retries, then goes to sign-in. */
export async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const method = options.method ?? "GET";
  const send = () =>
    fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      signal: options.signal,
      // A file goes up as its own bytes (the type and name travel in headers); everything else is JSON.
      body:
        options.body === undefined
          ? undefined
          : options.body instanceof Blob
            ? options.body
            : JSON.stringify(options.body),
      headers: {
        Accept: options.accept ?? "application/json",
        ...(options.body === undefined || options.body instanceof Blob
          ? {}
          : { "Content-Type": "application/json" }),
        ...(method === "GET" ? {} : { "X-Medynium-Client": "web" }),
        ...options.headers,
      },
    });

  let response = await send();
  // Sign-in and refresh answer 401 for ordinary reasons (wrong password); they never trigger a refresh.
  if (response.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshSession()) response = await send();
    if (response.status === 401) {
      redirectToSignIn();
      throw await toApiError(response);
    }
  }
  if (!response.ok) throw await toApiError(response);
  return response;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(path, options);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const get = <T>(path: string, signal?: AbortSignal) => apiFetch<T>(path, { signal });
export const post = <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
  apiFetch<T>(path, { method: "POST", body, headers });
export const put = <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "PUT", body });
export const patch = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: "PATCH", body });
export const del = <T = void>(path: string) => apiFetch<T>(path, { method: "DELETE" });

export const getHealth = () => get<Health>("/health");
