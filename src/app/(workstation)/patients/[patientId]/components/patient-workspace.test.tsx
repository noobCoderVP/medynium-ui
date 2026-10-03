import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { PatientWorkspace } from "./patient-workspace";

const usePatient = vi.fn();
vi.mock("../hooks/use-patient", () => ({ usePatient: (id: string) => usePatient(id) }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/patients/P-1",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("./views-dialog", () => ({ ViewsDialog: () => null }));
vi.mock("./share-dialog", () => ({ ShareDialog: () => null }));

const render_ = () =>
  render(
    <PatientWorkspace patientId="P-1" tab="overview">
      <p>tab content</p>
    </PatientWorkspace>,
  );

const loaded = {
  isPending: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  data: {
    patient_id: "P-1",
    name: "Rahul Patel",
    age: 58,
    sex: "M",
    city: "Pune",
    as_of: "2026-10-02",
    latest_labs: [
      {
        lab_id: "L-1",
        test: "HbA1c",
        value: 8.2,
        unit: "%",
        date: "2026-09-28",
        flag: "HIGH",
      },
      {
        lab_id: "L-2",
        test: "Sodium",
        value: 140,
        unit: "mmol/L",
        date: "2026-09-28",
        flag: "NORMAL",
      },
    ],
    recent_events: [
      {
        event_id: "E-1",
        date: "2026-09-30",
        type: "MEDICATION_CHANGE",
        title: "Metformin dose raised",
        summary: null,
        record: { id: "M-1" },
      },
      { event_id: "E-2", date: "2026-09-20", type: "CLAIM", title: "Claim", record: { id: "C-1" } },
    ],
  },
};

describe("PatientWorkspace", () => {
  it("shows the header, the tabs and the tab content for an entitled patient", () => {
    usePatient.mockReturnValue(loaded);
    render_();
    expect(screen.getByRole("heading", { name: "Rahul Patel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Timeline" })).toHaveAttribute(
      "href",
      "/patients/P-1?tab=timeline",
    );
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("tab content")).toBeInTheDocument();
  });

  it("lists the latest medicine, lab and visit changes, with a way into the safety review", () => {
    usePatient.mockReturnValue(loaded);
    render_();
    const strip = screen.getByRole("region", { name: "Recent changes" });
    expect(strip).toHaveTextContent("Updated: Metformin dose raised");
    expect(strip).not.toHaveTextContent("Claim");
    expect(strip).toHaveTextContent("Requires review: HbA1c");
    expect(strip).not.toHaveTextContent("Sodium");
    expect(screen.getByRole("link", { name: /Review safety/ })).toHaveAttribute(
      "href",
      "/patients/P-1?tab=safety",
    );
  });

  it("renders one not-found state for a denied or missing patient, with no header, tabs or content", () => {
    usePatient.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
      error: new ApiError(404, "not_found", "The requested resource was not found."),
    });
    render_();
    expect(screen.getByText("We couldn't find that patient.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Patient sections" })).not.toBeInTheDocument();
    expect(screen.queryByText("tab content")).not.toBeInTheDocument();
    expect(screen.queryByText("P-1")).not.toBeInTheDocument();
  });

  it("shows a loading status while the patient loads", () => {
    usePatient.mockReturnValue({
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(),
    });
    render_();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("tab content")).not.toBeInTheDocument();
  });
});
