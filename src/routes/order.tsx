
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

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isValidInternationalPhone(value: string) {
  const trimmed = value.trim();

  if (!/^\+?[0-9\s().-]+$/.test(trimmed)) {
    return false;
  }

  const digits = trimmed.replace(/\D/g, "");

  return digits.length >= 7 && digits.length <= 15;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isValidName(value: string) {
  const trimmed = value.trim();

  if (trimmed.length < 2 || trimmed.length > 80) {
    return false;
  }

  return /^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$/u.test(trimmed);
}

function isValidCountry(value: string) {
  return COUNTRIES.includes(value.trim() as (typeof COUNTRIES)[number]);
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
  error,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  span?: 1 | 2;
}) {
  return (
    <label className={`block ${span === 2 ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-xs text-destructive">
          {error}
        </span>
      )}
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
  const [orderId, setOrderId] = useState("");
  const [busy, setBusy] = useState(false);
  const [payOpened, setPayOpened] = useState(false);
  const [paidNoted, setPaidNoted] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm(fd: FormData) {
    const newErrors: Record<string, string> = {};

    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const whatsapp = String(fd.get("whatsapp") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const country = String(fd.get("country") ?? "").trim();
    const sketchType = String(fd.get("sketchType") ?? "").trim();
    const paperSize = String(fd.get("paperSize") ?? "").trim();
    const budget = String(fd.get("budget") ?? "").trim();
    const preferredDate = String(fd.get("preferredDate") ?? "").trim();
    const referenceImage = fd.get("referenceImage");

    if (!fullName) {
      newErrors.fullName = tr("Please enter your full name.");
    } else if (!isValidName(fullName)) {
      newErrors.fullName = tr("Please enter a valid full name.");
    }

    if (!email) {
      newErrors.email = tr("Please enter your email address.");
    } else if (!isValidEmail(email)) {
      newErrors.email = tr("Please enter a valid email address.");
    }

    if (!phone) {
      newErrors.phone = tr("Please enter your phone number.");
    } else if (!isValidInternationalPhone(phone)) {
      newErrors.phone = tr("Please enter a valid international phone number.");
    }

    if (!whatsapp) {
      newErrors.whatsapp = tr("Please enter your WhatsApp number.");
    } else if (!isValidInternationalPhone(whatsapp)) {
      newErrors.whatsapp = tr(
        "Please enter a valid international WhatsApp number."
      );
    }

    if (!address) {
      newErrors.address = tr("Please enter your delivery address.");
    } else if (address.length < 5) {
      newErrors.address = tr("Please enter a complete delivery address.");
    }

    if (!country) {
      newErrors.country = tr("Please select your country.");
    } else if (!isValidCountry(country)) {
      newErrors.country = tr("Please select a valid country.");
    }

    if (!SKETCH_TYPES.includes(sketchType as (typeof SKETCH_TYPES)[number])) {
      newErrors.sketchType = tr("Please select a valid sketch type.");
    }

    if (!PAPER_SIZES.includes(paperSize as (typeof PAPER_SIZES)[number])) {
      newErrors.paperSize = tr("Please select a valid paper size.");
    }

    if (!budget) {
      newErrors.budget = tr("Please enter your budget.");
    } else {
      const budgetNumber = Number(budget);

      if (!Number.isFinite(budgetNumber) || budgetNumber <= 0) {
        newErrors.budget = tr("Please enter a valid positive budget.");
      }
    }

    if (!preferredDate) {
      newErrors.preferredDate = tr(
        "Please select your preferred delivery date."
      );
    } else if (preferredDate < getTodayString()) {
      newErrors.preferredDate = tr(
        "Please select today or a future delivery date."
      );
    }

    if (!(referenceImage instanceof File) || referenceImage.size === 0) {
      newErrors.referenceImage = tr("Please upload a reference image.");
    } else if (!referenceImage.type.startsWith("image/")) {
      newErrors.referenceImage = tr("Please upload a valid image file.");
    } else if (referenceImage.size > 10 * 1024 * 1024) {
      newErrors.referenceImage = tr(
        "Reference image must be smaller than 10 MB."
      );
    }

    return newErrors;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const validationErrors = validateForm(fd);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const response = await api.post("/orders", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOrderId(response.data.orderId);
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

  async function handlePaid() {
    if (!orderId || paymentBusy) return;

    setPaymentBusy(true);
    setError("");

    try {
      await api.patch(`/orders/${orderId}/payment`, {
        orderId,
      });

      setPaidNoted(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err.message ??
          tr("Unable to update payment status. Please try again.")
      );
    } finally {
      setPaymentBusy(false);
    }
  }

  function handlePayNow(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (isDesktop) {
      setShowScanner(true);
      setPayOpened(true);
      return;
    }

    setPayOpened(true);
    window.location.href = upiPayUrl();
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

        <div className="mt-6 rounded-2xl border border-gold-light/30 bg-white/[0.03] p-5">
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
            {tr("Your Order ID")}
          </div>

          <div className="mt-2 break-all font-mono text-xl font-semibold tracking-wider text-gold-gradient sm:text-2xl">
            {orderId}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {tr(
              "Save this Order ID. You will need it to track your sketch order."
            )}
          </p>
        </div>

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

          <a
            href={upiPayUrl()}
            onClick={handlePayNow}
            className="btn-gold mt-8 w-full justify-center"
          >
            {tr("Pay ₹200 Now")}
          </a>

          {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="relative w-full max-w-md rounded-3xl bg-[#121212] p-6 text-center gold-border">
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
                onClick={handlePaid}
                disabled={paymentBusy}
                className="btn-ghost-gold mt-4 w-full justify-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentBusy ? tr("Updating…") : tr("I've Paid")}
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

        {error && (
          <p className="mt-6 text-xs text-destructive">
            {error}
          </p>
        )}

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
        noValidate
        className="mt-10 rounded-3xl gold-border p-5 sm:p-8 lg:mt-16 md:p-12"
      >
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">

          <Field
            label={tr("Full name")}
            error={errors.fullName}
          >
            <input
              name="fullName"
              className={`${inputCls} ${
                errors.fullName ? "border-destructive/70" : ""
              }`}
              placeholder={tr("Your name")}
              minLength={2}
              maxLength={80}
            />
          </Field>

          <Field
            label={tr("Email")}
            error={errors.email}
          >
            <input
              name="email"
              type="email"
              className={`${inputCls} ${
                errors.email ? "border-destructive/70" : ""
              }`}
              placeholder="you@example.com"
            />
          </Field>

          <Field
            label={tr("Phone")}
            error={errors.phone}
          >
            <input
              name="phone"
              type="tel"
              className={`${inputCls} ${
                errors.phone ? "border-destructive/70" : ""
              }`}
              placeholder="+Country code …"
              maxLength={25}
            />
          </Field>

          <Field
            label={tr("WhatsApp")}
            error={errors.whatsapp}
          >
            <input
              name="whatsapp"
              type="tel"
              className={`${inputCls} ${
                errors.whatsapp ? "border-destructive/70" : ""
              }`}
              placeholder="+Country code …"
              maxLength={25}
            />
          </Field>

          <Field
            label={tr("Address")}
            span={2}
            error={errors.address}
          >
            <input
              name="address"
              className={`${inputCls} ${
                errors.address ? "border-destructive/70" : ""
              }`}
              placeholder={tr("Delivery address")}
              minLength={5}
              maxLength={300}
            />
          </Field>

          <Field
            label={tr("Country")}
            error={errors.country}
          >
            <select
              name="country"
              className={`${inputCls} ${
                errors.country ? "border-destructive/70" : ""
              }`}
              defaultValue=""
            >
              <option
                value=""
                disabled
                className="bg-[#121212] text-white"
              >
                {tr("Select your country")}
              </option>

              {COUNTRIES.map((country) => (
                <option
                  key={country}
                  value={country}
                  className="bg-[#121212] text-white"
                >
                  {country}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={tr("Sketch type")}
            error={errors.sketchType}
          >
            <select
              name="sketchType"
              defaultValue={presetService}
              className={`${inputCls} ${
                errors.sketchType ? "border-destructive/70" : ""
              }`}
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

          <Field
            label={tr("Paper size")}
            error={errors.paperSize}
          >
            <select
              name="paperSize"
              defaultValue={presetSize}
              className={`${inputCls} ${
                errors.paperSize ? "border-destructive/70" : ""
              }`}
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

          <Field
            label={tr("Budget (INR)")}
            error={errors.budget}
          >
            <input
              name="budget"
              type="number"
              min="1"
              step="1"
              className={`${inputCls} ${
                errors.budget ? "border-destructive/70" : ""
              }`}
              placeholder="e.g. 8000"
            />
          </Field>

          <Field
            label={tr("Preferred delivery date")}
            error={errors.preferredDate}
          >
            <input
              name="preferredDate"
              type="date"
              min={getTodayString()}
              className={`${inputCls} ${
                errors.preferredDate ? "border-destructive/70" : ""
              }`}
            />
          </Field>

          <Field
            label={tr("Reference image")}
            span={2}
            error={errors.referenceImage}
          >
            <div
              className={`flex flex-col gap-4 rounded-xl border border-dashed ${
                errors.referenceImage
                  ? "border-destructive/70"
                  : "border-white/15"
              } bg-white/[0.02] px-4 py-5 sm:flex-row sm:items-center sm:px-5 sm:py-6`}
            >
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

          <Field
            label={tr("Additional notes")}
            span={2}
          >
            <textarea
              name="notes"
              rows={5}
              maxLength={1000}
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