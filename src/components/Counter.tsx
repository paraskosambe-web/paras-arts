import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

/** Counts up to `to` when scrolled into view. */
export function Counter({ to, suffix = "", prefix = "", duration = 1600, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && run(),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
