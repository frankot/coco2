import { cn } from "@/lib/utils";
import Image from "next/image";

interface DividerProps {
  className?: string;
  variant?: "default" | "organic" | "minimal" | "wave" | "logo";
  size?: "sm" | "md" | "lg";
  logo?: React.ReactNode;
}

export function Divider({ className, variant = "organic", size = "md", logo }: DividerProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    default: (
      <div
        className={cn(
          "w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent",
          sizeClasses[size],
          className
        )}
      />
    ),
    organic: (
      <div className={cn("w-full flex justify-center", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          {/* Main organic shape */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 rounded-full" />

          {/* Organic accent dots */}
          <div className="absolute -top-1 left-1/4 w-1 h-1 bg-primary/60 rounded-full" />
          <div className="absolute -top-1 right-1/4 w-1 h-1 bg-primary/40 rounded-full" />
          <div className="absolute -bottom-1 left-1/3 w-1 h-1 bg-primary/50 rounded-full" />
          <div className="absolute -bottom-1 right-1/3 w-1 h-1 bg-primary/30 rounded-full" />
        </div>
      </div>
    ),
    minimal: (
      <div className={cn("w-full flex justify-center", className)}>
        <div
          className={cn(
            "bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full",
            sizeClasses[size],
            "w-24"
          )}
        />
      </div>
    ),
    wave: (
      <div className={cn("w-full flex justify-center", className)}>
        <svg
          width="120"
          height={sizeClasses[size]}
          viewBox="0 0 120 8"
          fill="none"
          className="w-24"
        >
          <path
            d="M0 4C20 0 20 8 40 4C60 0 60 8 80 4C100 0 100 8 120 4"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M0 4C20 0 20 8 40 4C60 0 60 8 80 4C100 0 100 8 120 4"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
            strokeDasharray="2 2"
          />
        </svg>
      </div>
    ),
    logo: (
      <div className={cn("w-full flex items-center justify-center gap-4", className)}>
        {/* Left line */}
        <div
          className={cn(
            "bg-gradient-to-r from-transparent to-primary/30 rounded-full",
            sizeClasses[size],
            "w-1/3"
          )}
        />

        {/* Centered logo */}
        <div className="flex items-center justify-center">
          {logo || (
            <div className="relative size-20 opacity-60">
              <Image src="/logo.png" alt="DR. COCO" fill className="object-contain" priority />
            </div>
          )}
        </div>

        {/* Right line */}
        <div
          className={cn(
            "bg-gradient-to-l from-transparent to-primary/30 rounded-full",
            sizeClasses[size],
            "w-1/3"
          )}
        />
      </div>
    ),
  };

  return variants[variant];
}
