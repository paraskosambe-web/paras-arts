import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Atelier — Paras Arts" },
      { name: "description", content: "The philosophy, materials, and process behind Paras Arts — a luxury pencil-art atelier." },
      { property: "og:title", content: "About the Atelier — Paras Arts" },
      { property: "og:description", content: "Meet the studio behind Paras Arts hyper-realistic pencil commissions." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-[11px] tracking-[0.4em] uppercase text-gold-light">The Atelier</div>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">
          Every line is a <span className="text-gold-gradient italic">decision.</span>
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-white/75">
          Paras Arts began in 2019 as a private practice — a quiet counter-current to the noise of digital art. Today it remains a one-artist studio, deliberately small, taking on only a limited number of commissions each month so that every piece can receive the depth of attention it deserves.
        </p>
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl gold-border">
        <img src={aboutImg} alt="The studio" className="w-full object-cover" />
      </div>

      <div className="mt-24 grid gap-16 md:grid-cols-2">
        <div>
          <SectionHeader align="left" eyebrow="Philosophy" title="The slow craft." />
          <p className="mt-6 leading-relaxed text-white/75">
            A hyper-realistic pencil portrait is not a race to a likeness. It is a study in patience — of learning a face until it becomes familiar under the hand. Our work is defined by restraint, tonal accuracy, and an obsession with the small quiet details that make a portrait feel alive.
          </p>
          <p className="mt-4 leading-relaxed text-white/75">
            We refuse rush and refuse compromise. We use archival paper, artist-grade graphite, and a fixative process trusted by museums. Nothing is printed; nothing is faked.
          </p>
        </div>
        <div>
          <SectionHeader align="left" eyebrow="Materials" title="What sits on the desk." />
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

      <div className="mt-24 rounded-3xl gold-border p-10 md:p-16">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["500+", "Private commissions delivered"],
            ["30+", "Countries served"],
            ["100%", "Handcrafted — never printed"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-6xl text-gold-gradient">{n}</div>
              <div className="mt-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex flex-wrap gap-4">
        <Link to="/order" className="btn-gold">Commission a Sketch <ArrowRight size={16} /></Link>
        <Link to="/portfolio" className="btn-ghost-gold">See the portfolio</Link>
      </div>
    </div>
  );
}
