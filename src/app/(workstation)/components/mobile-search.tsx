"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientSearch } from "./patient-search";

/** Phones have no room for the search box in the top bar, so a button opens it as a row under the bar. */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label={open ? "Close patient search" : "Search patients"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
      </Button>
      {open ? (
        <div className="fixed inset-x-0 top-14 z-30 border-b border-border bg-card p-3 shadow-md">
          <PatientSearch autoFocus className="w-full" onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
