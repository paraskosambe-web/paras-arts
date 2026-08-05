import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  
  { to: "/testimonials", label: "Testimonials" },
  { to: "/track", label: "Track" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },

] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#121212]/85 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-6 2xl:gap-8">
        <Link to="/" className="min-w-0 xl:justify-self-end">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`group relative whitespace-nowrap text-[12px] font-medium tracking-[0.14em] uppercase transition-colors ${
                  active ? "text-gold-light" : "text-white/75 hover:text-gold-light"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-x-100 ${
                    active ? "scale-x-100" : ""
                  }`}
                  style={{ background: "linear-gradient(90deg, #e8c27a, #c98a2b)" }}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3 xl:justify-self-start">
          <div className="hidden md:block">
            <Link to="/order" className="btn-gold text-sm whitespace-nowrap">
              Order Sketch
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-gold-light xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#121212]/95 backdrop-blur-xl xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-white/5 py-4 text-sm tracking-[0.18em] uppercase text-white/80 hover:text-gold-light"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/order" className="btn-gold mt-6 w-full">
              Order Sketch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
