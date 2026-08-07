import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import artistImg from "@/assets/artist.jpg.asset.json";
import { SectionHeader } from "@/components/SectionHeader";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Paras Kosambe — The Artist Behind Paras Arts" },
      { name: "description", content: "Meet Paras Kosambe, the pencil artist behind Paras Arts — hyper-realistic handcrafted portraits, drawn one line at a time since 2019." },
      { property: "og:title", content: "Paras Kosambe — The Artist Behind Paras Arts" },
      { property: "og:description", content: "The story, hands and philosophy of Paras Kosambe, founder of Paras Arts." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { tr } = useLang();
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="max-w-3xl">
        <div className="text-[11px] tracking-[0.4em] uppercase text-gold-light">{tr("The Artist")}</div>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">
          Paras <span className="text-gold-gradient italic">Kosambe.</span>
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-white/75">
          {tr("Paras Kosambe is a self-taught pencil artist and the founder of Paras Arts. What began in 2019 as a sketchbook habit — faces of family, friends and strangers drawn late into the night — became a practice devoted to one idea: that a handmade portrait can hold a memory better than any photograph.")}
        </p>
      </div>

      <div className="mt-16 grid items-stretch gap-10 lg:grid-cols-5">
        <div className="overflow-hidden rounded-3xl gold-border lg:col-span-2">
          <img
            src={artistImg.url}
            alt="Paras Kosambe, founder and artist at Paras Arts"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center lg:col-span-3">
          <SectionHeader align="left" eyebrow={tr("In his words")} title={tr("I draw slowly, on purpose.")} />
          <p className="mt-6 leading-relaxed text-white/75">
            {tr("\"Every commission starts with sitting quietly with a photograph until I understand the person in it — the way light falls on a cheekbone, the tension in a smile, the story hiding in the eyes. Only then does the first line go down. From there it is thousands of small decisions, layered in graphite over many days.\"")}
          </p>
          <p className="mt-4 leading-relaxed text-white/75">
            {tr("\"I still work alone, and I keep the studio small on purpose. I take a limited number of pieces each month so nothing is rushed and nothing is repeated. Every frame that leaves my desk carries a name I remember.\"")}
          </p>
          <div className="mt-8 font-display text-2xl text-gold-gradient">— Paras Kosambe</div>
        </div>
      </div>

      <div className="mt-24 grid gap-16 md:grid-cols-2">
        <div>
          <SectionHeader align="left" eyebrow={tr("The Journey")} title={tr("From sketchbook to studio.")} />
          <ul className="mt-6 space-y-4 text-white/75">
            {[
              ["2019", "First commissioned portrait — a family gift that turned a hobby into a calling."],
              ["2021", "Full-time practice begins; hyper-realism becomes the signature style."],
              ["2023", "Commissions cross borders, shipping framed originals internationally."],
              ["Today", "Paras Arts — a one-artist studio built on patience, precision and trust."],
            ].map(([k, v]) => (
              <li key={k} className="border-b border-white/10 pb-4">
                <div className="text-xs tracking-[0.3em] uppercase text-gold-light">{k === "Today" ? tr("Today") : k}</div>
                <div className="mt-2">{tr(v)}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader align="left" eyebrow={tr("His Hands")} title={tr("What sits on the desk.")} />
          <ul className="mt-6 space-y-4 text-white/75">
            {[
              ["Graphite", "Faber-Castell 9000 · Staedtler Mars Lumograph · Caran d'Ache Grafwood"],
              ["Paper", "Fabriano Artistico · Strathmore 500 Series · Canson Bristol"],
              ["Finish", "Archival fixative · Optional acid-free mounting · UV-safe framing"],
              ["Delivery", "Foam-mounted, moisture-sealed, insured worldwide shipping"],
            ].map(([k, v]) => (
              <li key={k} className="border-b border-white/10 pb-4">
                <div className="text-xs tracking-[0.3em] uppercase text-gold-light">{tr(k)}</div>
                <div className="mt-2">{tr(v)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-24 rounded-3xl gold-border p-10 md:p-16">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["500+", "Portraits drawn by hand"],
            ["30+", "Countries served"],
            ["100%", "Handcrafted — never printed"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-display text-6xl text-gold-gradient">{n}</div>
              <div className="mt-3 text-xs tracking-[0.3em] uppercase text-muted-foreground">{tr(l)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex flex-wrap gap-4">
        <Link to="/order" className="btn-gold">{tr("Commission a Sketch")} <ArrowRight size={16} /></Link>
        <Link to="/portfolio" className="btn-ghost-gold">{tr("See the portfolio")}</Link>
      </div>
    </div>
  );
}
