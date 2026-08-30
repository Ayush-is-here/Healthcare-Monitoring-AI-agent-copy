import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The system's only button. Solid ink or ghost outline — never a
 * conventional coloured outline, never a gradient, never a weight
 * above 600.
 */
const pillButton = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-medium tracking-[-0.19px]",
    "transition-[background-color,color,box-shadow,opacity,transform]",
    "duration-200 ease-[var(--ease-out-soft)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.985]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-graphite shadow-card",
        ghost:
          "border border-silver bg-transparent text-graphite hover:bg-paper-deep",
        surface: "bg-white text-graphite shadow-card hover:shadow-raised",
        quiet: "bg-transparent text-slate hover:text-graphite",
      },
      shape: {
        pill: "rounded-pill",
        rect: "rounded-input",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[0.9375rem]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "pill",
      size: "md",
    },
  },
);

export interface PillButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButton> {
  children?: ReactNode;
}

export function PillButton({
  className,
  variant,
  shape,
  size,
  type = "button",
  ...props
}: PillButtonProps) {
  return (
    <button
      type={type}
      className={cn(pillButton({ variant, shape, size }), className)}
      {...props}
    />
  );
}
