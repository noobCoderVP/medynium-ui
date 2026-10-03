"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { AgentActivity, AgentProvider } from "@/features/agent-panel";
import { BottomTabs } from "./bottom-tabs";
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
 * The workstation frame on every screen: banner, top bar, navigation, workspace, the assistant slot and the
 * activity strip. The workspace is a plain scrolling region, so it keeps working if the assistant never loads.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <AgentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="flex h-dvh flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <NavRail />
          <main id="main" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto outline-none">
            <div className="mx-auto w-full max-w-[112rem] p-4 md:px-6 md:py-8 2xl:px-10">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <AgentPanel />
        </div>
        <div className="hidden md:block">
          <AgentActivity />
        </div>
        <BottomTabs />
      </div>
      <EvidenceDrawer />
    </AgentProvider>
  );
}
