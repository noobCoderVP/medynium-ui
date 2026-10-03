"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe, useSignOut } from "@/features/session";

const ROLE = { DOCTOR: "Doctor", ASSISTANT: "Clinic assistant" } as const;

/** Who is signed in, their role, and sign out. A plain button rather than a menu: fewer keystrokes, no focus trap. */
export function UserMenu() {
  const me = useMe();
  const signOut = useSignOut();
  const user = me.data;
  return (
    <div className="flex items-center gap-2">
      {user ? (
        <p className="hidden text-right leading-tight lg:block">
          <span className="block text-sm font-medium">{user.display_name}</span>
          <span className="block text-xs text-muted-foreground">
            {ROLE[user.role]}
            {user.is_admin ? " · Admin" : ""}
          </span>
        </p>
      ) : null}
      <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut.mutate()}>
        <LogOut aria-hidden="true" />
      </Button>
    </div>
  );
}
