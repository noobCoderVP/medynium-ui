import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Citation, DrugEntry, SearchResponse } from "@/lib/api/types";
import { KnowledgeView } from "./knowledge-view";

const hook = vi.fn();
vi.mock("../hooks/use-knowledge", () => ({ useKnowledgeSearch: () => hook() }));

const drug = (id: string, name: string, brands: string[]): DrugEntry => ({
  drug_id: id,
  name,
  generic: name.toLowerCase(),
  brands,
  section_count: 12,
  in_nlem: false,
  nlem_level: null,
});

const citation: Citation = {
  chunk_id: "CH-1",
  document_id: "DOC-1",
  title: "Metformin label",
  source: "openFDA drug labeling",
  drug: "Metformin hydrochloride",
  section: "Contraindications",
  version: "Label version 6",
  effective_date: "2025-01-01",
  retrieved_date: "2026-10-02",
  page: null,
  snippet: "Severe renal impairment (eGFR below 30) is a contraindication.",
  text: "Severe renal impairment (eGFR below 30) is a contraindication. Metformin is also contraindicated in acidosis.",
  score: 0.6,
  conflict: false,
};

const response = (over: Partial<SearchResponse> = {}): SearchResponse => ({
  snapshot_date: "2026-10-02",
  items: [citation],
  message: null,
  resolved: {},
  conflicts: [],
  mode: "search",
  scope: [],
  suggestions: [],
  has_more: false,
  ...over,
});

function state(over: Record<string, unknown> = {}) {
  return {
    query: { isPending: false, isError: false, error: null, data: response(), refetch: vi.fn() },
    status: {
      isPending: false,
      isError: false,
      error: null,
      data: {
        snapshot_date: "2026-10-02",
        document_count: 27,
        chunk_count: 300,
        drug_count: 26,
        drugs: [],
        sections: ["Contraindications", "Warnings"],
        sources: ["openFDA drug labeling"],
        notes: null,
      },
      refetch: vi.fn(),
    },
    drugs: {
      data: {
        items: [
          drug("D1", "Metformin hydrochloride", ["glycomet"]),
          drug("D2", "Warfarin sodium", []),
        ],
      },
    },
    q: "renal",
    drug: "",
    section: "",
    active: true,
    text: "renal",
    setText: vi.fn(),
    settling: false,
    canShowMore: false,
    showMore: vi.fn(),
    setDrug: vi.fn(),
    setSection: vi.fn(),
    searchFor: vi.fn(),
    clear: vi.fn(),
    submit: vi.fn((e: Event) => e.preventDefault()),
    ...over,
  };
}

beforeEach(() => hook.mockReset());

describe("KnowledgeView", () => {
  it("offers example searches before anything is typed", () => {
    const k = state({ active: false, q: "", text: "" });
    hook.mockReturnValue(k);
    render(<KnowledgeView />);
    fireEvent.click(screen.getByRole("button", { name: "Glycomet" }));
    expect(k.searchFor).toHaveBeenCalledWith("Glycomet");
  });

  it("shows each result with its full citation and highlights the match", () => {
    hook.mockReturnValue(state());
    render(<KnowledgeView />);
    expect(screen.getByRole("heading", { name: "Metformin hydrochloride" })).toBeTruthy();
    expect(screen.getByText("Label version 6")).toBeTruthy();
    expect(screen.getByText("openFDA drug labeling")).toBeTruthy();
    expect(document.querySelector("mark")?.textContent?.toLowerCase()).toBe("renal");
  });

  it("lists the drugs with brands and filters to one on click", () => {
    const k = state();
    hook.mockReturnValue(k);
    render(<KnowledgeView />);
    expect(screen.getByText("glycomet")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Warfarin sodium/ }));
    expect(k.setDrug).toHaveBeenCalledWith("Warfarin sodium");
  });

  it("says so honestly and suggests the nearest drug when nothing matches", () => {
    const k = state({
      query: {
        isPending: false,
        isError: false,
        error: null,
        data: response({
          items: [],
          message: "'Metfor' is not an indexed drug.",
          suggestions: ["Metformin hydrochloride"],
        }),
        refetch: vi.fn(),
      },
    });
    hook.mockReturnValue(k);
    render(<KnowledgeView />);
    expect(screen.getByText("'Metfor' is not an indexed drug.")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Metformin hydrochloride" })[0]);
    expect(k.setDrug).toHaveBeenCalledWith("Metformin hydrochloride");
  });

  it("offers more sections only when the API says there are more", () => {
    const k = state({ canShowMore: true });
    hook.mockReturnValue(k);
    render(<KnowledgeView />);
    fireEvent.click(screen.getByRole("button", { name: "Show more sections" }));
    expect(k.showMore).toHaveBeenCalled();
  });

  it("shows an error with a retry", () => {
    const refetch = vi.fn();
    hook.mockReturnValue(
      state({
        query: { isPending: false, isError: true, error: new Error("x"), data: undefined, refetch },
      }),
    );
    render(<KnowledgeView />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalled();
  });
});
