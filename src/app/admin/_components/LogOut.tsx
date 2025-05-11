"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogOut() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={handleLogout} variant="destructive" size="sm">
      Log Out
    </Button>
  );
}
