import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, ArrowUp } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, mailtoUrl, whatsappUrl } from "@/lib/site";

const explore = [
  ["/portfolio", "Portfolio"],
  ["/services", "Services"],
  ["/pricing", "Pricing"],
  ["/order", "Order a Sketch"],
  ["/track", "Track Order"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
] as const;

const socials = [
  { icon: Instagram, label: "Instagram", value: SITE.instagramHandle, href: SITE.instagram },
  { icon: MessageCircle, label: "WhatsApp", value: SITE.phoneDisplay, href: whatsappUrl() },
  { icon: Mail, label: "Email", value: SITE.email, href: mailtoUrl() },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An atelier of hyper-realistic pencil art by {SITE.artist}. Commissioned portraits,
              heirlooms and collector pieces — hand-drawn with obsessive detail.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${s.label} — ${SITE.name}`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-gold-light transition-colors hover:border-gold-light hover:bg-white/[0.04]"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">Explore</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {explore.map(([to, label]) => (
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
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-3 break-all transition-colors hover:text-gold-light"
                  >
                    <s.icon size={14} className="shrink-0 text-gold" /> {s.value}
                  </a>
                </li>
              ))}
              <li className="pt-1 text-xs">{SITE.location}</li>
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
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                maxLength={255}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="bg-gold-gradient px-5 text-sm font-medium text-[#121212]">
                Join
              </button>
            </form>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer noopener" className="btn-ghost-gold mt-5 text-sm">
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-start justify-between gap-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved. · {SITE.tagline}
          </p>
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
