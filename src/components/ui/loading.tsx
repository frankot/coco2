"use client";

import { Loader2 } from "lucide-react";

type LoadingProps = {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
};

export default function Loading({ fullScreen = false, size = "md", text }: LoadingProps) {
  // Map size to actual pixel values
  const sizeMap = {
    sm: "size-6",
    md: "size-12",
    lg: "size-24",
  };

  const classes = fullScreen
    ? "flex justify-center items-center h-screen"
    : "flex justify-center items-center py-8";

  return (
    <div className={classes}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
        {text && <p className="text-muted-foreground font-medium text-lg">{text}</p>}
      </div>
    </div>
  );
}
