import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { LANGS, useLang } from "@/lib/i18n";

/** Globe language selector — English / हिंदी / मराठी. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

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
        aria-label={`${t("nav.language")} — ${current.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border transition-[transform,border-color,box-shadow] duration-500 ease-out will-change-transform hover:-translate-y-0.5 hover:border-gold-light/60 hover:shadow-[0_10px_28px_-12px_rgba(201,138,43,0.75)] active:scale-95 ${
          open
            ? "border-gold-light/60 text-gold-light shadow-[0_10px_28px_-14px_rgba(201,138,43,0.8)]"
            : "border-white/10 text-white/75"
        }`}
      >
        {/* soft gold wash on hover / open */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(232,194,122,0.22),transparent_70%)] transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
        <Globe
          size={17}
          className={`relative transition-transform duration-700 ease-out group-hover:rotate-[22deg] group-hover:scale-110 group-hover:text-gold-light ${
            open ? "rotate-[22deg] scale-110" : ""
          }`}
        />
        {/* current language chip */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-0.5 right-0 rounded-full bg-[#121212] px-[3px] text-[7px] font-semibold leading-[10px] tracking-wide text-gold-light/90"
        >
          {current.short}
        </span>
      </button>

      <div
        role="menu"
        aria-label={t("nav.language")}
        className={`absolute right-0 top-12 z-50 w-44 origin-top-right overflow-hidden rounded-2xl border border-gold/25 bg-[#161616]/95 p-1.5 shadow-luxe backdrop-blur-xl transition-all duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="px-3 pb-1.5 pt-1 text-[9px] tracking-[0.32em] uppercase text-white/35">
          {t("nav.language")}
        </div>
        {LANGS.map((l, i) => (
          <button
            key={l.code}
            role="menuitemradio"
            aria-checked={lang === l.code}
            type="button"
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-300 ease-out ${
              open ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
            } ${
              lang === l.code
                ? "bg-gradient-to-r from-gold/20 to-transparent text-gold-light"
                : "text-white/75 hover:bg-white/[0.05] hover:text-gold-light"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  lang === l.code ? "bg-gold" : "bg-white/20"
                }`}
              />
              {l.label}
            </span>
            {lang === l.code && <Check size={14} className="animate-scale-in" />}
          </button>
        ))}
      </div>
    </div>
  );
}
