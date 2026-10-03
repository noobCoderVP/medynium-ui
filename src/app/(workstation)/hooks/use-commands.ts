"use client";

import { Maximize2, Monitor, Moon, PanelLeft, Sparkles, Sun } from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "@/components/shared/theme-provider";
import { useAgent } from "@/features/agent-panel";
import type { Command } from "../lib/commands";
import { useFocusMode } from "./focus-mode";
import { useNavItems } from "./use-nav-items";
import { useSidebar } from "./use-sidebar";

/** The palette's commands: every section, plus the view actions that already have a button elsewhere. */
export function useCommands(go: (href: string) => void): Command[] {
  const items = useNavItems();
  const { setTheme } = useTheme();
  const { setOpen } = useAgent();
  const sidebar = useSidebar();
  const focus = useFocusMode();
  return useMemo(
    () => [
      ...items.map(({ href, label, icon }): Command => ({
        id: `go-${href}`,
        label: `Go to ${label}`,
        group: "Go to",
        icon,
        run: () => go(href),
      })),
      {
        id: "assistant",
        label: "Open the assistant",
        group: "Actions",
        icon: Sparkles,
        keywords: "ask ai agent",
        run: () => setOpen(true),
      },
      {
        id: "sidebar",
        label: sidebar.collapsed ? "Expand sidebar" : "Collapse sidebar",
        group: "Actions",
        icon: PanelLeft,
        keywords: "navigation menu",
        run: sidebar.toggle,
      },
      {
        id: "focus",
        label: "Enter focus mode",
        group: "Actions",
        icon: Maximize2,
        keywords: "fullscreen distraction",
        run: focus.toggle,
      },
      {
        id: "light",
        label: "Light theme",
        group: "Actions",
        icon: Sun,
        run: () => setTheme("light"),
      },
      {
        id: "dark",
        label: "Dark theme",
        group: "Actions",
        icon: Moon,
        run: () => setTheme("dark"),
      },
      {
        id: "system",
        label: "System theme",
        group: "Actions",
        icon: Monitor,
        run: () => setTheme("system"),
      },
    ],
    [items, go, setOpen, setTheme, sidebar.collapsed, sidebar.toggle, focus.toggle],
  );
}
