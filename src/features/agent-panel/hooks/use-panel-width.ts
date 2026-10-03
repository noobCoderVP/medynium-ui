"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "medynium-agent-width";
export const MIN_WIDTH = 320;
export const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 384;

const clamp = (value: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));

/** The assistant's width in pixels, kept between 320 and 480 and remembered in this browser. */
export function usePanelWidth() {
  const [width, setWidthState] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(STORAGE_KEY));
      // Storage is only readable after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setWidthState(clamp(stored));
    } catch {
      // Blocked storage: keep the default.
    }
  }, []);

  const setWidth = useCallback((next: number, persist = true) => {
    const value = clamp(next);
    setWidthState(value);
    if (!persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // The width just lasts for this visit.
    }
  }, []);

  return { width, setWidth };
}
