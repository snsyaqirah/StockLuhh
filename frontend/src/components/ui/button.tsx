import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-neu-flat hover:shadow-neu-flat-hover hover:-translate-y-px active:translate-y-px active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25),inset_-4px_-4px_8px_rgba(255,255,255,0.15)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-neu-flat hover:shadow-neu-flat-hover hover:-translate-y-px active:translate-y-px active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25),inset_-4px_-4px_8px_rgba(255,255,255,0.15)]",
        outline:
          "bg-background text-foreground shadow-neu-flat hover:shadow-neu-flat-hover hover:-translate-y-px active:translate-y-px active:shadow-neu-inset-sm",
        secondary:
          "bg-background text-secondary-foreground shadow-neu-sm hover:shadow-neu-flat hover:-translate-y-px active:translate-y-px active:shadow-neu-inset-sm",
        ghost:
          "text-foreground hover:bg-background/60 hover:shadow-neu-sm active:shadow-neu-inset-sm",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-accent/15 text-primary hover:bg-accent/25 hover:shadow-neu-sm active:shadow-neu-inset-sm",
      },
      size: {
        default: "h-11 rounded-2xl px-5 py-2",
        sm: "h-9 rounded-xl px-3.5",
        lg: "h-12 rounded-2xl px-7",
        xl: "h-14 rounded-3xl px-10 text-base",
        icon: "h-11 w-11 rounded-full",
        "icon-sm": "h-9 w-9 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
