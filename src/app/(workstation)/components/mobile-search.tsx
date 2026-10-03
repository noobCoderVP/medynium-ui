"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { readRecentPatients, type RecentPatient } from "../lib/recent-patients";
import { PatientSearch } from "./patient-search";

/**
 * Below 1024 px there is no room for the search box in the top bar, so a button opens it as a panel under the
 * bar, with a heading and its own close button so it reads as part of the header.
 */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<RecentPatient[]>([]);
  const toggle = () => {
    // Read when opening, so a patient opened a moment ago shows up.
    if (!open) setRecent(readRecentPatients());
    setOpen(!open);
  };
  const label = open ? "Close patient search" : "Search patients";
  return (
    <div className="lg:hidden">
      <Tooltip label={label}>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={label}
          aria-expanded={open}
          onClick={toggle}
        >
          {open ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
        </Button>
      </Tooltip>
      {open ? (
        <div
          className="fixed inset-x-0 top-14 z-30 space-y-2 border-b border-border bg-card p-3 shadow-md"
          onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
        >
          <p className="text-xs font-medium text-muted-foreground">Find a patient</p>
          <PatientSearch autoFocus className="w-full" onNavigate={() => setOpen(false)} />
          {recent.length > 0 ? (
            <section aria-label="Recent patients">
              <h2 className="pt-1 text-xs font-medium text-muted-foreground">Recent</h2>
              <ul>
                {recent.map((patient) => (
                  <li key={patient.id}>
                    <Link
                      href={`/patients/${encodeURIComponent(patient.id)}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center text-sm font-medium"
                    >
                      {patient.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
