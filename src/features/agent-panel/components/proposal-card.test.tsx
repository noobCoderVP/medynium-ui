import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProposalCard } from "./proposal-card";

const approveProposal = vi.fn();
const discardProposal = vi.fn();
const syncStatus = vi.fn().mockResolvedValue({ pending: false });
vi.mock("@/lib/api/endpoints", () => ({
  endpoints: {
    approveProposal: (...args: unknown[]) => approveProposal(...args),
    discardProposal: (...args: unknown[]) => discardProposal(...args),
    syncStatus: (...args: unknown[]) => syncStatus(...args),
  },
}));

const proposal = {
  proposal_id: "PRP-1",
  kind: "add_allergy",
  patient_id: "P-1",
  title: "Add an allergy",
  fields: [
    { label: "Substance", value: "penicillin" },
    { label: "Severity", value: "MODERATE" },
  ],
};

const mount = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProposalCard proposal={proposal} />
    </QueryClientProvider>,
  );

describe("ProposalCard", () => {
  beforeEach(() => {
    approveProposal.mockReset();
    discardProposal.mockReset();
  });

  it("shows what will be written and saves nothing until Approve", () => {
    mount();
    expect(screen.getByText("penicillin")).toBeInTheDocument();
    expect(screen.getByText(/nothing is saved until you approve/i)).toBeInTheDocument();
    expect(approveProposal).not.toHaveBeenCalled();
  });

  it("approves through the proposal endpoint and links to the record", async () => {
    approveProposal.mockResolvedValue({ patient_id: "P-1", tab: "notes" });
    mount();
    await userEvent.click(screen.getByRole("button", { name: /approve and save/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Saved to the record"),
    );
    expect(approveProposal).toHaveBeenCalledWith("PRP-1");
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute(
      "href",
      "/patients/P-1?tab=notes",
    );
  });

  it("discard closes the card without saving", async () => {
    discardProposal.mockResolvedValue({ status: "discarded" });
    mount();
    await userEvent.click(screen.getByRole("button", { name: /discard/i }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Nothing was saved"));
    expect(discardProposal).toHaveBeenCalledWith("PRP-1");
  });
});
