import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { api } from "@/lib/api";
import { SITE, upiPayUrl } from "@/lib/site";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order a Sketch — Paras Arts" },
      { name: "description", content: "Commission a handcrafted pencil portrait from Paras Arts. Share your details and reference." },
      { property: "og:title", content: "Order a Sketch — Paras Arts" },
      { property: "og:description", content: "Begin your commission with Paras Arts." },
    ],
  }),
  component: OrderPage,
});

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <label className={`block ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-gold-light/50 transition-colors";

function OrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payOpened, setPayOpened] = useState(false);
  const [paidNoted, setPaidNoted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api.post("/orders", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Failed to submit — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-32">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-gradient text-[#121212]">
          <Check size={32} />
        </div>
        <h1 className="mt-8 font-display text-3xl sm:text-4xl">
          Order Details Submitted Successfully!
        </h1>
        <p className="mt-4 text-muted-foreground">
          To confirm your sketch order, please pay ₹200 as an advance fee.
        </p>

        <div className="mt-10 rounded-3xl gold-border p-6 text-left sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                Advance Amount
              </div>
              <div className="mt-1 font-display text-3xl text-gold-gradient">₹200</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">UPI ID</div>
              <div className="mt-1 text-sm text-white/85">{SITE.upiId}</div>
            </div>
          </div>

          <a
            href={upiPayUrl()}
            onClick={() => setPayOpened(true)}
            className="btn-gold mt-8 w-full justify-center"
          >
            Pay ₹200 Now
          </a>

          <p className="mt-4 text-xs text-muted-foreground">
            Opens Google Pay, PhonePe, Paytm or any UPI app on your device. Note: Paras Arts Sketch
            Order Advance.
          </p>

          {payOpened && !paidNoted && (
            <div className="mt-6 rounded-2xl border border-gold-light/30 bg-white/[0.03] p-5">
              <p className="text-sm text-white/85">
                Please complete the ₹200 advance payment in your UPI app.
              </p>
              <button
                type="button"
                onClick={() => setPaidNoted(true)}
                className="btn-ghost-gold mt-4 w-full justify-center sm:w-auto"
              >
                I've Paid
              </button>
            </div>
          )}

          {paidNoted && (
            <div className="mt-6 rounded-2xl border border-gold-light/30 bg-white/[0.03] p-5 text-sm text-white/85">
              Thank you — the studio will verify your ₹200 advance and confirm your commission by
              email or WhatsApp within 24 hours.
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Trouble paying? Message us on WhatsApp at {SITE.phoneDisplay} and we'll help.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeader
        eyebrow="Begin Your Commission"
        title="Order a sketch"
        description="Share your details. Every enquiry is reviewed personally by the studio."
      />

      <form onSubmit={onSubmit} className="mt-10 rounded-3xl gold-border p-5 sm:p-8 lg:mt-16 md:p-12">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          <Field label="Full name"><input required name="fullName" className={inputCls} placeholder="Your name" /></Field>
          <Field label="Email"><input required name="email" type="email" className={inputCls} placeholder="you@example.com" /></Field>
          <Field label="Phone"><input name="phone" className={inputCls} placeholder="+91 …" /></Field>
          <Field label="WhatsApp"><input name="whatsapp" className={inputCls} placeholder="+91 …" /></Field>
          <Field label="Address" span={2}><input name="address" className={inputCls} placeholder="Delivery address" /></Field>
          <Field label="Country"><input name="country" className={inputCls} placeholder="India" /></Field>
          <Field label="Sketch type">
            <select name="sketchType" className={inputCls}>
              {["Custom Portrait", "Couple Portrait", "Family Portrait", "Pet Portrait", "Car / Motorcycle", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Paper size">
            <select name="paperSize" className={inputCls}>
              {["A4 · 210×297 mm", "A3 · 297×420 mm", "A2 · 420×594 mm", "Custom"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Budget (INR)"><input name="budget" type="number" className={inputCls} placeholder="e.g. 8000" /></Field>
          <Field label="Preferred delivery date"><input name="preferredDate" type="date" className={inputCls} /></Field>
          <Field label="Reference image" span={2}>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 sm:flex-row sm:items-center sm:px-5 sm:py-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                <Upload size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <input name="referenceImage" type="file" accept="image/*" className="block w-full max-w-full text-xs text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-gold-gradient file:px-3 file:py-2 file:text-[#121212] file:text-[10px] file:tracking-[0.2em] file:uppercase sm:text-sm sm:file:px-4 sm:file:text-xs" />
                <p className="mt-2 text-xs text-muted-foreground">High-resolution, well-lit photograph works best.</p>
              </div>
            </div>
          </Field>
          <Field label="Additional notes" span={2}>
            <textarea name="notes" rows={5} className={inputCls + " resize-none"} placeholder="Tell us about the piece, the occasion, the feeling you'd like to preserve…" />
          </Field>
        </div>

        {error && <p className="mt-6 text-xs text-destructive">{error}</p>}

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted by the studio.</p>
          <button disabled={busy} type="submit" className="btn-gold w-full justify-center sm:w-auto">{busy ? "Submitting…" : "Submit enquiry"}</button>
        </div>
      </form>
    </div>
  );
}
