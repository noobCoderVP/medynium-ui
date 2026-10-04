import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AttentionItem, ChangeSet, GapItem } from "@/lib/api/types";
import { BriefAttention } from "./brief-attention";
import { BriefChanges } from "./brief-changes";
import { BriefGaps } from "./brief-gaps";

const changes = vi.fn();
vi.mock("@/lib/api/endpoints", () => ({
  endpoints: { changes: (...args: unknown[]) => changes(...args) },
}));
vi.mock("@/features/agent-panel", () => ({
  AskButton: ({ label }: { label: string }) => <button>{label}</button>,
}));

const lab = { type: "lab", id: "L1", tab: "labs", query: { lab: "eGFR" } } as const;
const attention: AttentionItem[] = [
  {
    severity: "high",
    kind: "abnormal_lab",
    title: "eGFR 42 mL/min (low)",
    detail: "Down from 47 on 8 Jun 2026 (-11%)",
    date: "2026-09-18",
    source: lab,
  },
  {
    severity: "moderate",
    kind: "medication_start",
    title: "New medicine: Apixaban",
    detail: null,
    date: "2026-10-01",
    source: { type: "medication", id: "M1", tab: "medications", query: {} },
  },
];
const set = (label: string, titles: string[]): ChangeSet => ({
  since: "2026-08-14",
  label,
  counts: { LAB: titles.length },
  items: titles.map((title) => ({
    category: "LAB",
    title,
    detail: null,
    date: "2026-09-18",
    direction: "down",
    source: lab,
  })),
});

const wrap = (node: React.ReactNode) =>
  render(<QueryClientProvider client={new QueryClient()}>{node}</QueryClientProvider>);

beforeEach(() => changes.mockReset());

describe("BriefAttention", () => {
  it("links each item to its record and says the severity in words", () => {
    render(<BriefAttention patientId="P-1" items={attention} high={1} />);
    expect(screen.getByRole("link", { name: "eGFR 42 mL/min (low)" })).toHaveAttribute(
      "href",
      "/patients/P-1?tab=labs&lab=eGFR",
    );
    expect(screen.getByRole("link", { name: "New medicine: Apixaban" })).toHaveAttribute(
      "href",
      "/patients/P-1?tab=medications",
    );
    expect(screen.getByText(/High priority/)).toBeInTheDocument();
    expect(screen.getByText(/Attention · 2 \(1 high\)/)).toBeInTheDocument();
  });

  it("never says all clear when there is nothing", () => {
    render(<BriefAttention patientId="P-1" items={[]} high={0} />);
    expect(screen.getByText(/not a statement that nothing needs a look/i)).toBeInTheDocument();
  });
});

describe("BriefChanges", () => {
  it("shows the previous-visit changes without a request, then fetches a longer window on demand", async () => {
    changes.mockResolvedValue(set("in the last year", ["a", "b", "c"]));
    wrap(
      <BriefChanges patientId="P-1" initial={set("since the previous visit", ["eGFR 47 to 42"])} />,
    );
    expect(screen.getByText("1 change since the previous visit")).toBeInTheDocument();
    expect(changes).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "1 year" }));
    await waitFor(() => expect(screen.getByText("3 changes in the last year")).toBeInTheDocument());
    expect(changes).toHaveBeenCalledWith("P-1", "1y");
  });
});

describe("BriefGaps", () => {
  it("lists what is missing and never claims the record is complete", () => {
    const gaps: GapItem[] = [
      {
        kind: "monitoring",
        title: "LDL not seen in the last 12 months",
        detail: "Atorvastatin is an active medicine; none on record.",
        source: null,
      },
    ];
    const { rerender } = render(<BriefGaps patientId="P-1" items={gaps} />);
    expect(screen.getByText("LDL not seen in the last 12 months")).toBeInTheDocument();
    rerender(<BriefGaps patientId="P-1" items={[]} />);
    expect(screen.getByText(/not a statement that nothing is missing/i)).toBeInTheDocument();
  });
});
