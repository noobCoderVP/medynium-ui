import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StreamAnswer } from "@/lib/api/events";
import { AnswerView } from "./answer-view";

const evidence = vi.fn();
vi.mock("@/lib/api/endpoints", () => ({
  endpoints: { evidence: (...args: unknown[]) => evidence(...args) },
}));

const stored = {
  answer_id: "ANS-1",
  patient_id: "P-1",
  created_at: "2026-10-03T08:00:00Z",
  route: null,
  patient_records: [
    {
      evidence_id: "P1",
      record_type: "Lab result",
      record_id: "L1",
      table: "CLINICAL.LAB_RESULT",
      value: "eGFR 42 mL/min on 14 Sep 2026 (low)",
      date: "2026-09-14",
    },
  ],
  sql: [],
  sources: [
    {
      evidence_id: "S1",
      chunk_id: "c1",
      document_id: "DOC-MET",
      title: "Metformin hydrochloride tablets: prescribing information",
      source: "FDA",
      section: "Warnings and precautions",
      version: "15",
      effective_date: "2026-08-21",
      retrieved_date: "2026-10-02",
      text: "Assess renal function.",
      matched: true,
    },
  ],
  statement_map: {},
  dropped_statements: [],
  snapshot_date: "2026-10-02",
};

function render(node: React.ReactNode) {
  return rtlRender(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      {node}
    </QueryClientProvider>,
  );
}

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
  usePathname: () => "/patients/P-1",
  useSearchParams: () => new URLSearchParams("tab=safety"),
}));

const base: StreamAnswer = {
  answer_id: "ANS-1",
  kind: "SAFETY",
  patient_id: "P-1",
  short_answer: "One consideration may warrant review.",
  considerations: [
    {
      id: "C1",
      text: "eGFR 42 on 14 Sep.",
      tag: "patient_fact",
      patient_evidence: ["P1"],
      source_evidence: [],
    },
    {
      id: "C2",
      text: "The label advises renal checks.",
      tag: "retrieved_source",
      patient_evidence: [],
      source_evidence: ["S1"],
    },
    {
      id: "C3",
      text: "Dose may need review.",
      tag: "ai_synthesis",
      patient_evidence: ["P1"],
      source_evidence: ["S1"],
    },
  ],
  limits: { checked: ["metformin label"], not_checked: [], notes: [], snapshot_date: "2026-10-02" },
  conflicts: [],
  created_at: "2026-10-03T08:00:00Z",
};

beforeEach(() => {
  push.mockClear();
  evidence.mockReset();
  evidence.mockResolvedValue(stored);
});

describe("AnswerView", () => {
  it("shows each statement with its tag as text", () => {
    render(<AnswerView answer={base} />);
    expect(screen.getByText("Patient fact")).toBeInTheDocument();
    expect(screen.getByText("Retrieved source")).toBeInTheDocument();
    expect(screen.getByText("AI synthesis")).toBeInTheDocument();
  });

  it("labels a code-made conclusion as a rule check, never as AI", () => {
    const answer = {
      ...base,
      considerations: [
        {
          id: "C1",
          text: "The record lists an allergy to Aspirin, and Aspirin is a current medicine.",
          tag: "rule_check" as const,
          patient_evidence: ["P1", "P3"],
          source_evidence: [],
        },
      ],
    };
    render(<AnswerView answer={answer} statementAction={() => <button>Add to findings</button>} />);
    expect(screen.getByText("Rule check")).toBeInTheDocument();
    expect(screen.queryByText("AI synthesis")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to findings" })).toBeInTheDocument();
  });

  it("always hedges an AI-synthesis statement", () => {
    render(<AnswerView answer={base} />);
    expect(screen.getByText("May warrant clinician review")).toBeInTheDocument();
  });

  it("shows what each statement rests on in words, with links to the real records", async () => {
    render(<AnswerView answer={base} />);
    expect(await screen.findAllByText("eGFR 42 mL/min on 14 Sep 2026 (low)")).not.toHaveLength(0);
    expect(
      screen.getAllByText("Metformin hydrochloride label · Warnings and precautions"),
    ).not.toHaveLength(0);
    expect(screen.getAllByRole("link", { name: /Open the lab/ })[0]).toHaveAttribute(
      "href",
      "/patients/P-1?tab=labs&lab=eGFR",
    );
    const label = screen.getAllByRole("link", { name: /Open label/ })[0];
    expect(label.getAttribute("href")).toContain("/knowledge?q=Metformin%20hydrochloride");
    expect(screen.queryByRole("button", { name: "P1" })).not.toBeInTheDocument();
  });

  it("opens the Why? drawer at one item from its Details button without hover (URL carries the state)", async () => {
    render(<AnswerView answer={base} />);
    await waitFor(() =>
      expect(screen.getAllByRole("button", { name: "Details" })).not.toHaveLength(0),
    );
    await userEvent.click(screen.getAllByRole("button", { name: "Details" })[0]);
    expect(push).toHaveBeenCalledWith(expect.stringContaining("why=ANS-1"), expect.anything());
    expect(push).toHaveBeenCalledWith(expect.stringContaining("ref=P1"), expect.anything());
  });

  it("falls back to the plain ids if the evidence cannot be read", async () => {
    evidence.mockRejectedValue(new Error("down"));
    render(<AnswerView answer={base} />);
    await userEvent.click((await screen.findAllByRole("button", { name: "P1" }))[0]);
    expect(push).toHaveBeenCalledWith(expect.stringContaining("ref=P1"), expect.anything());
  });

  it("renders the honest gap, never 'no risk', when a safety review finds nothing", () => {
    render(<AnswerView answer={{ ...base, considerations: [], short_answer: "ignored" }} />);
    expect(
      screen.getByText("No documented consideration found in the indexed sources."),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a statement that there is no risk/i)).toBeInTheDocument();
    expect(screen.getByText("What I checked")).toBeInTheDocument();
    expect(screen.getByText("Source snapshot")).toBeInTheDocument();
  });

  it("shows the answer's own text for a non-safety kind with no statements", () => {
    render(
      <AnswerView
        answer={{
          ...base,
          kind: "MEDS",
          considerations: [],
          short_answer: "No current medicines.",
        }}
      />,
    );
    expect(screen.getByText("No current medicines.")).toBeInTheDocument();
  });

  it("lists conflicting sources", () => {
    render(
      <AnswerView
        answer={{
          ...base,
          conflicts: [{ drug: "furosemide", section: "Dosage", items: ["v1", "v2"] }],
        }}
      />,
    );
    expect(screen.getByText("Sources disagree")).toBeInTheDocument();
    expect(screen.getByText(/furosemide, Dosage: v1 vs v2/)).toBeInTheDocument();
  });
});
