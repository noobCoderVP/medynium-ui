import { env } from "@/lib/env";

/** Centered card for sign-in and invite pages. No shell, no patient data, so no synthetic banner needed. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-10">
      <div>
        <p className="text-2xl font-semibold tracking-tight text-primary">
          {env.NEXT_PUBLIC_APP_NAME}
        </p>
        <p className="text-sm text-muted-foreground">Governed Patient 360 and clinical assistant</p>
      </div>
      {children}
    </main>
  );
}
