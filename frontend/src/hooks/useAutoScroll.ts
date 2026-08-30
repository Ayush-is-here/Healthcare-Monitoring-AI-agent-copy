import { useEffect, useRef } from "react";

/**
 * Keeps a scroll container pinned to the bottom as content arrives,
 * unless the reader has scrolled up to look at something.
 */
export function useAutoScroll<T>(dependency: T, threshold = 120) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      pinnedRef.current = distanceFromBottom <= threshold;
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pinnedRef.current) return;

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [dependency]);

  return containerRef;
}
