import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-5",
        className,
      )}
      {...props}
    />
  );
}
