import { HeartPulse } from "lucide-react";
import { env } from "@/lib/env";

/** Centered card for sign-in and invite pages. No shell, no patient data, so no synthetic banner needed. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-10">
      <div className="flex items-center gap-3">
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
    </main>
  );
}
