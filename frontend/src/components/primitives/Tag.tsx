import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "solid" | "action";
}

const toneMap = {
  neutral: "bg-paper text-slate",
  solid: "bg-ink text-white",
  action: "bg-action-wash text-action",
} as const;

/** Pill label. Carries metadata, never an action. */
export function Tag({ className, tone = "neutral", ...props }: TagProps) {
  return (
    <span
      className={cn(
        "type-caption inline-flex items-center gap-1.5 rounded-pill px-3 py-1",
        toneMap[tone],
        className,
      )}
      {...props}
    />
  );
}
