import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-transparent px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-background text-secondary-foreground shadow-neu-inset-sm",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-background text-foreground shadow-neu-inset-sm",
        // Stock status variants
        "stock-full": "bg-stock-full/15 text-stock-full",
        "stock-good": "bg-stock-good/15 text-stock-good",
        "stock-low": "bg-stock-low/15 text-stock-low",
        "stock-empty": "bg-stock-empty/15 text-stock-empty",
        "stock-expired": "bg-stock-expired/15 text-stock-expired",
        // Category badges
        category: "bg-background text-secondary-foreground shadow-neu-inset-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
