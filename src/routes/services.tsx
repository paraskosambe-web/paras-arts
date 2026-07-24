import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";
import art5 from "@/assets/art-5.jpg";
import art6 from "@/assets/art-6.jpg";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Paras Arts" },
      { name: "description", content: "Custom portraits, couple, family, pet and automotive pencil commissions by Paras Arts." },
      { property: "og:title", content: "Services — Paras Arts" },
      { property: "og:description", content: "Signature commissions handcrafted by Paras Arts." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { image: art1, title: "Custom Portrait", desc: "A single-subject hyper-realistic portrait — the flagship commission. Perfect for gifting, memorials, or personal legacy.", price: "from ₹4,800", delivery: "3–5 weeks" },
  { image: art2, title: "Couple Portrait", desc: "Two figures composed with intimacy and grace. Popular for weddings, anniversaries, and engagements.", price: "from ₹7,500", delivery: "4–6 weeks" },
  { image: art5, title: "Family Portrait", desc: "A multi-figure heirloom piece with careful composition and shared tonal harmony.", price: "from ₹12,000", delivery: "5–8 weeks" },
  { image: art4, title: "Pet Portrait", desc: "The character of your companion, drawn with the same reverence we bring to any portrait.", price: "from ₹5,200", delivery: "3–5 weeks" },
  { image: art3, title: "Car / Motorcycle Sketch", desc: "Chrome, carbon and reflection rendered in exacting detail — a modern collector's piece.", price: "from ₹6,500", delivery: "4–6 weeks" },
  { image: art6, title: "Realistic Pencil Art", desc: "Open-brief commissions — objects, buildings, symbolic pieces. If it can be photographed, we can draw it.", price: "on request", delivery: "custom" },
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="Signature Services"
        title="Every piece, handmade to last."
        description="Every service below is a private commission — never a print, never digital. Choose the closest fit and we will tailor the composition, size, and medium in consultation."
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.title} className="group card-luxe overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
            </div>
            <div className="p-8">
              <h3 className="font-display text-3xl">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-white/75">{s.desc}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Starting</div>
                  <div className="mt-1 font-display text-xl text-gold-gradient">{s.price}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Delivery</div>
                  <div className="mt-1 flex items-center gap-2 text-white/80"><Clock size={14} className="text-gold" /> {s.delivery}</div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/order" className="btn-gold w-full">Commission this <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 rounded-3xl gold-border p-10 text-center md:p-16">
        <h3 className="font-display text-3xl md:text-4xl">Not sure which service fits?</h3>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Share your idea — we'll recommend the medium, size and timeline that best honours it.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/contact" className="btn-ghost-gold">Talk to us</Link>
          <Link to="/pricing" className="btn-gold">See pricing</Link>
        </div>
      </div>
    </div>
  );
}
