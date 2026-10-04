import { ArrowDown, ArrowRight, Globe, Server, Smartphone } from "lucide-react";
import { SnowflakeLogo } from "@/components/shared/snowflake-logo";

const NODES = [
  { title: "You", note: "Browser or phone", icon: Globe },
  { title: "Medynium app", note: "Web and mobile, no secrets", icon: Smartphone },
  { title: "Medynium API", note: "Connects as you, with your role", icon: Server },
];

const INSIDE = [
  "Row access policies",
  "Cortex Analyst",
  "Cortex Search",
  "Cortex AI models",
  "Audit tables",
];

/** How a request travels. A list, so a screen reader hears the order; the arrows are decoration. */
export function ArchitectureFigure() {
  return (
    <figure className="mt-6 space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <ol className="flex flex-col items-stretch gap-2 sm:flex-row">
        {NODES.map(({ title, note, icon: Icon }, index) => (
          <li key={title} className="contents">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="flex items-center justify-center text-muted-foreground"
              >
                <ArrowRight className="size-4 max-sm:hidden" />
                <ArrowDown className="size-4 sm:hidden" />
              </span>
            ) : null}
            <span className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span className="min-w-0 text-sm">
                <span className="block font-semibold text-foreground">{title}</span>
                <span className="block text-xs text-muted-foreground">{note}</span>
              </span>
            </span>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="flex justify-center text-muted-foreground">
        <ArrowDown className="size-4" />
      </div>
      <div className="rounded-lg border border-[#29B5E8]/60 bg-[#29B5E8]/10 p-3.5">
        <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-foreground">
          <SnowflakeLogo className="size-5" />
          Snowflake
          <span className="text-xs font-normal text-muted-foreground">
            records, labels, access rules and models in one place
          </span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {INSIDE.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="pt-1 text-xs text-muted-foreground">
        The app never talks to Snowflake directly. Every request runs under the signed-in
        person&apos;s own role.
      </figcaption>
    </figure>
  );
}
