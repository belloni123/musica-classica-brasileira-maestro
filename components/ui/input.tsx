import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-[var(--muted-foreground)] focus:border-[var(--border-strong)] focus:shadow-[var(--focus-shadow)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
