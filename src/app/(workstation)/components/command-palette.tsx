"use client";

import { Sparkles, Users, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type KeyboardEvent } from "react";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAgent } from "@/features/agent-panel";
import { cn } from "@/lib/utils";
import { useCommands } from "../hooks/use-commands";
import { usePatientSuggestions } from "../hooks/use-patient-suggestions";
import { filterCommands } from "../lib/commands";
import { rememberPatient } from "../lib/recent-patients";

interface Row {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon?: LucideIcon;
  avatar?: string;
  run: () => void;
}

/**
 * One box for everything: type to jump to a section, run a view action, open a patient, or hand the text to the
 * assistant. Arrow keys move, Enter runs, Escape closes. Every row has a manual control elsewhere (FR-20).
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { ask, setOpen: openAssistant } = useAgent();
  const listId = useId();
  const [text, setText] = useState("");
  const [active, setActive] = useState(0);
  const query = text.trim();
  const { items: patients, settling } = usePatientSuggestions(text);

  const close = () => {
    onOpenChange(false);
    setText("");
    setActive(0);
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };
  const commands = useCommands(go);

  const rows: Row[] = [
    ...filterCommands(commands, query).map((c) => ({
      id: c.id,
      group: c.group,
      label: c.label,
      icon: c.icon,
      run: () => {
        close();
        c.run();
      },
    })),
    ...patients.map((p) => ({
      id: `patient-${p.patient_id}`,
      group: "Patients",
      label: p.name,
      hint: `${p.age}, ${p.sex} · ${p.patient_id}`,
      avatar: p.name,
      run: () => {
        rememberPatient({ id: p.patient_id, name: p.name });
        go(`/patients/${encodeURIComponent(p.patient_id)}`);
      },
    })),
    ...(query
      ? [
          {
            id: "ask",
            group: "Ask",
            label: `Ask the assistant: “${query}”`,
            icon: Sparkles,
            run: () => {
              close();
              openAssistant(true);
              ask(query);
            },
          },
          {
            id: "find",
            group: "Patients",
            label: `Search all patients for “${query}”`,
            icon: Users,
            run: () => go(`/patients?q=${encodeURIComponent(query)}`),
          },
        ]
      : []),
  ];
  const current = Math.min(active, rows.length - 1);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current + step + rows.length) % rows.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      rows[current]?.run();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title="Command palette"
      description="Go to a section, run an action, open a patient or ask the assistant."
      className="top-24 translate-y-0"
    >
      <div className="p-3">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Type a command, a patient or a question
        </label>
        <Input
          id={`${listId}-input`}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={rows.length ? `${listId}-${current}` : undefined}
          autoFocus
          autoComplete="off"
          value={text}
          placeholder="Type a command, a patient or a question"
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <ul
          id={listId}
          role="listbox"
          aria-label="Results"
          className="mt-2 max-h-80 overflow-y-auto"
        >
          {rows.map((row, index) => (
            <li
              key={row.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === current}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={row.run}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                index === current && "bg-accent text-accent-foreground",
              )}
            >
              {row.avatar ? (
                <PatientAvatar name={row.avatar} />
              ) : row.icon ? (
                <row.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              ) : null}
              <span className="min-w-0 flex-1 truncate">{row.label}</span>
              {row.hint ? (
                <span className="truncate text-xs text-muted-foreground">{row.hint}</span>
              ) : null}
              <span className="text-xs text-muted-foreground">{row.group}</span>
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {settling && query.length > 1 ? "Searching patients" : `${rows.length} results`}
        </p>
      </div>
    </Dialog>
  );
}
