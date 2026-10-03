import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { DataState, type QueryLike } from "./data-state";

const query = (over: Partial<QueryLike<string[]>>): QueryLike<string[]> => ({
  isPending: false,
  isError: false,
  error: null,
  data: ["a"],
  refetch: vi.fn(),
  ...over,
});

const show = (q: QueryLike<string[]>, extra: Record<string, unknown> = {}) =>
  render(
    <DataState query={q} {...extra}>
      {(items) => <p>{items.join(",")}</p>}
    </DataState>,
  );

describe("DataState (the state matrix)", () => {
  it("shows a loading status while pending", () => {
    show(query({ isPending: true, data: undefined }));
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("renders the data when loaded", () => {
    show(query({}));
    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("renders the empty state when there is nothing", () => {
    show(query({ data: [] }), {
      isEmpty: (d: string[]) => d.length === 0,
      empty: <p>Nothing here</p>,
    });
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("shows the supplied not-found state for a 404, whether denied or missing", () => {
    show(query({ isError: true, data: undefined, error: new ApiError(404, "not_found", "x") }), {
      notFound: <p>We couldn&apos;t find that patient.</p>,
    });
    expect(screen.getByText(/couldn't find that patient/i)).toBeInTheDocument();
  });

  it("shows an error with the request id and a working retry", async () => {
    const refetch = vi.fn();
    show(
      query({
        isError: true,
        data: undefined,
        refetch,
        error: new ApiError(500, "internal_error", "boom", "req-9"),
      }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent("req-9");
    expect(screen.queryByText("boom")).not.toBeInTheDocument(); // no server text for a 5xx
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(refetch).toHaveBeenCalled();
  });

  it("shows the agent-unavailable state for agent_unavailable", () => {
    show(
      query({ isError: true, data: undefined, error: new ApiError(503, "agent_unavailable", "x") }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(/assistant is unavailable/i);
  });

  it("shows a countdown for a rate limit", () => {
    show(
      query({
        isError: true,
        data: undefined,
        error: new ApiError(429, "rate_limited", "x", null, 12),
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("12 seconds");
  });

  it("says a 501 is not available yet", () => {
    show(
      query({
        isError: true,
        data: undefined,
        error: new ApiError(501, "not_implemented", "stub"),
      }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/isn't available yet/i);
  });
});
