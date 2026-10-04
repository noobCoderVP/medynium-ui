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
import { SnowflakeLogo } from "@/components/shared/snowflake-logo";
import { SNOWFLAKE_FEATURES } from "@/lib/snowflake-features";
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
  { title: "Governed access", text: "Only see patients you're authorized to access.", icon: Lock },
  {
    title: "Evidence on every answer",
    text: "Every insight traces back to its source.",
    icon: ShieldCheck,
  },
  {
    title: "Human controlled",
    text: "AI recommendations remain under user control.",
    icon: Sparkles,
  },
];

/** Product intro shown beside the sign-in card on desktop. Decorative, no data, hidden below lg. */
export function IntroPanel() {
  return (
    <aside
      aria-label={`About ${env.NEXT_PUBLIC_APP_NAME}`}
      className="hidden flex-col justify-center overflow-y-auto border-r border-border bg-surface-2 px-12 py-8 lg:flex xl:px-16"
    >
      <div className="mx-auto w-full max-w-3xl space-y-6 [@media(max-height:760px)]:space-y-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
          >
            <HeartPulse className="size-5" />
          </span>
          <p className="font-heading text-2xl font-bold tracking-tight">
            {env.NEXT_PUBLIC_APP_NAME}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-heading xl:text-[2.5rem] xl:leading-tight">
            The whole patient, in one view.
          </h2>
          <p className="max-w-[550px] text-base text-muted-foreground">
            Records from every system, joined and explained, with an assistant that shows its
            evidence.
          </p>
        </div>

        <figure
          aria-hidden="true"
          className="mx-auto max-w-xl space-y-2 [@media(max-height:900px)]:hidden"
        >
          <div className="grid grid-cols-4 gap-2">
            {SOURCES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-2.5 text-xs font-medium text-muted-foreground"
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

        <ul className="grid gap-3 lg:grid-cols-3">
          {PILLARS.map(({ title, text, icon: Icon }) => (
            <li key={title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
              >
                <Icon className="size-4" />
              </span>
              <p className="text-sm leading-snug">
                <span className="block font-semibold">{title}</span>
                <span className="text-muted-foreground">{text}</span>
              </p>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="built-on-snowflake"
          className="space-y-4 rounded-2xl border border-[#29B5E8]/25 bg-gradient-to-br from-[#29B5E8]/10 via-card to-card p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <SnowflakeLogo className="size-14" />
            <div className="space-y-0.5">
              <h3
                id="built-on-snowflake"
                className="font-heading text-lg font-bold tracking-wide text-heading uppercase"
              >
                Powered by Snowflake
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                Data. Intelligence. Evidence. Governance.
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {SNOWFLAKE_FEATURES.map((feature) => (
              <li
                key={feature.name}
                className="rounded-lg border border-border bg-card/90 px-3 py-2"
              >
                <p className="text-sm font-semibold text-foreground">{feature.name}</p>
                <p className="text-xs text-muted-foreground">{feature.tagline}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-muted-foreground">
          Synthetic data only. Decision support, not diagnosis.
        </p>
      </div>
    </aside>
  );
}
