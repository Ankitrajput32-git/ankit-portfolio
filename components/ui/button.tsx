import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/*
 * Restyled shadcn button. Square corners, sentence-case mono label, and a fill that
 * wipes in from the left on hover instead of a flat colour swap, the same
 * direction as every other hover on the site.
 */
const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap",
    "font-mono text-[0.8125rem] leading-none tracking-[0.01em]",
    "transition-[color,border-color] duration-300 ease-(--ease-out)",
    "before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-(--ease-out)",
    "hover:before:scale-x-100 focus-visible:before:scale-x-100",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        solid: "bg-accent text-on-accent before:bg-ink hover:text-paper focus-visible:text-paper",
        outline:
          "border border-rule-strong text-ink before:bg-ink hover:border-ink hover:text-paper focus-visible:text-paper",
        inverse:
          "bg-on-accent text-paper-fixed before:bg-paper-fixed hover:text-on-accent focus-visible:text-on-accent",
        ghost: "text-ink before:hidden hover:text-accent-ink",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-11 px-4",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
