"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "medynium-theme";

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Context = createContext<ThemeContext>({ theme: "system", setTheme: () => {} });

/** The inline script that sets the class before first paint, so there is no flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

function readStored(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/** Light, dark or system, as a class on <html>. A tiny provider instead of a new dependency. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const stored = readStored();
    // Reading localStorage can only happen after hydration, so the stored value is applied here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(stored);
  }, []);

  useEffect(() => {
    apply(theme);
    if (theme !== "system") return;
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just lasts for this visit.
    }
  }, []);

  return <Context.Provider value={{ theme, setTheme }}>{children}</Context.Provider>;
}

export const useTheme = () => useContext(Context);
