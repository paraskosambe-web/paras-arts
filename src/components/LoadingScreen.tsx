import { useEffect, useState } from "react";
import logoMark from "@/assets/logo-mark.png.asset.json";

/** Brand loading veil shown briefly on first paint. */
export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-[#0e0e0e] transition-opacity duration-700 ${
        done ? "opacity-0" : "opacity-100"
      }`}
      style={{ visibility: done ? "hidden" : "visible" }}
    >
      <div className="flex flex-col items-center gap-6">
        <img src={logoMark.url} alt="" className="h-16 w-16 animate-pulse object-contain" />
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <div
            className="h-full w-1/2 animate-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent, #e8c27a, transparent)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        <div className="text-[10px] tracking-[0.5em] uppercase text-gold-light/70">Paras Arts</div>
      </div>
    </div>
  );
}
