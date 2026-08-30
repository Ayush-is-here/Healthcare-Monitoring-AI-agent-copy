import { useEffect, useState } from "react";

/**
 * Seconds elapsed since `active` became true.
 *
 * The insight endpoint does not stream, so the wait cannot be
 * reported as real progress. An honest elapsed count is shown
 * instead of a fabricated progress bar.
 */
export function useElapsedSeconds(active: boolean): number {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active]);

  return seconds;
}
