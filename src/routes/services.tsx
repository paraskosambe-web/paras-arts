import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Brush, Car, Clock, Heart, PawPrint, Users } from "lucide-react";
import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";
import art5 from "@/assets/art-5.jpg";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Paras Arts" },
      {
        name: "description",
        content:
          "Custom, couple, family, pet and automotive pencil commissions by Paras Arts, with transparent A4, A3 and A2 pricing.",
      },
      { property: "og:title", content: "Services & Pricing — Paras Arts" },
      { property: "og:description", content: "Signature commissions and transparent pricing by Paras Arts." },
    ],
  }),
  component: ServicesPage,
});

export const PAGE_SIZES = [
  { key: "A4", label: "A4", dims: "210 × 297 mm", add: 0 },
  { key: "A3", label: "A3", dims: "297 × 420 mm", add: 2000 },
  { key: "A2", label: "A2", dims: "420 × 594 mm", add: 4000 },
] as const;

type SizeKey = (typeof PAGE_SIZES)[number]["key"];

const services = [
  {
    icon: Brush,
    image: art1,
    title: "Custom Portrait",
    base: 1000,
    desc: "A single-subject hyper-realistic portrait — the flagship commission. Perfect for gifting, memorials or personal legacy.",
    delivery: "3–5 weeks",
    fit: "cover" as const,
  },
  {
    icon: Heart,
    image: art2,
    title: "Couple Portrait",
    base: 3000,
    desc: "Two figures composed with intimacy and grace. Popular for weddings, anniversaries and engagements.",
    delivery: "4–6 weeks",
    fit: "cover" as const,
  },
  {
    icon: Users,
    image: art5,
    title: "Family Portrait",
    base: 5000,
    desc: "A multi-figure heirloom piece with careful composition and shared tonal harmony.",
    delivery: "5–8 weeks",
    fit: "cover" as const,
  },
  {
    icon: PawPrint,
    image: art4,
    title: "Pet Portrait",
    base: 2000,
    desc: "The character of your companion, drawn with the same reverence we bring to any portrait.",
    delivery: "3–5 weeks",
    fit: "cover" as const,
  },
  {
    icon: Car,
    image: art3,
    title: "Car / Motorsports Sketch",
    base: 4000,
    desc: "Chrome, carbon and reflection rendered in exacting detail — a modern collector's piece.",
    delivery: "4–6 weeks",
    fit: "contain" as const,
  },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function ServicesPage() {
  const [size, setSize] = useState<SizeKey>("A4");
  const add = PAGE_SIZES.find((s) => s.key === size)!.add;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeader
        eyebrow="Services & Pricing"
        title="Every piece, handmade to last."
        description="Every service below is a private commission — never a print, never digital. Choose your page size and the starting price updates instantly."
      />

      {/* PAGE SIZE SELECTOR */}
      <div className="mt-10 flex flex-col items-center gap-4 lg:mt-14">
        <span className="text-[10px] tracking-[0.35em] uppercase text-gold-light">Select page size</span>
        <div
          role="radiogroup"
          aria-label="Page size"
          className="inline-flex flex-wrap justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5"
        >
          {PAGE_SIZES.map((s) => {
            const active = s.key === size;
            return (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSize(s.key)}
                className={`rounded-full px-5 py-2.5 text-center transition-all duration-300 sm:px-7 ${
                  active
                    ? "bg-gold-gradient text-[#121212] shadow-luxe"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-gold-light"
                }`}
              >
                <span className="block text-sm font-medium tracking-[0.15em]">{s.label}</span>
                <span
                  className={`mt-0.5 block text-[10px] tracking-[0.12em] ${
                    active ? "text-[#121212]/70" : "text-muted-foreground"
                  }`}
                >
                  {s.dims}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {size === "A4" ? "Base size" : `A4 base price + ${inr(add)} for ${size}`}
        </p>
      </div>

      {/* SERVICE CARDS */}
      <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <div className="group flex h-full flex-col overflow-hidden card-luxe">
              <div className="aspect-[16/10] overflow-hidden bg-[#0e0e0e]">
                <img
                  src={s.image}
                  alt={`${s.title} — hand-drawn pencil sketch by Paras Arts`}
                  loading="lazy"
                  className={`h-full w-full transition-transform duration-[1.4s] group-hover:scale-105 ${
                    s.fit === "contain" ? "object-contain p-2" : "object-cover"
                  }`}
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-[#121212]">
                    <s.icon size={18} />
                  </span>
                  <h3 className="font-display text-2xl leading-tight sm:text-[26px]">{s.title}</h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/75">{s.desc}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                      {size} · Starts
                    </div>
                    <div className="mt-1 font-display text-2xl text-gold-gradient">
                      {inr(s.base + add)}+
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Delivery</div>
                    <div className="mt-1.5 flex items-center gap-2 text-sm text-white/80">
                      <Clock size={14} className="text-gold" /> {s.delivery}
                    </div>
                  </div>
                </div>

                <Link
                  to="/order"
                  search={{ service: s.title, size }}
                  className="btn-gold mt-7 w-full justify-center"
                >
                  Order Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center sm:p-10">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold-light">Note</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Prices may increase depending on the image and its complexity.
        </p>
      </div>

      <div className="mt-10 rounded-3xl gold-border p-8 text-center sm:p-14">
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl">Not sure which service fits?</h3>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Share your idea — we'll recommend the size, medium and timeline that best honours it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="btn-ghost-gold justify-center">Talk to us</Link>
          <Link to="/order" className="btn-gold justify-center">Order a sketch</Link>
        </div>
      </div>
    </div>
  );
}
