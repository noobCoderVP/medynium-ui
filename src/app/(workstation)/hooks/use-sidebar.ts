"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "medynium-sidebar";
const WIDE = "(min-width: 1280px)";

type Preference = "expanded" | "collapsed" | null;

// Holds the choice when storage is blocked.
let memory: Preference = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readPreference(): Preference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "expanded" || stored === "collapsed") return stored;
  } catch {
    // Blocked storage: use the in-memory choice.
  }
  return memory;
}

function subscribeWide(listener: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/**
 * The navigation rail's width. The width decides the default (labels from 1280 px up, icons below) and the user's
 * own choice, remembered in this browser, wins over it. Only one caller (the rail) turns the Ctrl/Cmd + B shortcut on. Blocked storage just means the choice lasts for the visit.
 */
export function useSidebar({ shortcut = false }: { shortcut?: boolean } = {}) {
  const preference = useSyncExternalStore<Preference>(subscribe, readPreference, () => null);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
  const collapsed = preference ? preference === "collapsed" : !wide;

  const toggle = useCallback(() => {
    const next = collapsed ? "expanded" : "collapsed";
    memory = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice just lasts for this visit.
    }
    notify();
  }, [collapsed]);

  // Ctrl or Cmd + B, as in most editors.
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut, toggle]);

  return { collapsed, preference, toggle };
}
