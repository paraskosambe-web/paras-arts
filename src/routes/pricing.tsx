import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Paras Arts" },
      { name: "description", content: "Transparent commission pricing for Paras Arts pencil portraits." },
      { property: "og:title", content: "Pricing — Paras Arts" },
      { property: "og:description", content: "Commission pricing for handcrafted pencil portraits." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Signature",
    tagline: "One subject · A4",
    price: "₹4,800",
    features: [
      "Single subject portrait",
      "A4 archival paper (210×297 mm)",
      "Head & shoulders composition",
      "3–5 week delivery",
      "One round of revision",
      "Digital high-res proof",
    ],
  },
  {
    name: "Atelier",
    tagline: "Two subjects · A3",
    price: "₹9,800",
    highlighted: true,
    features: [
      "Two-subject composition",
      "A3 archival paper (297×420 mm)",
      "Custom background treatment",
      "4–6 week delivery",
      "Two rounds of revision",
      "Foam-mounted safe shipping",
      "Signed & fixative-sealed original",
    ],
  },
  {
    name: "Heirloom",
    tagline: "Multi-subject · A2",
    price: "₹18,500",
    features: [
      "Up to five subjects",
      "A2 archival paper (420×594 mm)",
      "Bespoke composition planning",
      "6–10 week delivery",
      "Unlimited revisions to proof",
      "Optional oak or walnut framing",
      "Insured worldwide delivery",
    ],
  },
];

function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="Investment"
        title="Considered pricing, transparent."
        description="Below are our starting rates by scale and subject count. Final pricing depends upon image complexity, medium, framing and shipping destination."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-3xl p-10 ${
              t.highlighted
                ? "gold-border shadow-luxe"
                : "border border-white/10 bg-white/[0.02]"
            }`}
          >
            {t.highlighted && (
              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gold-gradient px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-[#121212]">
                <Sparkles size={12} /> Most Loved
              </div>
            )}
            <div className="text-[10px] tracking-[0.4em] uppercase text-gold-light">{t.tagline}</div>
            <h3 className="mt-3 font-display text-4xl">{t.name}</h3>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl text-gold-gradient">{t.price}</span>
              <span className="text-sm text-muted-foreground">starting</span>
            </div>
            <div className="my-8 hairline" />
            <ul className="space-y-4 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 shrink-0 text-gold" size={16} />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/order" className={`mt-10 flex w-full ${t.highlighted ? "btn-gold" : "btn-ghost-gold"}`}>
              Commission {t.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-muted-foreground md:p-10">
        <p className="text-gold-light tracking-[0.3em] uppercase text-[11px]">Note</p>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed">
          Final pricing depends upon image complexity. Additional subjects, custom backgrounds, oversized formats, framing, and international shipping are quoted transparently during consultation.
        </p>
      </div>
    </div>
  );
}
