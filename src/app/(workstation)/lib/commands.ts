import type { LucideIcon } from "lucide-react";

export interface Command {
  id: string;
  label: string;
  group: "Go to" | "Actions";
  icon: LucideIcon;
  run: () => void;
  /** Extra words that should find this command. */
  keywords?: string;
}

/** Every word typed must appear in the label or keywords, in any order. An empty query keeps everything. */
export function filterCommands(commands: Command[], query: string): Command[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return commands;
  return commands.filter((command) => {
    const text = `${command.label} ${command.keywords ?? ""}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
