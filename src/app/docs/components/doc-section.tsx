import { DOC_GROUPS } from "../lib/groups";
import type { DocSection as DocSectionData } from "../types";
import { ArchitectureFigure } from "./architecture-figure";
import { DocTable } from "./doc-table";

/** One section as a printed chapter would read: number and group, title, one-line summary, then the topics. */
export function DocSection({ section, number }: { section: DocSectionData; number: number }) {
  const group = DOC_GROUPS.find((g) => g.id === section.group)?.label;
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-h`}
      className="scroll-mt-20 border-t border-border py-10 first:border-t-0 first:pt-0"
    >
      <p className="text-xs font-semibold tracking-wider text-primary uppercase">
        {String(number).padStart(2, "0")} <span aria-hidden="true">·</span> {group}
      </p>
      <h2 id={`${section.id}-h`} className="mt-1 text-2xl">
        {section.title}
      </h2>
      <p className="mt-1.5 max-w-prose text-base text-muted-foreground">{section.summary}</p>
      {section.figure === "architecture" ? <ArchitectureFigure /> : null}
      <div className="mt-6 space-y-6">
        {section.topics.map((topic) => (
          <article key={topic.title} className="break-inside-avoid border-l-2 border-border pl-4">
            <h3 className="text-base text-heading">{topic.title}</h3>
            <p className="mt-1 max-w-prose leading-7 text-foreground/85">{topic.body}</p>
          </article>
        ))}
      </div>
      {section.table ? <DocTable table={section.table} label={`${section.title} table`} /> : null}
    </section>
  );
}
