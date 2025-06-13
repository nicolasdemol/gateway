"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export function NavUser() {
  return (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      className="mt-auto flex items-center gap-2"
    >
      <LogOut />
      Log out
    </Button>
  );
}
