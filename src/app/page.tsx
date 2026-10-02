import { ApiStatus } from "@/components/api-status";
import { env } from "@/lib/env";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{env.NEXT_PUBLIC_APP_NAME}</h1>
        <p className="mt-1 text-muted-foreground">
          Governed Patient 360 and clinical agent. The workstation is built slice by slice; this
          page confirms the stack is wired up.
        </p>
      </div>
      <ApiStatus />
    </main>
  );
}
