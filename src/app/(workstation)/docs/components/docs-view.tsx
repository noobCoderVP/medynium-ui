import { PageHeading } from "@/components/shared/page-heading";
import { DOC_SECTIONS } from "../lib/sections";

export function DocsView() {
  return (
    <>
      <PageHeading
        title="Documentation"
        note="How to use Medynium, written for the people who use it."
      />
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-4 lg:self-start">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {DOC_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-10">
          {DOC_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-h`}
              className="scroll-mt-4"
            >
              <h2 id={`${section.id}-h`} className="text-lg font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{section.summary}</p>
              <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
                {section.topics.map((topic) => (
                  <div key={topic.title} className="px-4 py-3.5">
                    <dt className="text-sm font-semibold">{topic.title}</dt>
                    <dd className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {topic.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
