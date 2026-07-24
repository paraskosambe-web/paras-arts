import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

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

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-gradient text-[#121212]">
          <Check size={32} />
        </div>
        <h1 className="mt-8 font-display text-4xl">Your enquiry is with the studio.</h1>
        <p className="mt-4 text-muted-foreground">
          We reply personally to every request within 24 hours. Meanwhile, please keep your reference photograph ready — we'll ask for it in the follow-up.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="Begin Your Commission"
        title="Order a sketch"
        description="Share your details. Every enquiry is reviewed personally by the studio."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-16 rounded-3xl gold-border p-8 md:p-12"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Full name"><input required className={inputCls} placeholder="Your name" /></Field>
          <Field label="Email"><input required type="email" className={inputCls} placeholder="you@example.com" /></Field>
          <Field label="Phone"><input className={inputCls} placeholder="+91 …" /></Field>
          <Field label="WhatsApp"><input className={inputCls} placeholder="+91 …" /></Field>
          <Field label="Address" span={2}><input className={inputCls} placeholder="Delivery address" /></Field>
          <Field label="Country"><input className={inputCls} placeholder="India" /></Field>
          <Field label="Sketch type">
            <select className={inputCls}>
              {["Custom Portrait", "Couple Portrait", "Family Portrait", "Pet Portrait", "Car / Motorcycle", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Paper size">
            <select className={inputCls}>
              {["A4 · 210×297 mm", "A3 · 297×420 mm", "A2 · 420×594 mm", "Custom"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Budget (INR)"><input className={inputCls} placeholder="e.g. 8000" /></Field>
          <Field label="Preferred delivery date"><input type="date" className={inputCls} /></Field>
          <Field label="Reference image" span={2}>
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                <Upload size={16} />
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" className="block text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-gold-gradient file:px-4 file:py-2 file:text-[#121212] file:text-xs file:tracking-[0.2em] file:uppercase" />
                <p className="mt-2 text-xs text-muted-foreground">High-resolution, well-lit photograph works best.</p>
              </div>
            </div>
          </Field>
          <Field label="Additional notes" span={2}>
            <textarea rows={5} className={inputCls + " resize-none"} placeholder="Tell us about the piece, the occasion, the feeling you'd like to preserve…" />
          </Field>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted by the studio.</p>
          <button type="submit" className="btn-gold">Submit enquiry</button>
        </div>
      </form>
    </div>
  );
}
