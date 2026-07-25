import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Paras Arts" },
      { name: "description", content: "Reach the Paras Arts studio. Commissions, press, and collaborations." },
      { property: "og:title", content: "Contact — Paras Arts" },
      { property: "og:description", content: "Get in touch with the Paras Arts atelier." },
    ],
  }),
  component: ContactPage,
});

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/messages", Object.fromEntries(fd.entries()));
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Failed to send.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Talk to the Studio" title="We reply personally." description="For commissions, press, wholesale or collaboration enquiries, please write below." />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {[
            { i: Mail, k: "Email", v: "studio@parasarts.com" },
            { i: Phone, k: "Phone", v: "+91 98765 43210" },
            { i: Instagram, k: "Instagram", v: "@parasarts" },
            { i: MapPin, k: "Studio", v: "Jaipur, Rajasthan · India" },
          ].map((c) => (
            <div key={c.k} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                <c.i size={16} />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">{c.k}</div>
                <div className="mt-1 text-white/85">{c.v}</div>
              </div>
            </div>
          ))}

          <div className="overflow-hidden rounded-2xl gold-border">
            <div className="relative aspect-[16/10]">
              <div className="absolute inset-0 bg-[radial-gradient(400px_200px_at_30%_50%,rgba(201,138,43,0.25),transparent_60%)]" />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <MapPin size={28} className="mx-auto text-gold" />
                  <p className="mt-3 text-sm tracking-[0.3em] uppercase text-gold-light">Studio Location</p>
                  <p className="mt-2 text-muted-foreground">Google Maps placeholder</p>
                </div>
              </div>
              <div className="absolute inset-0 border border-white/5 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl gold-border p-8 md:p-10">
          {sent ? (
            <div className="py-16 text-center">
              <h3 className="font-display text-3xl">Message received.</h3>
              <p className="mt-3 text-muted-foreground">We'll reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Name</span>
                  <input required name="name" className={inputCls} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Email</span>
                  <input required name="email" type="email" className={inputCls} placeholder="you@example.com" />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Subject</span>
                <input name="subject" className={inputCls} placeholder="Commission enquiry" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Message</span>
                <textarea required name="message" rows={6} className={inputCls + " resize-none"} placeholder="Tell us more…" />
              </label>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button disabled={busy} type="submit" className="btn-gold w-full">{busy ? "Sending…" : "Send message"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
