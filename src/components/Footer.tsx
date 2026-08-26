import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Instagram, Mail, MessageCircle, ArrowUp, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, mailtoUrl, whatsappUrl } from "@/lib/site";
import { api } from "@/lib/api";
import { useLang } from "@/lib/i18n";

/** Newsletter sign-up. Confirms locally — no backend or database is involved. */
function NewsletterForm() {
  const { tr } = useLang();

  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || busy) return;

    setBusy(true);
    setError("");

    try {
      await api.post("/newsletter", {
        email: email.trim(),
      });

      setJoined(true);
      setEmail("");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("This email is already subscribed.");
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  if (joined) {
    return (
      <div className="mt-5 flex w-full max-w-sm items-center gap-3 rounded-full border border-gold-light/40 bg-white/[0.04] px-5 py-3 text-sm text-gold-light">
        <Check size={16} className="shrink-0" />

        <span className="min-w-0 truncate">
          {tr("You're on the list — thank you.")}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex w-full items-stretch overflow-hidden rounded-full border border-white/10 bg-white/[0.03] focus-within:border-gold-light/60"
      >
        <label
          className="sr-only"
          htmlFor="newsletter-email"
        >
          {tr("Email address")}
        </label>

        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-white/55"
        />

        <button
          type="submit"
          disabled={busy}
          className="shrink-0 whitespace-nowrap rounded-full bg-gold-gradient px-6 text-sm font-medium text-[#121212] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Joining…" : tr("Join")}
        </button>
      </form>

      {error && (
        <p className="mt-2 px-4 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

const explore = [
  ["/portfolio", "Portfolio"],
  ["/services", "Services"],
  ["/order", "Order a Sketch"],
  ["/track", "Track Order"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
] as const;

const socials = [
  { icon: Instagram, label: "Instagram", value: SITE.instagramHandle, href: SITE.instagram, external: true },
  { icon: MessageCircle, label: "WhatsApp", value: SITE.phoneDisplay, href: whatsappUrl(), external: true },
  { icon: Mail, label: "Email", value: SITE.email, href: mailtoUrl(), external: false },
];

export function Footer() {
  const { tr } = useLang();

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">{tr("Studio")}</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    aria-label={`${tr(s.label)} — ${s.value}`}
                    className="group flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light/50 hover:bg-white/[0.05] hover:text-gold-light"
                  >

                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-gold transition-colors group-hover:border-gold-light group-hover:text-gold-light">
                      <s.icon size={14} />
                    </span>
                    <span className="min-w-0 truncate">{s.value}</span>
                    <ArrowRight
                      size={13}
                      className="ml-auto shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="group flex items-center gap-3 rounded-full border border-gold-light/25 px-4 py-3 text-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light hover:bg-white/[0.05]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-light/30">
                    <ArrowRight size={14} />
                  </span>
                  {tr("Contact the studio")}
                </Link>
              </li>
              <li className="pt-2 text-xs">{tr(SITE.location)}</li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">{tr("Explore")}</h4>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {explore.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-gold-light">
                    {tr(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light">{tr("Newsletter")}</h4>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {tr("Private previews of new commissions, straight to your inbox.")}
            </p>
            <NewsletterForm />
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost-gold mt-5 text-sm"
            >
              <MessageCircle size={14} /> {tr("Chat on WhatsApp")}
            </a>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-md">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {tr("Hyper-realistic pencil art by Paras Kosambe — commissioned portraits and heirlooms, hand-drawn with obsessive detail.")}
            </p>
            <p className="mt-4 text-xs text-muted-foreground/80">
              © {new Date().getFullYear()} {SITE.name}. {tr("All rights reserved.")}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to="/admin-login"
              className="text-[11px] tracking-wide text-muted-foreground/60 transition-colors hover:text-gold-light"
            >
              {tr("Admin")}
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light hover:text-gold-light"
            >
              {tr("Back to top")}{" "}
              <ArrowUp size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
