import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useListState } from "./use-list-state";

let search = "";
const replace = vi.fn((url: string) => {
  search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
});
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: replace }),
  usePathname: () => "/patients",
  useSearchParams: () => new URLSearchParams(search),
}));

const config = {
  filters: ["sex"],
  defaultSort: "name",
  defaultOrder: "asc",
  defaultSize: 25,
} as const;

beforeEach(() => {
  search = "";
  replace.mockClear();
});

describe("useListState", () => {
  it("sends the defaults to the API", () => {
    const { result } = renderHook(() => useListState(config));
    expect(result.current.apiParams).toMatchObject({
      limit: 25,
      offset: 0,
      sort: "name",
      order: "asc",
    });
  });

  it("reads search, filter, sort and page from the URL", () => {
    search = "q=asha&sex=F&sort=age&order=desc&offset=50&size=10";
    const { result } = renderHook(() => useListState(config));
    expect(result.current.apiParams).toEqual({
      q: "asha",
      sex: "F",
      limit: 10,
      offset: 50,
      sort: "age",
      order: "desc",
    });
    expect(result.current.activeCount).toBe(2);
  });

  it("returns to the first page when a filter changes", () => {
    search = "offset=50";
    const { result } = renderHook(() => useListState(config));
    act(() => result.current.setFilter("sex", "M"));
    expect(replace).toHaveBeenCalledWith("/patients?sex=M", { scroll: false });
  });

  it("flips the order when the same column is clicked twice, and keeps defaults out of the URL", () => {
    const { result, rerender } = renderHook(() => useListState(config));
    act(() => result.current.toggleSort("name"));
    expect(replace).toHaveBeenLastCalledWith("/patients?order=desc", { scroll: false });
    rerender();
    act(() => result.current.toggleSort("age"));
    expect(replace).toHaveBeenLastCalledWith(expect.stringContaining("sort=age"), {
      scroll: false,
    });
  });

  it("follows a q that something else put in the URL, without clobbering what is being typed", () => {
    const { result, rerender } = renderHook(() => useListState(config));
    act(() => result.current.setText("abc"));
    expect(result.current.text).toBe("abc");
    search = "q=rao";
    rerender();
    expect(result.current.text).toBe("rao");
  });

  it("clears the search and every filter", () => {
    search = "q=asha&sex=F&offset=25";
    const { result } = renderHook(() => useListState(config));
    act(() => result.current.clear());
    expect(replace).toHaveBeenLastCalledWith("/patients", { scroll: false });
    expect(result.current.text).toBe("");
  });
});
