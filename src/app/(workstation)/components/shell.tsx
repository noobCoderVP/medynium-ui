"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentActivity, AgentProvider } from "@/features/agent-panel";
import { FocusProvider, useFocusMode } from "../hooks/focus-mode";
import { BottomTabs } from "./bottom-tabs";
import { FocusBar } from "./focus-bar";
import { NavRail } from "./nav-rail";
import { TopBar } from "./top-bar";

// The panel and the drawer load after first paint (06 section 4).
const AgentPanel = dynamic(() => import("@/features/agent-panel").then((m) => m.AgentPanel), {
  ssr: false,
});
const EvidenceDrawer = dynamic(() => import("@/features/evidence").then((m) => m.EvidenceDrawer), {
  ssr: false,
});

/**
 * The workstation frame on every screen: top bar, navigation, workspace, the assistant slot and the activity
 * strip (the synthetic-data banner comes from the root layout). In focus mode only the workspace and a slim bar
 * remain. The workspace is a plain scrolling region, so it keeps working if the assistant never loads.
 */
function Frame({ children }: { children: ReactNode }) {
  const { focus } = useFocusMode();
  return (
    <div className="flex h-dvh flex-col">
      {focus ? <FocusBar /> : <TopBar />}
      <div className="flex min-h-0 flex-1">
        {focus ? null : <NavRail />}
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto outline-none">
          <div className="mx-auto w-full max-w-[112rem] p-4 md:px-6 md:py-8 2xl:px-10">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
        {focus ? null : <AgentPanel />}
      </div>
      {focus ? null : (
        <>
          <div className="hidden md:block">
            <AgentActivity />
          </div>
          <BottomTabs />
        </>
      )}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AgentProvider>
        <FocusProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Frame>{children}</Frame>
          <EvidenceDrawer />
        </FocusProvider>
      </AgentProvider>
    </TooltipProvider>
  );
}
