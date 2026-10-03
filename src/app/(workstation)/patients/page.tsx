import type { Metadata } from "next";
import { Suspense } from "react";
import { PatientsView } from "./components/patients-view";

export const metadata: Metadata = { title: "Patients" };

// PatientsView reads search params on the client, so it sits in Suspense.
export default function PatientsPage() {
  return (
    <Suspense>
      <PatientsView />
    </Suspense>
  );
}
