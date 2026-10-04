import { DOC_SECTIONS } from "../lib/sections";
import { DocSection } from "./doc-section";
import { DocsHero } from "./docs-hero";
import { DocsToc } from "./docs-toc";

export function DocsView() {
  return (
    <>
      <DocsHero />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-12 print:block">
        <DocsToc sections={DOC_SECTIONS} />
        <div className="max-w-3xl">
          {DOC_SECTIONS.map((section, index) => (
            <DocSection key={section.id} section={section} number={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
}
