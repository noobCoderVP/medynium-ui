import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import type { Dashboard } from "@/lib/api/types";
import { DashboardView } from "./dashboard-view";

const useDashboard = vi.fn();
const mutate = vi.fn();
vi.mock("../hooks/use-dashboard", () => ({ useDashboard: () => useDashboard() }));
vi.mock("../hooks/use-briefing", () => ({
  useBriefing: () => ({ mutate, reset: vi.fn(), isPending: false, data: undefined, error: null }),
}));

const data: Dashboard = {
  as_of: "2026-10-03",
  worklist: [
    {
      patient_id: "P-1",
      name: "Rahul Patel",
      age: 58,
      sex: "M",
      last_encounter: { date: "2026-10-02", kind: "EMERGENCY", label: "ED" },
      flags: [{ type: "RECENT_EMERGENCY", label: "ED visit 2 Oct" }],
    },
  ],
  recent_changes: {
    labs: [
      {
        patient_id: "P-1",
        name: "Rahul Patel",
        test: "eGFR",
        latest: 42,
        previous: 58,
        unit: "mL/min",
        date: "2026-09-14",
        abnormal: "LOW",
      },
    ],
    medications: [],
  },
  utilization: {
    window: "last 12 months",
    patients: 1,
    opd_visits: 3,
    emergency_visits: 1,
    hospitalizations: 0,
    procedures: 2,
    approved: { amount: 123456, currency: "INR" },
  },
};

const result = (over: object) => ({
  isPending: false,
  isError: false,
  error: null,
  data,
  refetch: vi.fn(),
  ...over,
});

beforeEach(() => {
  useDashboard.mockReset();
  mutate.mockClear();
});

describe("DashboardView", () => {
  it("shows the worklist with change flags, utilisation in INR, and recent changes", () => {
    useDashboard.mockReturnValue(result({}));
    render(<DashboardView />);
    // The patient is linked from the worklist and from the recent lab results.
    const links = screen.getAllByRole("link", { name: /Rahul Patel/ });
    expect(links.map((l) => l.getAttribute("href"))).toContain("/patients/P-1");
    expect(screen.getByText("ED visit 2 Oct")).toBeInTheDocument();
    // Priority is spelled out in words, and the header says why the patient is listed.
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText(/1 recent emergency visit · 1 abnormal lab/)).toBeInTheDocument();
    // Billing is not shown on the clinical dashboard (minimum necessary).
    expect(screen.queryByText("₹1,23,456")).not.toBeInTheDocument();
    expect(screen.queryByText("Approved claims")).not.toBeInTheDocument();
    expect(screen.getByText(/42 mL\/min/)).toBeInTheDocument();
  });

  it("runs the briefing only when asked", async () => {
    useDashboard.mockReturnValue(result({}));
    render(<DashboardView />);
    expect(mutate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: /brief me/i }));
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state", () => {
    useDashboard.mockReturnValue(result({ isPending: true, data: undefined }));
    render(<DashboardView />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("explains an empty worklist", () => {
    useDashboard.mockReturnValue(result({ data: { ...data, worklist: [] } }));
    render(<DashboardView />);
    expect(screen.getByText(/no patients on your list yet/i)).toBeInTheDocument();
  });

  it("shows an error with a retry that refetches", async () => {
    const refetch = vi.fn();
    useDashboard.mockReturnValue(
      result({
        isError: true,
        data: undefined,
        refetch,
        error: new ApiError(500, "internal_error", "x", "req-1"),
      }),
    );
    render(<DashboardView />);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(refetch).toHaveBeenCalled();
  });
});
