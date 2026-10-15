"use client";

import { useSession } from "next-auth/react";
import { getMaxPacks } from "@/lib/order-limits";

// Current Viewer Pack Limit
export function useMaxPacks() {
  const { data: session } = useSession();
  return getMaxPacks(session?.user?.accountType);
}
