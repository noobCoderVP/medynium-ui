import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import type { StreamEvent } from "@/lib/api/events";
import { AgentProvider, useAgent } from "./agent-context";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  usePathname: () => "/patients/P-1",
  useParams: () => ({ patientId: "P-1" }),
}));

const streamPost = vi.fn();
vi.mock("@/lib/api/sse", () => ({ streamPost: (...args: unknown[]) => streamPost(...args) }));

function Harness() {
  const { turns, ask, running } = useAgent();
  return (
    <div>
      <button onClick={() => ask("What changed?")}>ask</button>
      <p data-testid="running">{String(running)}</p>
      {turns.map((t) => (
        <p key={t.id} data-testid="turn">
          {t.status}|{t.steps.map((s) => s.label).join(",")}|
          {t.answers.map((a) => a.short_answer).join(",")}|{t.error?.code ?? ""}
        </p>
      ))}
    </div>
  );
}

const mount = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AgentProvider>
        <Harness />
      </AgentProvider>
    </QueryClientProvider>,
  );

const answer = {
  answer_id: "ANS-1",
  kind: "CHANGED",
  patient_id: "P-1",
  short_answer: "Two changes.",
  considerations: [],
  limits: { checked: [], not_checked: [], notes: [] },
  conflicts: [],
  created_at: "2026-10-03T00:00:00Z",
};

/** Makes the mocked stream replay events, then finish. */
const replay = (events: StreamEvent[]) =>
  streamPost.mockImplementation(
    async (_path: string, opts: { onEvent: (e: StreamEvent) => void }) => {
      for (const event of events) opts.onEvent(event);
    },
  );

beforeEach(() => {
  push.mockClear();
  streamPost.mockReset();
  localStorage.clear();
});

describe("AgentProvider", () => {
  it("sends the open screen and patient, then shows the steps and answer", async () => {
    replay([
      { type: "route", data: { route: "changed", model: null, cost_note: "no model call" } },
      { type: "step", data: { step_id: "s1", label: "Reading changes", status: "done" } },
      { type: "answer", data: answer as never },
      { type: "done", data: { audit_id: "AUD-1" } },
    ]);
    mount();
    await userEvent.click(screen.getByText("ask"));
    await waitFor(() =>
      expect(screen.getByTestId("turn")).toHaveTextContent("done|Reading changes|Two changes."),
    );
    expect(streamPost).toHaveBeenCalledWith(
      "/copilot/ask",
      expect.objectContaining({
        body: { question: "What changed?", screen: "patient", patient_id: "P-1", history: [] },
      }),
    );
  });

  it("turns an open_patient action into a URL change, nothing else", async () => {
    replay([
      {
        type: "action",
        data: {
          action: "open_patient",
          params: {},
          status: "done",
          result: { patient_id: "P-9", name: "X" },
        },
      },
      { type: "done", data: {} },
    ]);
    mount();
    await userEvent.click(screen.getByText("ask"));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/patients/P-9"));
  });

  it("records an unavailable assistant as a failed turn without throwing", async () => {
    streamPost.mockRejectedValue(new ApiError(503, "agent_unavailable", "down"));
    mount();
    await userEvent.click(screen.getByText("ask"));
    await waitFor(() => expect(screen.getByTestId("turn")).toHaveTextContent("failed||"));
    expect(screen.getByTestId("turn")).toHaveTextContent("agent_unavailable");
    expect(screen.getByTestId("running")).toHaveTextContent("false");
  });

  it("passes the last two questions as history", async () => {
    replay([{ type: "done", data: {} }]);
    mount();
    for (let i = 0; i < 3; i++) await userEvent.click(screen.getByText("ask"));
    await waitFor(() => expect(streamPost).toHaveBeenCalledTimes(3));
    expect(streamPost.mock.calls[2][1].body.history).toEqual(["What changed?", "What changed?"]);
  });

  it("ignores a second question while one is running", async () => {
    let finish: () => void = () => {};
    streamPost.mockImplementation(() => new Promise<void>((resolve) => (finish = resolve)));
    mount();
    await userEvent.click(screen.getByText("ask"));
    await userEvent.click(screen.getByText("ask"));
    expect(streamPost).toHaveBeenCalledTimes(1);
    await act(async () => finish());
    await waitFor(() => expect(screen.getByTestId("running")).toHaveTextContent("false"));
  });
});
