import { HeartPulse } from "lucide-react";
import { PoweredBySnowflake } from "@/components/shared/powered-by-snowflake";
import { env } from "@/lib/env";
import { IntroPanel } from "./components/intro-panel";

/** Sign-in, invite and reset pages: product intro on the left (desktop only), form on the right. No shell, no patient data, so no synthetic banner needed. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:h-dvh lg:grid-cols-[minmax(0,7fr)_minmax(380px,3fr)] lg:overflow-hidden">
      <IntroPanel />
      <main className="mx-auto flex w-full max-w-md flex-col justify-center gap-6 px-4 py-10 lg:max-w-[360px] lg:overflow-y-auto lg:px-0">
        <div className="flex items-center gap-3 lg:hidden">
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
          >
            <HeartPulse className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-bold tracking-tight">
              {env.NEXT_PUBLIC_APP_NAME}
            </p>
            <p className="text-sm text-muted-foreground">
              Governed Patient 360 and clinical assistant
            </p>
          </div>
        </div>
        {children}
        <PoweredBySnowflake className="lg:hidden" />
      </main>
    </div>
  );
}
