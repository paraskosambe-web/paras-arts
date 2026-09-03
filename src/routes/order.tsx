import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Upload } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { api } from "@/lib/api";
import { SITE, upiPayUrl } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import gpayScanner from "@/assets/gpay_scanner.jpeg";

const SKETCH_TYPES = [
  "Custom Portrait",
  "Couple Portrait",
  "Family Portrait",
  "Pet Portrait",
  "Car / Motorsports Sketch",
  "Other",
] as const;

const PAPER_SIZES = [
  "A4 · 210×297 mm",
  "A3 · 297×420 mm",
  "A2 · 420×594 mm",
  "Custom",
] as const;

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const Route = createFileRoute("/order")({
  validateSearch: (search: Record<string, unknown>): {
    service?: string;
    size?: string;
  } => ({
    ...(typeof search.service === "string" ? { service: search.service } : {}),
    ...(typeof search.size === "string" ? { size: search.size } : {}),
  }),

  head: () => ({
    meta: [
      { title: "Order a Sketch — Paras Arts" },
      {
        name: "description",
        content:
          "Commission a handcrafted pencil portrait from Paras Arts. Share your details and reference.",
      },
      {
        property: "og:title",
        content: "Order a Sketch — Paras Arts",
      },
      {
        property: "og:description",
        content: "Begin your commission with Paras Arts.",
      },
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
  const { tr } = useLang();
  const { service, size } = Route.useSearch();

  const presetService =
    SKETCH_TYPES.find(
      (t) => t.toLowerCase() === (service ?? "").toLowerCase()
    ) ?? SKETCH_TYPES[0];

  const presetSize =
    PAPER_SIZES.find((p) =>
      p.startsWith((size ?? "").toUpperCase())
    ) ?? PAPER_SIZES[0];

  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payOpened, setPayOpened] = useState(false);
  const [paidNoted, setPaidNoted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
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
      setError(
        err?.response?.data?.message ??
          err.message ??
          tr("Failed to submit — please try again.")
      );
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
          {tr("Order Details Submitted Successfully!")}
        </h1>

        <p className="mt-4 text-muted-foreground">
          {tr(
            "To confirm your sketch order, please pay ₹200 as an advance fee."
          )}
        </p>

        <div className="mt-10 rounded-3xl gold-border p-6 text-left sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                {tr("Advance Amount")}
              </div>

              <div className="mt-1 font-display text-3xl text-gold-gradient">
                ₹200
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                {tr("UPI ID")}
              </div>

              <div className="mt-1 text-sm text-white/85">
                {SITE.upiId}
              </div>
            </div>
          </div>

          {/* PAY NOW BUTTON */}
          <a
            href={upiPayUrl()}
            onClick={(e) => {
              // Laptop/Desktop: show QR scanner
              // Mobile: keep the existing GPay/UPI behavior
              if (window.innerWidth >= 768) {
                e.preventDefault();
                setShowScanner(true);
                setPayOpened(true);
              }
            }}
            className="btn-gold mt-8 w-full justify-center"
          >
            {tr("Pay ₹200 Now")}
          </a>

          {/* LAPTOP QR SCANNER POPUP */}
          {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="relative w-full max-w-md rounded-3xl bg-[#121212] p-6 text-center gold-border">

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowScanner(false)}
                  className="absolute right-4 top-4 text-2xl text-white/70 transition-colors hover:text-white"
                  aria-label="Close scanner"
                >
                  ×
                </button>

                <h2 className="font-display text-2xl text-white">
                  {tr("Scan & Pay ₹200")}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {tr("Scan the QR code using any UPI app")}
                </p>

                {/* QR IMAGE */}
                <div className="mt-6 flex justify-center rounded-2xl bg-white p-4">
                  <img
                    src={gpayScanner}
                    alt="UPI payment QR code"
                    className="h-auto w-full max-w-[300px] object-contain"
                  />
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {tr("After payment, click I've Paid below.")}
                </p>

                {/* CLOSE SCANNER */}
                <button
                  type="button"
                  onClick={() => setShowScanner(false)}
                  className="btn-ghost-gold mt-5 w-full justify-center"
                >
                  {tr("Close")}
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            {tr(
              "Opens Google Pay, PhonePe, Paytm or any UPI app on your device. Note: Paras Arts Sketch Order Advance."
            )}
          </p>

          {payOpened && !paidNoted && (
            <div className="mt-6 rounded-2xl border border-gold-light/30 bg-white/[0.03] p-5">
              <p className="text-sm text-white/85">
                {tr(
                  "Please complete the ₹200 advance payment in your UPI app."
                )}
              </p>

              <button
                type="button"
                onClick={() => setPaidNoted(true)}
                className="btn-ghost-gold mt-4 w-full justify-center sm:w-auto"
              >
                {tr("I've Paid")}
              </button>
            </div>
          )}

          {paidNoted && (
            <div className="mt-6 rounded-2xl border border-gold-light/30 bg-white/[0.03] p-5 text-sm text-white/85">
              {tr(
                "Thank you — the studio will verify your ₹200 advance and confirm your commission by email or WhatsApp within 24 hours."
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {tr("Trouble paying? Message us on WhatsApp at")}{" "}
          {SITE.phoneDisplay}{" "}
          {tr("and we'll help.")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeader
        eyebrow={tr("Begin Your Commission")}
        title={tr("Order a sketch")}
        description={tr(
          "Share your details. Every enquiry is reviewed personally by the studio."
        )}
      />

      <form
        onSubmit={onSubmit}
        className="mt-10 rounded-3xl gold-border p-5 sm:p-8 lg:mt-16 md:p-12"
      >
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">

          <Field label={tr("Full name")}>
            <input
              required
              name="fullName"
              className={inputCls}
              placeholder={tr("Your name")}
            />
          </Field>

          <Field label={tr("Email")}>
            <input
              required
              name="email"
              type="email"
              className={inputCls}
              placeholder="you@example.com"
            />
          </Field>

          <Field label={tr("Phone")}>
            <input
              name="phone"
              className={inputCls}
              placeholder="+91 …"
            />
          </Field>

          <Field label={tr("WhatsApp")}>
            <input
              name="whatsapp"
              className={inputCls}
              placeholder="+91 …"
            />
          </Field>

          <Field label={tr("Address")} span={2}>
            <input
              name="address"
              className={inputCls}
              placeholder={tr("Delivery address")}
            />
          </Field>

          <Field label={tr("Country")}>
            <input
              name="country"
              className={inputCls}
              placeholder="India"
            />
          </Field>

          <Field label={tr("Sketch type")}>
            <select
              name="sketchType"
              defaultValue={presetService}
              className={inputCls}
            >
              {SKETCH_TYPES.map((o) => (
                <option
                  key={o}
                  value={o}
                  className="bg-[#121212] text-white"
                >
                  {tr(o)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={tr("Paper size")}>
            <select
              name="paperSize"
              defaultValue={presetSize}
              className={inputCls}
            >
              {PAPER_SIZES.map((o) => (
                <option
                  key={o}
                  value={o}
                  className="bg-[#121212] text-white"
                >
                  {o}
                </option>
              ))}
            </select>
          </Field>

          <Field label={tr("Budget (INR)")}>
            <input
              name="budget"
              type="number"
              className={inputCls}
              placeholder="e.g. 8000"
            />
          </Field>

          <Field label={tr("Preferred delivery date")}>
            <input
              name="preferredDate"
              type="date"
              min={getTodayString()}
              className={inputCls}
            />
          </Field>

          <Field label={tr("Reference image")} span={2}>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 sm:flex-row sm:items-center sm:px-5 sm:py-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                <Upload size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <input
                  name="referenceImage"
                  type="file"
                  accept="image/*"
                  className="block w-full max-w-full text-xs text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-gold-gradient file:px-3 file:py-2 file:text-[#121212] file:text-[10px] file:tracking-[0.2em] file:uppercase sm:text-sm sm:file:px-4 sm:file:text-xs"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  {tr("High-resolution, well-lit photograph works best.")}
                </p>
              </div>
            </div>
          </Field>

          <Field label={tr("Additional notes")} span={2}>
            <textarea
              name="notes"
              rows={5}
              className={inputCls + " resize-none"}
              placeholder={tr(
                "Tell us about the piece, the occasion, the feeling you'd like to preserve…"
              )}
            />
          </Field>
        </div>

        {error && (
          <p className="mt-6 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {tr("By submitting, you agree to be contacted by the studio.")}
          </p>

          <button
            disabled={busy}
            type="submit"
            className="btn-gold w-full justify-center sm:w-auto"
          >
            {busy ? tr("Submitting…") : tr("Submit enquiry")}
          </button>
        </div>
      </form>
    </div>
  );
}