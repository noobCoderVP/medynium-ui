import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StreamAnswer } from "@/lib/api/events";
import { AnswerView } from "./answer-view";

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

beforeEach(() => push.mockClear());

describe("AnswerView", () => {
  it("shows each statement with its tag as text", () => {
    render(<AnswerView answer={base} />);
    expect(screen.getByText("Patient fact")).toBeInTheDocument();
    expect(screen.getByText("Retrieved source")).toBeInTheDocument();
    expect(screen.getByText("AI synthesis")).toBeInTheDocument();
  });

  it("always hedges an AI-synthesis statement", () => {
    render(<AnswerView answer={base} />);
    expect(screen.getByText("May warrant clinician review")).toBeInTheDocument();
  });

  it("opens the Why? drawer from a reference button without hover (URL carries the state)", async () => {
    render(<AnswerView answer={base} />);
    await userEvent.click(screen.getAllByRole("button", { name: "P1" })[0]);
    expect(push).toHaveBeenCalledWith(expect.stringContaining("why=ANS-1"), expect.anything());
    expect(push).toHaveBeenCalledWith(expect.stringContaining("ref=P1"), expect.anything());
  });

  it("renders the honest gap, never 'no risk', when a safety review finds nothing", () => {
    render(<AnswerView answer={{ ...base, considerations: [], short_answer: "ignored" }} />);
    expect(
      screen.getByText("No documented consideration found in the indexed sources."),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a statement that there is no risk/i)).toBeInTheDocument();
    expect(screen.getByText("Checked")).toBeInTheDocument();
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
