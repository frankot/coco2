"use client";

import { useRouter } from "next/navigation";

export function LogOut() {
  const router = useRouter();

  const handleLogout = () => {
    // For basic auth in browsers, we can't reliably clear credentials or prevent the prompt
    // The simplest solution is to just redirect away from the protected area
    
    // Navigate directly to the home page
    window.location.href = "/";
    
    // Note: Next time they try to access admin, they'll need to re-enter credentials
    // This is because we're doing a full page navigation, not using the Next.js router
  };

  return (
    <button
      onClick={handleLogout}
      className="p-4 hover:bg-red-600 hover:text-white text-primary-foreground"
    >
      Log Out
    </button>
  );
} 