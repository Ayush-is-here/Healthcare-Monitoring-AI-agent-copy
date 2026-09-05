import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Cards are the primary structural unit. They sit on the paper
 * field and are separated by a diffuse shadow — never by a border.
 */
export interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** `flush` removes padding for cards that own their own layout. */
  padding?: "flush" | "tight" | "default" | "roomy";
  /** `hairline` is a flat, close-to-surface shadow for muted cards — a
      stood-down medication, a past visit — that must still read as a
      card on the paper field without borrowing the anti-pattern of a
      border. `none` is truly flat, for a card nested inside another. */
  elevation?: "card" | "raised" | "hairline" | "none";
  radius?: "card" | "panel";
}

const paddingMap = {
  flush: "",
  tight: "p-4",
  default: "p-6",
  roomy: "p-6 sm:p-8",
} as const;

const elevationMap = {
  card: "shadow-card",
  raised: "shadow-raised",
  hairline: "shadow-hairline",
  none: "",
} as const;

const radiusMap = {
  card: "rounded-card",
  panel: "rounded-panel",
} as const;

export function SurfaceCard({
  className,
  padding = "default",
  elevation = "card",
  radius = "card",
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "bg-white",
        radiusMap[radius],
        elevationMap[elevation],
        paddingMap[padding],
        className,
      )}
      {...props}
    />
  );
}
