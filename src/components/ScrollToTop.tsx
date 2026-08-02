import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating "back to top" control, appears after the first viewport of scroll. */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-[#1a1a1a]/90 text-gold-light backdrop-blur transition-all duration-500 hover:border-gold-light hover:text-gold ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
