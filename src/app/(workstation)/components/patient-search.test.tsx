import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PatientSearch } from "./patient-search";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const suggestions = vi.fn();
vi.mock("../hooks/use-patient-suggestions", () => ({
  usePatientSuggestions: (text: string) => suggestions(text),
}));

const asha = {
  patient_id: "P-1042",
  name: "Asha Rao",
  age: 61,
  sex: "F",
  main_diagnoses: ["Type 2 diabetes"],
};

beforeEach(() => {
  push.mockClear();
  suggestions.mockReturnValue({
    enabled: true,
    settling: false,
    items: [asha],
    total: 1,
    isError: false,
  });
});

describe("PatientSearch", () => {
  it("lists matching patients as options and opens the one you click", async () => {
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "asha");
    const option = screen.getByRole("option", { name: /Asha Rao/ });
    expect(option).toHaveTextContent("P-1042");
    await userEvent.click(option);
    expect(push).toHaveBeenCalledWith("/patients/P-1042");
  });

  it("opens the highlighted patient with the keyboard", async () => {
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "asha{ArrowDown}{Enter}");
    expect(push).toHaveBeenCalledWith("/patients/P-1042");
  });

  it("sends Enter with no highlighted option to the filtered list", async () => {
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "rao & co{Enter}");
    expect(push).toHaveBeenCalledWith("/patients?q=rao%20%26%20co");
  });

  it("offers the full list as the last option", async () => {
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "asha");
    await userEvent.click(screen.getByRole("option", { name: /See all results/ }));
    expect(push).toHaveBeenCalledWith("/patients?q=asha");
  });

  it("says when nothing matches, and closes on Escape", async () => {
    suggestions.mockReturnValue({
      enabled: true,
      settling: false,
      items: [],
      total: 0,
      isError: false,
    });
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByText(/No patients match/)).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows no list until there are enough characters", async () => {
    suggestions.mockReturnValue({
      enabled: false,
      settling: false,
      items: [],
      total: 0,
      isError: false,
    });
    render(<PatientSearch />);
    await userEvent.type(screen.getByRole("combobox"), "a");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
