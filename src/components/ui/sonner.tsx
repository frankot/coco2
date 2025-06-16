"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn(
        "toaster group bg-primary/50",
        "[&>*]:!font-outfit [&>*]:!rounded-lg [&>*]:!shadow-lg",
        "[&>*]:!border-primary/20 [&>*]:backdrop-blur-sm",
        "[&_div[role=status]]:!gap-3",
        "[&_button]:!transition-opacity [&_button:hover]:!opacity-70",
        className
      )}
      {...props}
    />
  );
};

export { Toaster };
