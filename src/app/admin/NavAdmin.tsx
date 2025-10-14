"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function Nav({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <nav className="bg-primary text-primary-foreground flex justify-center items-center px-4 gap-2">
      {children}
      <NavLink href="/admin/blog">Blog</NavLink>
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
