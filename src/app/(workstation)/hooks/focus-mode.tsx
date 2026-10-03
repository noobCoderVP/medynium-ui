"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface Focus {
  focus: boolean;
  toggle: () => void;
  exit: () => void;
}

const Context = createContext<Focus | null>(null);

export function useFocusMode(): Focus {
  const value = useContext(Context);
  if (!value) throw new Error("useFocusMode must be used inside FocusProvider");
  return value;
}

/**
 * Focus mode hides the navigation, assistant and activity strip so one patient fills the screen. It is a view
 * choice for this visit only; Ctrl/Cmd + Shift + F toggles it from anywhere.
 */
export function FocusProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState(false);
  const toggle = useCallback(() => setFocus((value) => !value), []);
  const exit = useCallback(() => setFocus(false), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo(() => ({ focus, toggle, exit }), [focus, toggle, exit]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
