import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSidebar } from "./use-sidebar";

function setWidth(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: wide,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

beforeEach(() => localStorage.clear());

describe("useSidebar", () => {
  it("defaults to labels on wide screens and icons on narrow ones", () => {
    setWidth(true);
    expect(renderHook(() => useSidebar()).result.current.collapsed).toBe(false);
    setWidth(false);
    expect(renderHook(() => useSidebar()).result.current.collapsed).toBe(true);
  });

  it("lets the user's choice win over the width and remembers it", () => {
    setWidth(true);
    const { result } = renderHook(() => useSidebar());
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);
    expect(localStorage.getItem("medynium-sidebar")).toBe("collapsed");
  });

  it("toggles with Ctrl+B", () => {
    setWidth(true);
    const { result } = renderHook(() => useSidebar({ shortcut: true }));
    const before = result.current.collapsed;
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
    });
    expect(result.current.collapsed).toBe(!before);
  });
});
