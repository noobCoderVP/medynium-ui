"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";

/** Top-bar patient search. It opens the patient list filtered to the query, within the caller's entitled set. */
export function PatientSearch() {
  const router = useRouter();
  const [text, setText] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = text.trim();
    router.push(q ? `/patients?q=${encodeURIComponent(q)}` : "/patients");
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a patient"
      className="relative w-full max-w-56"
    >
      <label htmlFor="patient-search" className="sr-only">
        Find a patient by name or condition
      </label>
      <Search
        className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="patient-search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Find a patient"
        className="pl-8"
        autoComplete="off"
      />
    </form>
  );
}
