import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

afterEach(() => vi.unstubAllGlobals());

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });

const stub = (...responses: Response[]) => {
  const fn = vi.fn();
  for (const response of responses) fn.mockResolvedValueOnce(response);
  vi.stubGlobal("fetch", fn);
  return fn;
};

describe("apiFetch", () => {
  it("calls the same-origin /api proxy", async () => {
    const fetchMock = stub(json({ status: "ok" }, 200));
    await apiFetch("/health");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/health",
      expect.objectContaining({ credentials: "same-origin", method: "GET" }),
    );
  });

  it("adds the client header on non-GET calls only", async () => {
    const fetchMock = stub(json({}, 200), json({}, 200));
    await apiFetch("/health");
    await apiFetch("/auth/login", { method: "POST", body: { a: 1 } });
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty("X-Medynium-Client");
    expect(fetchMock.mock.calls[1][1].headers).toHaveProperty("X-Medynium-Client", "web");
  });

  it("turns the error contract into an ApiError with the request id", async () => {
    stub(
      json({ error: "not_found", message: "The requested resource was not found." }, 404, {
        "X-Request-Id": "req-1",
      }),
    );
    await expect(apiFetch("/patients/x")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
      requestId: "req-1",
    });
  });

  it("refreshes once on 401 and retries the call", async () => {
    const fetchMock = stub(
      json({ error: "unauthorized", message: "x" }, 401),
      json(null, 204),
      json({ ok: true }, 200),
    );
    await expect(apiFetch("/me")).resolves.toEqual({ ok: true });
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual([
      "/api/me",
      "/api/auth/refresh",
      "/api/me",
    ]);
  });

  it("does not refresh for a failed sign-in", async () => {
    const fetchMock = stub(
      json({ error: "unauthorized", message: "Wrong email or password." }, 401),
    );
    await expect(apiFetch("/auth/login", { method: "POST", body: {} })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reads Retry-After on a rate limit", async () => {
    stub(json({ error: "rate_limited", message: "Slow down." }, 429, { "Retry-After": "12" }));
    await expect(apiFetch("/copilot/ask")).rejects.toMatchObject({ retryAfter: 12 });
  });
});
