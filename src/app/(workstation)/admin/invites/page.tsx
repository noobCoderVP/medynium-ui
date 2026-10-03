import type { Metadata } from "next";
import { InvitesView } from "./components/invites-view";

export const metadata: Metadata = { title: "Invites" };

export default function InvitesPage() {
  return <InvitesView />;
}
