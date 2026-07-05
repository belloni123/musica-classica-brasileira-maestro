import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-normal transition-[border-color,background-color,opacity,box-shadow] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--primary)] bg-[var(--primary)] text-[#fcfbf8] shadow-[var(--button-inset)] hover:opacity-90 focus-visible:shadow-[var(--focus-shadow)] [&_svg]:text-[#fcfbf8] [&_svg]:stroke-[#fcfbf8]",
        secondary:
          "border-[var(--border-strong)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:shadow-[var(--focus-shadow)]",
        ghost:
          "border-transparent bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:shadow-[var(--focus-shadow)]",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
