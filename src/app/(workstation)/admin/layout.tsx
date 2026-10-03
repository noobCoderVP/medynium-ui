import { AdminGate } from "@/features/session";
import { AdminNav } from "./components/admin-nav";

/** Doctor-only. The gate is a courtesy; every admin endpoint enforces the role on the server too. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGate>
      <div className="space-y-4">
        <AdminNav />
        {children}
      </div>
    </AdminGate>
  );
}
