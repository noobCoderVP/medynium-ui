import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

afterEach(() => vi.unstubAllGlobals());

const respond = (body: unknown, status: number) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );

describe("apiFetch", () => {
  it("calls the same-origin /api proxy", async () => {
    respond({ status: "ok" }, 200);
    await apiFetch("/health");
    expect(fetch).toHaveBeenCalledWith(
      "/api/health",
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });

  it("turns the error contract into an ApiError", async () => {
    respond({ error: "not_found", message: "The requested resource was not found." }, 404);
    await expect(apiFetch("/patients/x")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
    });
    await expect(apiFetch("/patients/x")).rejects.toBeInstanceOf(ApiError);
  });
});
