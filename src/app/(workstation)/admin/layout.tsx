import { AdminGate } from "@/features/session";
import { AdminNav } from "./components/admin-nav";

/** Doctor-only. The gate is a courtesy; every admin endpoint enforces the role on the server too. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGate>
      <div className="flex flex-col gap-4 lg:has-[[data-fit]]:h-full">
        <AdminNav />
        {children}
      </div>
    </AdminGate>
  );
}
