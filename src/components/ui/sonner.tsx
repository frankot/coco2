"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      offset={7}
      className={cn(
        "toaster group",
        "[&>*]:!font-outfit [&>*]:!rounded-lg [&>*]:!shadow-lg",
        "[&>*]:!bg-white [&>*]:!border [&>*]:!border-primary",
        "[&_div[role=status]]:!gap-3",
        "[&_button]:!transition-opacity [&_button:hover]:!opacity-70",
        "[&>*]:!text-foreground",
        className
      )}
      {...props}
    />
  );
};

export { Toaster };
