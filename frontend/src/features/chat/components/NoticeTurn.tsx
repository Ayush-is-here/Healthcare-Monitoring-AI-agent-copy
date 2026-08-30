import { AlertCircle, Info } from "lucide-react";

import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { cn } from "@/lib/utils";

export interface NoticeTurnProps {
  tone: "info" | "error";
  title: string;
  body?: string;
}

/** System turn — a failure, or a note about what the chat can do. */
export function NoticeTurn({ tone, title, body }: NoticeTurnProps) {
  const Icon = tone === "error" ? AlertCircle : Info;

  return (
    <SurfaceCard
      padding="tight"
      className="animate-rise-in flex gap-3"
      role={tone === "error" ? "alert" : undefined}
    >
      <Icon
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "error" ? "text-critical" : "text-action",
        )}
      />

      <div className="flex flex-col gap-1">
        <p className="type-body-sm font-medium text-graphite">{title}</p>
        {body ? <p className="type-caption text-slate">{body}</p> : null}
      </div>
    </SurfaceCard>
  );
}
