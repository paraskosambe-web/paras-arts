import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "@/lib/i18n";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/services", key: "nav.services" },
  { to: "/testimonials", key: "nav.testimonials" },
  { to: "/track", key: "nav.track" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-[#121212]/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden items-center gap-5 xl:flex xl:pl-6 2xl:gap-7">
          {links.map((l) => {
            const active =
              pathname === l.to ||
              (l.to !== "/" && pathname.startsWith(l.to));

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`group relative whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "text-gold-light"
                    : "text-white/75 hover:text-gold-light"
                }`}
              >
                {t(l.key)}

                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
                    active ? "scale-x-100" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, #e8c27a, #c98a2b)",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right-side controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          {/* Desktop Order button */}
          <div className="hidden md:block">
            <Link
              to="/order"
              search={{}}
              className="btn-gold whitespace-nowrap text-sm"
            >
              {t("nav.order")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-gold-light transition-colors hover:border-gold-light/50 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-[#121212]/95 backdrop-blur-xl xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-5 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-white/5 py-4 text-sm uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-gold-light"
              >
                {t(l.key)}
              </Link>
            ))}

            <Link
              to="/order"
              search={{}}
              className="btn-gold mt-6 w-full"
            >
              {t("nav.order")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}