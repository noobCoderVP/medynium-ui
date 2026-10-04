import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Finding } from "@/lib/api/types";
import { DecisionForm } from "./decision-form";

const colleagues = vi.fn();
vi.mock("../hooks/use-findings", () => ({
  useColleagues: (...args: unknown[]) => colleagues(...args),
}));

const finding: Finding = {
  finding_id: "FND-1",
  patient_id: "P-1",
  answer_id: "ANS-1",
  consideration_id: "C1",
  summary: "This may warrant clinician review.",
  status: "NEW",
  reason: null,
  follow_up_on: null,
  assigned_to: null,
  assigned_to_name: null,
  created_by_name: "Dr Sharma",
  created_at: "2026-10-03T08:00:00Z",
  updated_at: null,
};

function setup(overrides: Partial<Finding> = {}, error: unknown = null) {
  const onDecide = vi.fn();
  colleagues.mockReturnValue({
    data: { items: [{ user_id: "u-2", name: "Dr Rao", role: "DOCTOR" }] },
  });
  render(
    <DecisionForm
      patientId="P-1"
      finding={{ ...finding, ...overrides }}
      pending={false}
      error={error}
      onDecide={onDecide}
    />,
  );
  return onDecide;
}

describe("DecisionForm", () => {
  it("acknowledges in one click", () => {
    const onDecide = setup();
    fireEvent.click(screen.getByRole("button", { name: "Acknowledge" }));
    expect(onDecide).toHaveBeenCalledWith({ status: "ACKNOWLEDGED" });
  });

  it("will not dismiss without a reason", () => {
    const onDecide = setup();
    fireEvent.click(screen.getByRole("button", { name: "Dismiss…" }));
    const save = screen.getByRole("button", { name: "Save decision" });
    expect(save).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Reason/), { target: { value: "Monitored already" } });
    expect(save).toBeEnabled();
    fireEvent.click(save);
    expect(onDecide).toHaveBeenCalledWith({ status: "DISMISSED", reason: "Monitored already" });
  });

  it("sends the follow-up date", () => {
    const onDecide = setup();
    fireEvent.click(screen.getByRole("button", { name: "Follow up…" }));
    fireEvent.change(screen.getByLabelText("Follow up on"), { target: { value: "2099-01-02" } });
    fireEvent.click(screen.getByRole("button", { name: "Save decision" }));
    expect(onDecide).toHaveBeenCalledWith({ status: "FLAGGED", follow_up_on: "2099-01-02" });
  });

  it("escalates only to a chosen colleague", async () => {
    const onDecide = setup();
    fireEvent.click(screen.getByRole("button", { name: "Escalate…" }));
    expect(screen.getByRole("button", { name: "Save decision" })).toBeDisabled();
    await userEvent.click(screen.getByLabelText("Escalate to"));
    await userEvent.click(await screen.findByRole("option", { name: /Dr Rao/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save decision" }));
    expect(onDecide).toHaveBeenCalledWith({ status: "ESCALATED", assigned_to: "u-2" });
  });

  it("offers Reopen for a decided finding, not for a new one", () => {
    setup({ status: "ACKNOWLEDGED" });
    expect(screen.getByRole("button", { name: "Reopen" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Acknowledge" })).not.toBeInTheDocument();
  });

  it("shows a save failure as an alert", () => {
    setup({}, new Error("boom"));
    expect(screen.getByRole("alert")).toHaveTextContent("That did not save.");
  });
});
