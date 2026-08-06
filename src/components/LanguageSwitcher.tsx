import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { LANGS, useLang } from "@/lib/i18n";

/** Globe language selector — English / हिंदी / मराठी. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("nav.language")}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`group grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light/60 hover:shadow-[0_6px_20px_-8px_rgba(201,138,43,0.7)] ${
          open ? "border-gold-light/60 text-gold-light" : "border-white/10 text-white/75"
        }`}
      >
        <Globe
          size={17}
          className="transition-transform duration-700 ease-out group-hover:rotate-[25deg] group-hover:scale-110 group-hover:text-gold-light"
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-2xl border border-gold/25 bg-[#161616]/95 p-1.5 shadow-luxe backdrop-blur-xl transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {LANGS.map((l) => (
          <button
            key={l.code}
            role="menuitemradio"
            aria-checked={lang === l.code}
            type="button"
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
              lang === l.code
                ? "bg-white/[0.06] text-gold-light"
                : "text-white/75 hover:bg-white/[0.04] hover:text-gold-light"
            }`}
          >
            {l.label}
            {lang === l.code && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}
