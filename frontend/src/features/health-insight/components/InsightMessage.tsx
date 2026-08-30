import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { Tag } from "@/components/primitives/Tag";
import { InsightSection } from "@/features/health-insight/components/InsightSection";
import { SeekCareCallout } from "@/features/health-insight/components/SeekCareCallout";
import type { HealthInsight } from "@/features/health-insight/types";

export interface InsightMessageProps {
  insight: HealthInsight;
  createdAt: number;
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

/**
 * An assistant turn. The API returns structure, not prose, so this
 * renders as a document rather than a speech bubble.
 */
export function InsightMessage({ insight, createdAt }: InsightMessageProps) {
  return (
    <SurfaceCard
      padding="roomy"
      className="animate-rise-in flex flex-col gap-7"
      aria-label="Health insight"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Tag tone="solid">Health Insight</Tag>
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="type-caption text-stone"
        >
          {timeFormatter.format(createdAt)}
        </time>
      </header>

      <p className="type-subheading max-w-[62ch] text-graphite">
        {insight.summary}
      </p>

      <InsightSection eyebrow="Key findings" items={insight.key_findings} />

      <InsightSection
        eyebrow="Risk assessment"
        items={insight.risk_assessment}
        tone="caution"
        emptyLabel="No elevated risks identified."
      />

      <InsightSection
        eyebrow="Recommendations"
        items={insight.recommendations}
      />

      <SeekCareCallout guidance={insight.when_to_seek_care} />

      <footer className="border-t border-silver pt-4">
        <p className="type-caption text-stone">
          Generated from your own record. Informational only — it is not a
          diagnosis and does not replace advice from your clinician.
        </p>
      </footer>
    </SurfaceCard>
  );
}
