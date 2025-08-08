"use client";

import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

export function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {children}
    </div>
  );
}
