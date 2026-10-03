"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useTheme, type Theme } from "./theme-provider";

const order: Theme[] = ["light", "dark", "system"];
const icons = { light: Sun, dark: Moon, system: Monitor };
const labels = { light: "Light", dark: "Dark", system: "System" };

/** Cycles light, dark, system. The label names the current choice and what a click does. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = order[(order.indexOf(theme) + 1) % order.length];
  const Icon = icons[theme];
  return (
    <Tooltip label={`Theme: ${labels[theme]}`}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Theme: ${labels[theme]}. Switch to ${labels[next].toLowerCase()}.`}
        onClick={() => setTheme(next)}
      >
        <Icon aria-hidden="true" />
      </Button>
    </Tooltip>
  );
}
