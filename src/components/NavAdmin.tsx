"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center items-center px-4">
      {children}
    </nav>
  );
}
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
}
