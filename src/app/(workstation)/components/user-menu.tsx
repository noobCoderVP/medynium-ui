"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { useMe, useSignOut } from "@/features/session";

const ROLE = { DOCTOR: "Doctor", ASSISTANT: "Clinic assistant" } as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** The account control: initials as the trigger, name and role inside, and Sign out as one of its items. */
export function UserMenu() {
  const me = useMe();
  const signOut = useSignOut();
  const user = me.data;
  const role = user ? `${ROLE[user.role]}${user.is_admin ? " · Admin" : ""}` : "";
  return (
    <Menu
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label={user ? `Account: ${user.display_name}` : "Account"}
          className="rounded-full"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          >
            {user ? initials(user.display_name) : "?"}
          </span>
        </Button>
      }
    >
      {user ? (
        <MenuLabel>
          <span className="block text-sm font-medium">{user.display_name}</span>
          <span className="block text-xs text-muted-foreground">{role}</span>
        </MenuLabel>
      ) : null}
      <MenuSeparator />
      <MenuItem onClick={() => signOut.mutate()}>
        <LogOut className="size-4" aria-hidden="true" />
        Sign out
      </MenuItem>
    </Menu>
  );
}
