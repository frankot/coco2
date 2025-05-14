"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavIconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  ariaLabel: string;
  isActive?: boolean;
  className?: string;
}

export function NavIconButton({
  icon: Icon,
  onClick,
  ariaLabel,
  isActive = false,
  className,
}: NavIconButtonProps) {
  return (
    <Button
      className={cn("size-20 text-background", className)}
      size="icon"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div className="relative">
        <Icon className="size-14" />
      </div>
    </Button>
  );
}
