/**
 * Date and time helpers shared across features.
 *
 * These lived in `features/medications/medicationFormSchema.ts` until
 * appointments needed the same six. No feature folder imports from
 * another, and `src/lib/` is where the cross-feature infrastructure
 * already sits, so they moved here rather than being reached across a
 * feature boundary or copied.
 *
 * Every value the API stores is naive: a `Date` column, a `Time` column,
 * or a timestamp with no offset. Nothing here converts a zone — the
 * strings are read and written verbatim, and a `Date` is constructed
 * only to hand `Intl` something to format.
 */

/** `YYYY-MM-DD`, the shape both a `date` input and the API use. */
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** `HH:MM` or `HH:MM:SS` — a `time` input yields either. */
export const CLOCK_TIME = /^\d{2}:\d{2}(:\d{2})?$/;

/** A Date as a `date` input value, in local time. */
export function toDateInputValue(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * A stored `YYYY-MM-DD` as a Date at local midnight.
 *
 * Deliberately not `new Date(value)`: a date-only string is parsed as
 * **UTC** midnight per spec, so west of Greenwich it renders as the day
 * before. A date-*time* string without an offset is parsed as local
 * instead, which is why `parseRecordedAt` can get away with the direct
 * constructor and this cannot.
 */
export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatIsoDate(value: string): string {
  return dateFormatter.format(parseIsoDate(value));
}

/* Dates are compared as strings. Any two zero-padded `YYYY-MM-DD`
   values sort correctly lexicographically, which sidesteps the
   UTC-midnight trap above entirely — no Date is constructed at all. */
export function isOnOrAfter(later: string, earlier: string): boolean {
  return later >= earlier;
}

/**
 * A `time` input's value padded to whole seconds.
 *
 * `process_due_reminders` matches on
 * `datetime.now().time().replace(second=0, microsecond=0)`, so a
 * reminder stored with non-zero seconds would never fire. Browsers
 * normally yield `HH:MM` but can yield `HH:MM:SS` when `step` is
 * sub-minute, hence the length guard rather than an unconditional pad.
 * Appointment times take the same treatment for consistency with the
 * `HH:MM:SS` the column holds.
 */
export function toWholeMinuteTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

/** A stored `HH:MM:SS` as a readable time. The seconds never show. */
export function formatClockTime(value: string): string {
  const [hour, minute] = value.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  /* The date is arbitrary — only the clock face is being formatted. */
  return timeFormatter.format(new Date(1970, 0, 1, hour, minute));
}
