"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Select } from "@/components/ui/select";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TABS, type TabId } from "../lib/tabs";

/**
 * Patient sections as links to ?tab=, under the patient context. Five primary tabs plus "More" (Claims, Notes,
 * Reports, Similar patients) on medium widths; from lg up every section is a tab and "More" is hidden. On a phone
 * the same destinations are one native menu.
 */
export function TabBar({ patientId, active }: { patientId: string; active: TabId }) {
  const router = useRouter();
  const id = useId();
  const list = useRef<HTMLUListElement>(null);
  const moreActive = TABS.some((tab) => !tab.primary && tab.id === active);
  const href = (tab: TabId) => `/patients/${encodeURIComponent(patientId)}?tab=${tab}`;

  // Alt + 1..9 opens the nth section from anywhere on the page, except while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const tab = TABS[Number(e.key) - 1];
      const target = e.target as HTMLElement | null;
      if (!tab || target?.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      router.push(`/patients/${encodeURIComponent(patientId)}?tab=${tab.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [patientId, router]);

  // Arrow keys, Home and End move focus between the tabs that are visible at this width.
  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const items = [...(list.current?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter(
      (el) => el.offsetParent !== null,
    );
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? items.length - 1
          : (at + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };
  return (
    <div className="px-4">
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
      <nav aria-label="Patient sections" className="hidden overflow-x-auto md:block">
        <ul ref={list} onKeyDown={onListKey} className="flex gap-1">
          {TABS.map((tab) => (
            <li key={tab.id} className={tab.primary ? undefined : "hidden lg:list-item"}>
              <Link
                href={href(tab.id)}
                aria-current={tab.id === active ? "page" : undefined}
                aria-keyshortcuts={`Alt+${TABS.indexOf(tab) + 1}`}
                className={cn(
                  "relative inline-flex min-h-10 items-center rounded-t-md px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors",
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
          <li className="lg:hidden">
            <Menu
              align="start"
              trigger={
                <button
                  type="button"
                  className={cn(
                    "relative inline-flex min-h-10 items-center gap-1 rounded-t-md px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                    moreActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  More
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </button>
              }
            >
              {TABS.filter((tab) => !tab.primary).map((tab) => (
                <MenuItem
                  key={tab.id}
                  render={<Link href={href(tab.id)} />}
                  className={tab.id === active ? "font-semibold text-primary" : undefined}
                >
                  {tab.label}
                </MenuItem>
              ))}
            </Menu>
          </li>
        </ul>
      </nav>
    </div>
  );
}
