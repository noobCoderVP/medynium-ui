import {
  FlaskConical,
  HeartPulse,
  Lock,
  Pill,
  Receipt,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { env } from "@/lib/env";

const SOURCES: { label: string; icon: LucideIcon }[] = [
  { label: "Encounters", icon: Stethoscope },
  { label: "Medications", icon: Pill },
  { label: "Labs", icon: FlaskConical },
  { label: "Claims", icon: Receipt },
];

const TAGS = [
  { label: "Patient fact", cls: "bg-fact-soft text-fact" },
  { label: "Retrieved source", cls: "bg-source-soft text-source" },
  { label: "AI synthesis", cls: "bg-synth-soft text-synth" },
];

const PILLARS: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Governed access", text: "You only see patients you are allowed to.", icon: Lock },
  {
    title: "Evidence on every answer",
    text: "Each statement shows where it came from.",
    icon: ShieldCheck,
  },
  {
    title: "You stay in control",
    text: "Everything the assistant does has a manual control.",
    icon: Sparkles,
  },
];

/** Product intro shown beside the sign-in card on desktop. Decorative, no data, hidden below lg. */
export function IntroPanel() {
  return (
    <aside
      aria-label={`About ${env.NEXT_PUBLIC_APP_NAME}`}
      className="hidden flex-col justify-center gap-8 border-r border-border bg-surface-2 px-12 py-10 lg:flex xl:px-16"
    >
      <div className="max-w-xl space-y-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
          >
            <HeartPulse className="size-5" />
          </span>
          <p className="font-heading text-2xl font-bold tracking-tight">
            {env.NEXT_PUBLIC_APP_NAME}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-heading xl:text-4xl">
            The whole patient, in one view.
          </h2>
          <p className="text-base text-muted-foreground">
            Records from every system, joined and explained, with an assistant that shows its
            evidence.
          </p>
        </div>

        <figure aria-hidden="true" className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {SOURCES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-3 text-xs font-medium text-muted-foreground"
              >
                <Icon className="size-5 text-primary" />
                {label}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 400 36" className="h-9 w-full text-primary/60" fill="none">
            {[50, 150, 250, 350].map((x) => (
              <path
                key={x}
                d={`M${x} 0 C${x} 20 200 14 200 34`}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))}
            <path d="M194 28 L200 36 L206 28" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                PT
              </span>
              <div className="space-y-1.5">
                <div className="h-2.5 w-32 rounded bg-heading/70" />
                <div className="h-2 w-20 rounded bg-muted-foreground/30" />
              </div>
              <span className="ml-auto rounded-full bg-ok-soft px-2 py-0.5 text-xs font-medium text-ok">
                Patient 360
              </span>
            </div>
            <div className="mt-4 rounded-lg border border-agent/30 bg-agent-soft p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-agent">
                <Sparkles className="size-3.5" /> Assistant
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="h-2 w-full rounded bg-agent/25" />
                <div className="h-2 w-4/5 rounded bg-agent/25" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TAGS.map((t) => (
                  <span
                    key={t.label}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.cls}`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </figure>

        <ul className="grid gap-4">
          {PILLARS.map(({ title, text, icon: Icon }) => (
            <li key={title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
              >
                <Icon className="size-4" />
              </span>
              <p className="text-sm">
                <span className="font-semibold">{title}.</span>{" "}
                <span className="text-muted-foreground">{text}</span>
              </p>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground">
          Synthetic data only. Decision support, not diagnosis.
        </p>
      </div>
    </aside>
  );
}
