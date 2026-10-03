"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type FocusEvent, type KeyboardEvent } from "react";
import { PatientAvatar } from "@/components/shared/patient-avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePatientSuggestions } from "../hooks/use-patient-suggestions";
import { rememberPatient } from "../lib/recent-patients";

/**
 * Top-bar patient search: type to see matching patients (name, id or condition) and open one, or press Enter on
 * "See all results" for the filtered list. Arrow keys move through the options; Escape closes. The matches come
 * from the API, which only knows the patients the signed-in user may see.
 */
export function PatientSearch({
  className,
  autoFocus = false,
  onNavigate,
}: {
  className?: string;
  autoFocus?: boolean;
  /** Called after the search sends the user somewhere, so a phone can close its search row. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const { enabled, settling, items, isError } = usePatientSuggestions(text);

  const query = text.trim();
  const optionCount = items.length + (enabled ? 1 : 0);
  const showList = open && enabled;

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setActive(-1);
    setText("");
    onNavigate?.();
  }
  const seeAll = () => go(query ? `/patients?q=${encodeURIComponent(query)}` : "/patients");

  function choose(index: number) {
    const item = items[index];
    if (item) {
      rememberPatient({ id: item.patient_id, name: item.name });
      go(`/patients/${encodeURIComponent(item.patient_id)}`);
    } else seeAll();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (optionCount === 0) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (current + step + optionCount) % optionCount);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (showList && active >= 0) choose(active);
      else seeAll();
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div
      role="search"
      aria-label="Find a patient"
      className={cn("relative", className)}
      onBlur={onBlur}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Find a patient by name, id or condition
      </label>
      <Search
        className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={`${listId}-input`}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Find a patient"
        className="pr-8 pl-8"
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      {settling && enabled ? (
        <Loader2
          className="absolute top-2.5 right-2.5 size-4 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      ) : null}
      {showList ? (
        <div className="absolute top-full left-0 z-40 mt-1 w-full min-w-72 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg md:w-[26rem]">
          <ul id={listId} role="listbox" aria-label="Matching patients">
            {items.map((patient, index) => (
              <li
                key={patient.patient_id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={active === index}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 px-3 py-2",
                  active === index && "bg-accent text-accent-foreground",
                )}
              >
                <PatientAvatar name={patient.name} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{patient.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {patient.age}, {patient.sex} · {patient.patient_id}
                    {patient.main_diagnoses.length ? ` · ${patient.main_diagnoses[0]}` : ""}
                  </span>
                </span>
              </li>
            ))}
            <li
              id={`${listId}-${items.length}`}
              role="option"
              aria-selected={active === items.length}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(items.length)}
              onClick={seeAll}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2 border-t border-border px-3 py-2 text-sm font-medium text-primary",
                active === items.length && "bg-accent",
              )}
            >
              <Search className="size-4" aria-hidden="true" />
              See all results for “{query}”
            </li>
          </ul>
          <p className="sr-only" aria-live="polite">
            {isError
              ? "Search failed. Press Enter to open the full list."
              : settling
                ? "Searching"
                : items.length === 0
                  ? "No matching patients"
                  : `${items.length} matching patients`}
          </p>
          {!settling && !isError && items.length === 0 ? (
            <p className="border-t border-border px-3 py-2 text-sm text-muted-foreground">
              No patients match “{query}”.
            </p>
          ) : null}
          {isError ? (
            <p className="border-t border-border px-3 py-2 text-sm text-crit">
              Search failed. Press Enter to open the full list instead.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
