import { SnowflakeLogo } from "@/components/shared/snowflake-logo";

const FACTS = ["For clinicians", "Synthetic data only", "Decision support, not diagnosis"];

export function DocsHero() {
  return (
    <section
      aria-labelledby="docs-title"
      className="border-b border-border bg-surface-2 print:border-0 print:bg-transparent"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">User guide</p>
        <h1 id="docs-title" className="mt-2 text-3xl text-heading sm:text-4xl">
          Medynium documentation
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          How to use the workstation and the assistant, how answers are produced and checked, and
          the Snowflake platform underneath.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {FACTS.map((fact) => (
            <li
              key={fact}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {fact}
            </li>
          ))}
          <li className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <SnowflakeLogo className="size-3.5" />
            Built on Snowflake
          </li>
        </ul>
      </div>
    </section>
  );
}
