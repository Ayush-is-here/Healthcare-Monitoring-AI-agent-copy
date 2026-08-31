import {
  CategoryScale,
  Chart as ChartJS,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { formatReading } from "@/features/health-metrics/metricSeries";

/* Only the line pieces. chart.js ships every chart type it supports,
   and the auto-registering entry point would pull all of them into the
   bundle for the sake of one line chart. */
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

/* A canvas cannot read Tailwind classes, so the chart has to be handed
   concrete values. They are read from the custom properties `theme.css`
   already defines rather than copied here as literals, so there is one
   place to change a colour. Read once — the tokens are static. */
const FALLBACK = {
  ink: "#101010",
  stone: "#898989",
  font: "Inter, ui-sans-serif, system-ui, sans-serif",
};

let cached: typeof FALLBACK | null = null;

function chartTheme(): typeof FALLBACK {
  if (!cached) {
    const root = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      root.getPropertyValue(name).trim() || fallback;

    cached = {
      ink: read("--color-ink", FALLBACK.ink),
      stone: read("--color-stone", FALLBACK.stone),
      font: read("--font-sans", FALLBACK.font),
    };
  }

  return cached;
}

export interface MetricChartSeries {
  label: string;
  /** One entry per label. `null` is a gap, not a zero. */
  values: (number | null)[];
}

export interface MetricChartProps {
  /** Formatted timestamps, oldest first — the tooltip titles. */
  labels: string[];
  series: MetricChartSeries[];
  unit: string;
  /** Read out to assistive tech in place of the canvas. */
  summary: string;
}

/**
 * The reading history for one card.
 *
 * Axes are hidden: at this height they would cost more room than they
 * explain, and the card already states the latest value. The timestamp
 * of a point lives in its tooltip, which `interaction.mode: "index"`
 * opens for every series at once — so hovering a systolic point shows
 * the diastolic half it was measured with.
 */
export function MetricChart({
  labels,
  series,
  unit,
  summary,
}: MetricChartProps) {
  /* One point is a dot, not a history. The card's own value and
     timestamp already say everything a single reading can. */
  if (labels.length < 2) return null;

  const theme = chartTheme();
  const dense = labels.length > 24;

  const data: ChartData<"line"> = {
    labels,
    datasets: series.map((entry, index) => ({
      label: entry.label,
      data: entry.values,
      /* Second series is dashed rather than coloured: the system
         withholds colour, and a dash reads at a glance either way. */
      borderColor: index === 0 ? theme.ink : theme.stone,
      backgroundColor: index === 0 ? theme.ink : theme.stone,
      borderDash: index === 0 ? undefined : [3, 3],
      borderWidth: 1.5,
      pointRadius: dense ? 0 : 2.5,
      pointHoverRadius: 4,
      tension: 0,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    /* The chart redraws on every refetch; animating that reads as a
       glitch rather than a transition. */
    animation: false,
    interaction: { mode: "index", intersect: false, axis: "x" },
    scales: {
      x: { display: false },
      /* Headroom so the extremes are not drawn on the frame. */
      y: { display: false, grace: "12%" },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.ink,
        cornerRadius: 8,
        padding: 10,
        /* No swatches: the systolic colour *is* the tooltip's own
           background, so its box would be invisible. The rows name
           their series instead, and the legend below maps the lines. */
        displayColors: false,
        titleFont: { family: theme.font, size: 11, weight: 500 },
        bodyFont: { family: theme.font, size: 12, weight: 400 },
        callbacks: {
          label: (item) => {
            /* A gap in one series still produces a tooltip row for it,
               because the other half of the reading is there. */
            const point: number | null = item.parsed.y;

            const value =
              point === null
                ? "not recorded"
                : `${formatReading(point)} ${unit}`;

            return series.length > 1
              ? ` ${item.dataset.label}: ${value}`
              : ` ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col">
      {/* chart.js needs a sized parent to be responsive. */}
      <div className="relative h-20 w-full">
        <Line data={data} options={options} role="img" aria-label={summary} />
      </div>

      {/* Which line is which, when there is more than one. Solid and
          dashed rather than two colours, matching the datasets. */}
      {series.length > 1 ? (
        <ul className="type-caption mt-2 flex flex-wrap items-center gap-x-4 text-stone">
          {series.map((entry, index) => (
            <li key={entry.label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={
                  index === 0
                    ? "h-px w-3 bg-ink"
                    : "w-3 border-t border-dashed border-stone"
                }
              />
              {entry.label}
            </li>
          ))}
        </ul>
      ) : null}

      {/* A canvas is opaque to a screen reader, so the same readings
          are repeated as text for anyone who cannot hover. */}
      <ul className="sr-only">
        {labels.map((label, index) => (
          <li key={`${label}-${index}`}>
            {label}:{" "}
            {series
              .map((entry) => {
                const value = entry.values[index];

                return `${entry.label} ${
                  value === null || value === undefined
                    ? "not recorded"
                    : `${formatReading(value)} ${unit}`
                }`;
              })
              .join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
