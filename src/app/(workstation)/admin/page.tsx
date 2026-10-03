import type { Metadata } from "next";
import { AdminLanding } from "./components/admin-landing";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return <AdminLanding />;
}
