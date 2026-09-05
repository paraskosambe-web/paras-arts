
import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react";

import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";

import { api } from "@/lib/api";

import { SITE, mailtoUrl, whatsappUrl } from "@/lib/site";

import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Paras Arts" },
      {
        name: "description",
        content:
          "Reach the Paras Arts studio. Commissions, press, and collaborations.",
      },
      { property: "og:title", content: "Contact — Paras Arts" },
      {
        property: "og:description",
        content: "Get in touch with the Paras Arts atelier.",
      },
    ],
  }),
  component: ContactPage,
});

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50";

function ContactPage() {
  const { tr } = useLang();

  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  function validateForm(fd: FormData) {
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    const errors = {
      name: "",
      email: "",
      message: "",
    };

    if (!name) {
      errors.name = tr("Please enter your name.");
    }

    if (!email) {
      errors.email = tr("Please enter your email.");
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      errors.email = tr("Please enter a valid email address.");
    }

    if (!message) {
      errors.message = tr("Please enter your message.");
    }

    setFieldErrors(errors);

    return !errors.name && !errors.email && !errors.message;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const fd = new FormData(e.currentTarget);

    if (!validateForm(fd)) {
      return;
    }

    setBusy(true);

    try {
      await api.post("/messages", Object.fromEntries(fd.entries()));
      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err.message ?? tr("Failed to send.")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeader
        eyebrow={tr("Talk to the Studio")}
        title={tr("We reply personally.")}
        description={tr(
          "For commissions, press, wholesale or collaboration enquiries, please write below."
        )}
      />

      <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        <div className="space-y-4 sm:space-y-6">
          {[
            {
              i: Mail,
              k: "Email",
              v: SITE.email,
              href: mailtoUrl(),
              external: false,
            },
            {
              i: MessageCircle,
              k: "WhatsApp",
              v: SITE.phoneDisplay,
              href: whatsappUrl(),
              external: true,
            },
            {
              i: Phone,
              k: "Phone",
              v: SITE.phoneDisplay,
              href: `tel:+${SITE.whatsapp}`,
              external: false,
            },
            {
              i: Instagram,
              k: "Instagram",
              v: SITE.instagramHandle,
              href: SITE.instagram,
              external: true,
            },
            {
              i: MapPin,
              k: "Studio",
              v: tr("Mumbai, Maharashtra · India"),
              href: undefined,
              external: false,
            },
          ].map((c) => {
            const Inner = (
              <>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                  <c.i size={16} />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                    {tr(c.k)}
                  </div>

                  <div className="mt-1 break-words text-sm text-white/85 sm:text-base">
                    {c.v}
                  </div>
                </div>
              </>
            );

            const cls =
              "flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-gold-light/40 sm:p-6";

            return c.href ? (
              <a
                key={c.k}
                href={c.href}
                aria-label={`${tr(c.k)} — ${c.v}`}
                {...(c.external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className={cls}
              >
                {Inner}
              </a>
            ) : (
              <div key={c.k} className={cls}>
                {Inner}
              </div>
            );
          })}

          <div className="overflow-hidden rounded-2xl gold-border">
            <div className="relative aspect-[16/10]">
              <div className="absolute inset-0 bg-[radial-gradient(400px_200px_at_30%_50%,rgba(201,138,43,0.25),transparent_60%)]" />

              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <MapPin size={28} className="mx-auto text-gold" />

                  <p className="mt-3 text-sm tracking-[0.3em] uppercase text-gold-light">
                    {tr("Studio Location")}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {tr("Mumbai, Maharashtra, India")}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 border border-white/5 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl gold-border p-5 sm:p-8 md:p-10">
          {sent ? (
            <div className="py-16 text-center">
              <h3 className="font-display text-3xl">
                {tr("Message received.")}
              </h3>

              <p className="mt-3 text-muted-foreground">
                {tr("We'll reply within 24 hours.")}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
                    {tr("Name")}
                  </span>

                  <input
                    required
                    name="name"
                    className={`${inputCls} ${
                      fieldErrors.name
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    placeholder={tr("Your name")}
                    onChange={() =>
                      setFieldErrors((prev) => ({
                        ...prev,
                        name: "",
                      }))
                    }
                  />

                  {fieldErrors.name && (
                    <p className="mt-2 text-xs text-destructive">
                      {fieldErrors.name}
                    </p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
                    {tr("Email")}
                  </span>

                  <input
                    required
                    name="email"
                    type="email"
                    className={`${inputCls} ${
                      fieldErrors.email
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    placeholder="you@example.com"
                    onChange={() =>
                      setFieldErrors((prev) => ({
                        ...prev,
                        email: "",
                      }))
                    }
                  />

                  {fieldErrors.email && (
                    <p className="mt-2 text-xs text-destructive">
                      {fieldErrors.email}
                    </p>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
                  {tr("Subject")}
                </span>

                <input
                  name="subject"
                  className={inputCls}
                  placeholder={tr("Commission enquiry")}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
                  {tr("Message")}
                </span>

                <textarea
                  required
                  name="message"
                  rows={6}
                  className={
                    inputCls +
                    " resize-none" +
                    (fieldErrors.message
                      ? " border-destructive focus:border-destructive"
                      : "")
                  }
                  placeholder={tr("Tell us more…")}
                  onChange={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      message: "",
                    }))
                  }
                />

                {fieldErrors.message && (
                  <p className="mt-2 text-xs text-destructive">
                    {fieldErrors.message}
                  </p>
                )}
              </label>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <button
                disabled={busy}
                type="submit"
                className="btn-gold w-full"
              >
                {busy ? tr("Sending…") : tr("Send message")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}