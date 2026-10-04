"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { Select } from "@/components/ui/select";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TABS, type TabId } from "../lib/tabs";

/**
 * Patient sections as links to ?tab=. From 768 px up they are a row of links with aria-current, which keeps every
 * view linkable. On a phone seven tabs cannot fit, so the same destinations are one native menu: no sideways
 * scrolling, a big touch target, and the system picker.
 */
export function TabBar({ patientId, active }: { patientId: string; active: TabId }) {
  const router = useRouter();
  const id = useId();
  const href = (tab: TabId) => `/patients/${encodeURIComponent(patientId)}?tab=${tab}`;
  return (
    <>
      <div className="md:hidden">
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted-foreground">
          Section
        </label>
        <Select
          id={id}
          value={active}
          onValueChange={(v) => router.push(href(v as TabId))}
          options={TABS.map((tab) => ({ value: tab.id, label: tab.label }))}
          className="h-11 text-base font-medium"
        />
      </div>
      <nav
        aria-label="Patient sections"
        className="-mx-1 hidden overflow-x-auto border-b border-border px-1 md:block"
      >
        <ul className="flex min-w-max gap-1">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <Link
                href={href(tab.id)}
                aria-current={tab.id === active ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-10 items-center rounded-t-md px-3.5 text-sm font-medium transition-colors",
                  tab.id === active
                    ? "bg-accent/60 font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.id === active ? (
                  <motion.span
                    layoutId="patient-tab"
                    transition={spring}
                    className="absolute inset-x-1 -bottom-px h-[3px] rounded-full bg-primary"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
