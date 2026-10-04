"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DataState } from "@/components/shared/data-state";
import { WorkspaceSkeleton } from "@/components/shared/skeletons";
import { NotFoundState } from "@/components/shared/state-panels";
import { cn } from "@/lib/utils";
import { usePatient } from "../hooks/use-patient";
import { TABS, type TabId } from "../lib/tabs";
import { PatientHeader } from "./patient-header";
import { TabBar } from "./tab-bar";

/**
 * The gate for everything under a patient. A denied patient and a missing one both end here, in the same
 * not-found state, with no header, tabs or hint that the patient exists (SEC-05, UX rule 8). The tab content
 * is only rendered once the patient has loaded, so it never shows a second, different error.
 *
 * Layout: the patient context and the tabs form one sticky block, so identity never scrolls away; the header
 * collapses once the page scrolls. The content region takes the remaining height (`flex-1`, `min-h-0`), so a page
 * that wants to fill the viewport can, and a taller page simply scrolls the one workspace container.
 */
export function PatientWorkspace({
  patientId,
  tab,
  children,
}: {
  patientId: string;
  tab: TabId;
  children: ReactNode;
}) {
  const query = usePatient(patientId);
  const sentinel = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  });

  // "/" jumps to the search box on the page, except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]"))
        return;
      const search = document.querySelector<HTMLInputElement>(
        "#patient-tab-content input[type='search']",
      );
      if (!search) return;
      e.preventDefault();
      search.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <DataState query={query} notFound={<NotFoundState />} skeleton={<WorkspaceSkeleton />}>
      {(patient) => (
        <div className="flex min-h-full flex-col lg:has-[[data-fit]]:h-full">
          <div ref={sentinel} aria-hidden="true" className="h-px" />
          <div
            className={cn(
              "sticky top-0 z-20 -mx-4 -mt-4 mb-3 border-b border-border bg-surface md:-mx-6 md:-mt-5 2xl:-mx-8",
              compact && "shadow-sm",
            )}
          >
            <PatientHeader
              patient={patient}
              tabLabel={tab === "overview" ? undefined : TABS.find((t) => t.id === tab)?.label}
              compact={compact}
            />
            <TabBar patientId={patientId} active={tab} />
          </div>
          <div id="patient-tab-content" className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </div>
      )}
    </DataState>
  );
}
