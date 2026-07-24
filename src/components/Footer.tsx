import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone, ArrowUp } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An atelier of hyper-realistic pencil art. Commissioned portraits, heirlooms and
              collector pieces — hand-drawn with obsessive detail.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">Explore</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                ["/portfolio", "Portfolio"],
                ["/services", "Services"],
                ["/pricing", "Pricing"],
                ["/order", "Order a Sketch"],
                ["/faq", "FAQ"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-gold-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">Studio</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gold" /> studio@parasarts.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-gold" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <Instagram size={14} className="text-gold" /> @parasarts
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">Newsletter</h4>
            <p className="mt-6 text-sm text-muted-foreground">
              Private previews of new commissions, straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex overflow-hidden rounded-full border border-white/10 bg-white/[0.02]"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="bg-gold-gradient px-5 text-sm font-medium text-[#121212]">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-start justify-between gap-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Paras Arts. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin-login" className="hover:text-gold-light">
              Admin
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 hover:border-gold-light hover:text-gold-light"
            >
              Back to top <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
