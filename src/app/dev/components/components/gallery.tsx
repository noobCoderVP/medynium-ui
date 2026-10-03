"use client";

import { useState } from "react";
import { SyntheticBanner } from "@/components/synthetic-banner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SamplerData } from "./sampler-data";
import { SamplerLists } from "./sampler-lists";
import { SamplerStates } from "./sampler-states";

// Full class names, so Tailwind can see them (it cannot read names built from strings).
const ROLES = [
  { name: "primary", solid: "bg-primary", soft: "bg-accent text-accent-foreground" },
  { name: "agent", solid: "bg-agent", soft: "bg-agent-soft text-agent" },
  { name: "fact", solid: "bg-fact", soft: "bg-fact-soft text-fact" },
  { name: "source", solid: "bg-source", soft: "bg-source-soft text-source" },
  { name: "synth", solid: "bg-synth", soft: "bg-synth-soft text-synth" },
  { name: "warn", solid: "bg-warn", soft: "bg-warn-soft text-warn" },
  { name: "crit", solid: "bg-crit", soft: "bg-crit-soft text-crit" },
  { name: "ok", solid: "bg-ok", soft: "bg-ok-soft text-ok" },
] as const;

function Swatches() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {ROLES.map((role) => (
        <div key={role.name} className="rounded-lg border border-border p-2 text-xs">
          <div className={`h-8 rounded ${role.solid}`} aria-hidden="true" />
          <p className="mt-1 font-mono">{role.name}</p>
          <p className={`mt-1 rounded px-1 py-0.5 ${role.soft}`}>on soft</p>
        </div>
      ))}
    </div>
  );
}

function Controls() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
      <Input aria-label="Sample input" placeholder="Input" className="w-40" />
      <Input
        aria-label="Sample invalid input"
        aria-invalid="true"
        defaultValue="Invalid"
        className="w-40"
      />
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Sample dialog"
        description="Focus moves in, Esc closes, focus returns to the button."
      >
        <p className="p-4 text-sm">Dialog body.</p>
      </Dialog>
    </div>
  );
}

function Panel({ mode }: { mode: "light" | "dark" }) {
  return (
    <div
      className={`${mode === "dark" ? "dark" : ""} space-y-6 rounded-xl border border-border bg-background p-4 text-foreground`}
    >
      <h2 className="text-lg font-semibold capitalize">{mode} theme</h2>
      <SyntheticBanner />
      <Swatches />
      <Controls />
      <SamplerStates />
      <SamplerData />
      <SamplerLists />
    </div>
  );
}

/** Light and dark side by side, so a reviewer (or an axe run) sees both in one page. */
export function Gallery() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <h1>Component gallery</h1>
      <p className="text-sm text-muted-foreground">
        Development only: this route is a 404 in a production build. Every shared component in every
        state, in both themes.
      </p>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel mode="light" />
        <Panel mode="dark" />
      </div>
    </div>
  );
}
