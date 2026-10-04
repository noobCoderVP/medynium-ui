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

const SHOW = { 1: "", 2: "hidden lg:block", 3: "hidden xl:block" } as const;
const HIDE_IN_MENU = { 1: "hidden", 2: "lg:hidden", 3: "xl:hidden" } as const;

/**
 * Patient sections as links to ?tab=, sticky under the patient context. Every tab is a link at 1280 px and up; below
 * that the later ones move under "More" (1024 px keeps five, 768 px keeps two), so More appears only when it is
 * needed and every view stays linkable. On a phone the same destinations are one native menu.
 */
export function TabBar({ patientId, active }: { patientId: string; active: TabId }) {
  const router = useRouter();
  const id = useId();
  const list = useRef<HTMLUListElement>(null);
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
    <div className="sticky top-0 z-20 -mx-4 bg-surface px-4 md:-mx-6 md:px-6 2xl:-mx-8 2xl:px-8">
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
      <nav aria-label="Patient sections" className="hidden border-b border-border md:block">
        <ul ref={list} onKeyDown={onListKey} className="flex gap-1">
          {TABS.map((tab) => (
            <li key={tab.id} className={SHOW[tab.tier]}>
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
          <li className="xl:hidden">
            <Menu
              align="start"
              trigger={
                <button
                  type="button"
                  className="relative inline-flex min-h-10 items-center gap-1 rounded-t-md px-3.5 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                >
                  More
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </button>
              }
            >
              {TABS.filter((tab) => tab.tier > 1).map((tab) => (
                <MenuItem
                  key={tab.id}
                  render={<Link href={href(tab.id)} />}
                  className={cn(
                    HIDE_IN_MENU[tab.tier],
                    tab.id === active ? "font-semibold text-primary" : undefined,
                  )}
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
