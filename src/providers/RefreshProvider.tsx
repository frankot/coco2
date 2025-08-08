"use client";

import { createContext, useContext, useState } from "react";

type RefreshContextType = {
  refreshCounter: number;
  triggerRefresh: () => void;
};

const RefreshContext = createContext<RefreshContextType>({
  refreshCounter: 0,
  triggerRefresh: () => {},
});

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const triggerRefresh = () => setRefreshCounter((prev) => prev + 1);

  return (
    <RefreshContext.Provider value={{ refreshCounter, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export const useRefresh = () => useContext(RefreshContext);
