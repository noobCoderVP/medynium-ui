import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { PatientWorkspace } from "./patient-workspace";

const usePatient = vi.fn();
vi.mock("../hooks/use-patient", () => ({ usePatient: (id: string) => usePatient(id) }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/patients/P-1",
  useSearchParams: () => new URLSearchParams(),
}));
const useBrief = vi.fn();
vi.mock("../overview/hooks/use-brief", () => ({ useBrief: (id: string) => useBrief(id) }));
vi.mock("./views-dialog", () => ({ ViewsDialog: () => null }));
vi.mock("./history-dialog", () => ({ HistoryDialog: () => null }));
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
    medications: [{ medication_id: "M-1" }],
    allergies: [
      { allergy_id: "ALG-1", substance: "Aspirin", reaction: "Hives", severity: "SEVERE" },
    ],
    latest_labs: [
      {
        lab_id: "L-1",
        test: "HbA1c",
        value: 8.2,
        unit: "%",
        date: "2026-09-28",
        flag: "HIGH",
        previous: null,
        ref: { low: 4, high: 5.6 },
      },
      {
        lab_id: "L-2",
        test: "Sodium",
        value: 140,
        unit: "mmol/L",
        date: "2026-09-28",
        flag: "NORMAL",
        previous: null,
        ref: { low: 135, high: 145 },
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
  beforeEach(() => useBrief.mockReturnValue({ data: undefined }));

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

  it("counts attention from the clinical brief so the two never disagree", () => {
    usePatient.mockReturnValue(loaded);
    useBrief.mockReturnValue({
      data: {
        attention: {
          items: [1, 2, 3].map((n) => ({
            severity: "high",
            kind: `k${n}`,
            title: `Item ${n}`,
            detail: null,
            date: null,
            source: { type: "lab", id: null, tab: "labs", query: {} },
          })),
        },
      },
    });
    render_();
    expect(screen.getByRole("button", { name: /3 attention items/ })).toBeInTheDocument();
  });

  it("shows attention as one compact chip and keeps More for the secondary tabs", () => {
    usePatient.mockReturnValue(loaded);
    render_();
    expect(screen.getByRole("button", { name: /1 attention item/ })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Needs attention" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Recent changes" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /More/ })).toBeInTheDocument();
    // Below lg the secondary tabs sit under More (hidden by class); from lg up every section is a tab.
    expect(screen.getByRole("link", { name: "Claims" }).closest("li")).toHaveClass("hidden");
  });

  it("shows allergies on the patient identity line, most severe first as given", () => {
    usePatient.mockReturnValue(loaded);
    render_();
    expect(screen.getByRole("region", { name: "Allergies" })).toHaveTextContent(
      "Aspirin (Hives, severe)",
    );
  });

  it("says none are recorded, never that there are none", () => {
    usePatient.mockReturnValue({ ...loaded, data: { ...loaded.data, allergies: [] } });
    render_();
    const note = screen.getByText("No allergies recorded");
    expect(note).toBeInTheDocument();
    expect(note).not.toHaveTextContent(/known|nka|safe/i);
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
