"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DOC_GROUPS } from "../lib/groups";
import type { DocSection } from "../types";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function TocList({ sections, active }: { sections: DocSection[]; active: string }) {
  return (
    <div className="space-y-5">
      {DOC_GROUPS.map((group) => {
        const items = sections.filter((section) => section.group === group.id);
        if (items.length === 0) return null;
        return (
          <div key={group.id}>
            <p className="px-3 pb-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="border-l border-border">
              {items.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={active === section.id ? "location" : undefined}
                    className={cn(
                      "-ml-px block border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                      active === section.id && "border-primary font-medium text-primary",
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Contents: a sticky list beside the text on wide screens, a collapsible list above it on small ones. */
export function DocsToc({ sections }: { sections: DocSection[] }) {
  const active = useActiveSection(sections.map((section) => section.id));
  return (
    <nav aria-label="Contents" className="print:hidden">
      <details className="rounded-xl border border-border bg-card lg:hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">On this page</summary>
        <div className="border-t border-border p-3">
          <TocList sections={sections} active={active} />
        </div>
      </details>
      <div className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto pb-6 lg:block">
        <TocList sections={sections} active={active} />
      </div>
    </nav>
  );
}
