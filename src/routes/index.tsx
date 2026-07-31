import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Award, Brush, ChevronDown, Clock, Gem, Heart, Palette, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import gThor from "@/assets/gallery-thor.jpg.asset.json";
import gStrange from "@/assets/gallery-strange.jpg.asset.json";
import gKrishna from "@/assets/gallery-krishna.jpg.asset.json";
import gGanesha from "@/assets/gallery-ganesha.jpg.asset.json";
import gGaneshaTurban from "@/assets/gallery-ganesha-turban.jpg.asset.json";
import gChild from "@/assets/gallery-child.jpg.asset.json";
import gBmw from "@/assets/gallery-bmw.jpg.asset.json";
import gPorsche from "@/assets/gallery-porsche.jpg.asset.json";
import gRonaldo from "@/assets/gallery-ronaldo.jpg.asset.json";
import artistImg from "@/assets/artist.jpg.asset.json";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paras Arts — Luxury Hyper-Realistic Pencil Portraits" },
      {
        name: "description",
        content:
          "Commission a museum-grade pencil portrait. Custom, couple, family, pet and automotive art — handcrafted by Paras Arts.",
      },
      { property: "og:title", content: "Paras Arts — Luxury Hyper-Realistic Pencil Portraits" },
      { property: "og:description", content: "Handcrafted pencil portraits for collectors and connoisseurs." },
    ],
  }),
  component: HomePage,
});

const featured = [art1, art2, art3, art4, art5, art6];

const services = [
  { icon: Brush, title: "Custom Portrait", desc: "One subject, timeless likeness — from favourite photographs to legacy commissions.", price: "from ₹4,800" },
  { icon: Heart, title: "Couple Portrait", desc: "Anniversary and wedding heirlooms captured with romantic softness.", price: "from ₹7,500" },
  { icon: Palette, title: "Family Portrait", desc: "Multi-figure ensemble studies designed to be passed down.", price: "from ₹12,000" },
  { icon: Sparkles, title: "Pet Portrait", desc: "Every whisker, every gaze — a keepsake of your companion.", price: "from ₹5,200" },
];

const why = [
  { icon: Award, title: "Museum-grade finish", desc: "Archival paper, artist-grade graphite, and fixative for a lifetime of clarity." },
  { icon: Gem, title: "Hand-drawn, never digital", desc: "Each piece is drawn by hand — no filters, no shortcuts, no printing." },
  { icon: ShieldCheck, title: "Complimentary insured shipping", desc: "Foam-mounted, moisture-sealed and dispatched worldwide with tracking." },
  { icon: Clock, title: "On-time delivery", desc: "A calibrated timeline confirmed before we begin — never missed." },
];

const steps = [
  { n: "01", t: "Enquire", d: "Share your reference photographs and preferences via the order form." },
  { n: "02", t: "Consult", d: "Our studio confirms composition, medium, size, and timeline in writing." },
  { n: "03", t: "Handcraft", d: "Your piece is drawn over 30–80 hours by a single artist." },
  { n: "04", t: "Deliver", d: "You receive high-res proofs, then the original — signed and shipped." },
];

const testimonials = [
  { name: "Ananya R.", role: "Mumbai", text: "The portrait of my late father brought tears to the entire family. Every line felt sacred.", stars: 5 },
  { name: "Dr. Karan M.", role: "London", text: "Extraordinary attention to detail. The car sketch of my father-in-law's Porsche is our most prized gift.", stars: 5 },
  { name: "Priya & Rohan", role: "Bangalore", text: "Our anniversary sketch is now the centrepiece of our home. Understated, elegant, breathtaking.", stars: 5 },
];

const faqs = [
  { q: "How long does a commission take?", a: "Typical delivery is 3 to 6 weeks depending on complexity, size and current studio queue. Rush service is available on request." },
  { q: "What reference photographs work best?", a: "High-resolution, well-lit photographs where facial features are clearly visible. We can guide you on the perfect reference during consultation." },
  { q: "Do you ship internationally?", a: "Yes. Every piece is packed in a foam-mount case with moisture protection and shipped fully insured with tracking, worldwide." },
  { q: "Can I request revisions?", a: "Two rounds of refinement are included at the proof stage before finishing. Structural changes are best resolved at the reference-approval step." },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/60 to-[#121212]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_30%,rgba(201,138,43,0.25),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 lg:px-10 lg:pt-40 lg:pb-48">
          <div className="max-w-3xl animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold-light/30 bg-white/[0.03] px-4 py-2 text-[11px] tracking-[0.35em] uppercase text-gold-light backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              A Luxury Pencil-Art Atelier
            </div>
            <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-[6.5rem]">
              The art of{" "}
              <span className="text-gold-gradient italic">stillness</span>,
              <br className="hidden md:block" /> drawn by hand.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
              Paras Arts crafts museum-grade hyper-realistic pencil portraits — commissioned pieces for
              those who prefer their memories rendered with a lifetime of care.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/order" className="btn-gold">
                Commission a Sketch <ArrowRight size={16} />
              </Link>
              <Link to="/portfolio" className="btn-ghost-gold">
                View the Portfolio
              </Link>
            </div>

            <div className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[["500+", "Commissions"], ["30+", "Countries"], ["7 yrs", "Studio"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl text-gold-gradient">{n}</div>
                  <div className="mt-1 text-xs tracking-[0.25em] uppercase text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <a href="#featured" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-light/70 animate-bounce">
          <ChevronDown />
        </a>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/5 bg-[#0f0f0f] py-6 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {[...Array(2)].flatMap((_, i) =>
            ["Hyper-Realistic Portraits", "Since 2019", "Handcrafted Commissions", "Shipped Worldwide", "Archival Graphite", "Signed Originals"].map((t, j) => (
              <span key={`${i}-${j}`} className="flex items-center gap-16 text-sm tracking-[0.35em] uppercase text-white/40">
                {t} <span className="text-gold">✦</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* FEATURED */}
      <section id="featured" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            align="left"
            eyebrow="Selected Works"
            title="A private gallery"
            description="A curated glimpse into recent commissions. Every piece is one-of-one, drawn entirely by hand on archival paper."
          />
          <Link to="/portfolio" className="btn-ghost-gold">
            Enter the Portfolio <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((src, i) => (
            <Link
              key={i}
              to="/portfolio"
              className="group relative overflow-hidden rounded-2xl card-luxe"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-[11px] tracking-[0.3em] uppercase text-gold-light">Commission №{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 font-display text-xl">Handcrafted in the Studio</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT — THE ARTIST */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.4em] uppercase text-gold-light">The Artist</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
            Paras <span className="text-gold-gradient italic">Kosambe.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Paras Kosambe is a self-taught pencil artist and the founder of Paras Arts. What began in 2019 as a
            sketchbook habit became a practice devoted to one idea: that a handmade portrait can hold a memory
            better than any photograph.
          </p>
        </div>

        <div className="mt-16 grid items-stretch gap-10 lg:grid-cols-5">
          <div className="overflow-hidden rounded-3xl gold-border lg:col-span-2">
            <img
              src={artistImg.url}
              alt="Paras Kosambe, founder and artist at Paras Arts"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-3">
            <SectionHeader align="left" eyebrow="In his words" title="I draw slowly, on purpose." />
            <p className="mt-6 leading-relaxed text-white/75">
              "Every commission starts with sitting quietly with a photograph until I understand the person in it —
              the way light falls on a cheekbone, the tension in a smile, the story hiding in the eyes. Only then
              does the first line go down. From there it is thousands of small decisions, layered in graphite over
              many days."
            </p>
            <p className="mt-4 leading-relaxed text-white/75">
              "I still work alone, and I keep the studio small on purpose. I take a limited number of pieces each
              month so nothing is rushed and nothing is repeated. Every frame that leaves my desk carries a name I
              remember."
            </p>
            <div className="mt-8 font-display text-2xl text-gold-gradient">— Paras Kosambe</div>
          </div>
        </div>

        <div className="mt-20 grid gap-16 md:grid-cols-2">
          <div>
            <SectionHeader align="left" eyebrow="The Journey" title="From sketchbook to studio." />
            <ul className="mt-6 space-y-4 text-white/75">
              {[
                ["2019", "First commissioned portrait — a family gift that turned a hobby into a calling."],
                ["2021", "Full-time practice begins; hyper-realism becomes the signature style."],
                ["2023", "Commissions cross borders, shipping framed originals internationally."],
                ["Today", "Paras Arts — a one-artist studio built on patience, precision and trust."],
              ].map(([k, v]) => (
                <li key={k} className="border-b border-white/10 pb-4">
                  <div className="text-xs tracking-[0.3em] uppercase text-gold-light">{k}</div>
                  <div className="mt-2">{v}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader align="left" eyebrow="His Hands" title="What sits on the desk." />
            <ul className="mt-6 space-y-4 text-white/75">
              {[
                ["Graphite", "Faber-Castell 9000 · Staedtler Mars Lumograph · Caran d'Ache Grafwood"],
                ["Paper", "Fabriano Artistico · Strathmore 500 Series · Canson Bristol"],
                ["Finish", "Archival fixative · Optional acid-free mounting · UV-safe framing"],
                ["Delivery", "Foam-mounted, moisture-sealed, insured worldwide shipping"],
              ].map(([k, v]) => (
                <li key={k} className="border-b border-white/10 pb-4">
                  <div className="text-xs tracking-[0.3em] uppercase text-gold-light">{k}</div>
                  <div className="mt-2">{v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-3xl gold-border p-10 md:p-16">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ["500+", "Portraits drawn by hand"],
              ["30+", "Countries served"],
              ["100%", "Handcrafted — never printed"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-5xl text-gold-gradient md:text-6xl">{n}</div>
                <div className="mt-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link to="/about" className="btn-gold">Read the full story <ArrowRight size={16} /></Link>
          <Link to="/portfolio" className="btn-ghost-gold">See the portfolio</Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader
          eyebrow="What We Draw"
          title="Signature commissions"
          description="Four disciplines, one uncompromising standard."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card-luxe p-8">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-[#121212]">
                <s.icon size={22} />
              </div>
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                <span className="text-sm text-gold-light">{s.price}</span>
                <Link to="/services" className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-gold-light">
                  Explore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader eyebrow="Why Paras Arts" title="Craft, not content." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:border-gold-light/30">
              <w.icon className="text-gold" size={28} />
              <h4 className="mt-5 font-display text-xl">{w.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW ORDERING WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader eyebrow="The Process" title="How ordering works" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative card-luxe p-8">
              <div className="font-display text-6xl text-gold-gradient opacity-90">{s.n}</div>
              <h4 className="mt-4 font-display text-2xl">{s.t}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 right-0 hidden h-px w-6 translate-x-full bg-gold-light/40 lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <SectionHeader eyebrow="Praise" title="Words from clients" />
        <TestimonialSlider items={testimonials} />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-28 lg:px-10">
        <SectionHeader eyebrow="Answered" title="Frequently asked" />
        <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.02]">
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/faq" className="btn-ghost-gold">See all questions</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] gold-border p-10 sm:p-16 lg:p-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_300px_at_80%_20%,rgba(201,138,43,0.25),transparent_60%)]" />
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              Turn a photograph into a{" "}
              <span className="text-gold-gradient italic">forever piece.</span>
            </h2>
            <p className="mt-6 max-w-xl text-white/75">
              Commissions are limited to preserve craftsmanship. Share your reference — we'll take it from there.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/order" className="btn-gold">Order a Sketch <ArrowRight size={16} /></Link>
              <Link to="/contact" className="btn-ghost-gold">Talk to the studio</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="flex w-full flex-col items-start px-6 py-6 text-left"
    >
      <div className="flex w-full items-center justify-between gap-6">
        <span className="font-display text-lg md:text-xl">{q}</span>
        <ChevronDown className={`shrink-0 text-gold-light transition-transform ${open ? "rotate-180" : ""}`} size={18} />
      </div>
      <div className={`grid overflow-hidden transition-all duration-500 ${open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </button>
  );
}

function TestimonialSlider({ items }: { items: typeof testimonials }) {
  const [i, setI] = useState(0);
  const t = items[i];
  return (
    <div className="mt-14">
      <div className="mx-auto max-w-3xl text-center">
        <Quote className="mx-auto text-gold" size={40} />
        <blockquote className="mt-8 font-display text-2xl leading-relaxed sm:text-3xl">
          "{t.text}"
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-1 text-gold">
          {Array.from({ length: t.stars }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
        </div>
        <div className="mt-4 text-sm tracking-[0.3em] uppercase text-gold-light">{t.name}</div>
        <div className="text-xs text-muted-foreground">{t.role}</div>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3">
        {items.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-full transition-all ${i === k ? "w-10 bg-gold" : "w-3 bg-white/20"}`}
            aria-label={`Go to testimonial ${k + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
