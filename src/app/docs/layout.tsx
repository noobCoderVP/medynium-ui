import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsFooter } from "./components/docs-footer";
import { DocsHeader } from "./components/docs-header";

/**
 * The documentation has its own frame, apart from the workstation: a slim header, a contents list and a reading
 * column. It shows no patient data and calls no API, so it needs neither the shell nor the synthetic banner.
 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <DocsHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <DocsFooter />
    </TooltipProvider>
  );
}
