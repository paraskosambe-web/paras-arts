import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { artworks } from "@/data/artworks";

export const Route = createFileRoute("/portfolio/$id")({
  loader: ({ params }) => {
    const art = artworks.find((a) => a.id === params.id);
    if (!art) throw notFound();
    return { art };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.art.title} — Paras Arts` : "Artwork — Paras Arts" },
      { name: "description", content: loaderData?.art.description ?? "An artwork by Paras Arts." },
      { property: "og:title", content: loaderData ? `${loaderData.art.title} — Paras Arts` : "Artwork — Paras Arts" },
      { property: "og:description", content: loaderData?.art.description ?? "Hyper-realistic pencil art commission." },
    ],
  }),
  component: ArtworkDetails,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-gold-gradient">Artwork not found</h1>
      <p className="mt-4 text-muted-foreground">This piece may have moved or been retired from the public gallery.</p>
      <Link to="/portfolio" className="btn-gold mt-8">Back to portfolio</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Something went wrong</h1>
      <button onClick={reset} className="btn-gold mt-8">Try again</button>
    </div>
  ),
});

function ArtworkDetails() {
  const { art } = Route.useLoaderData();
  const related = artworks.filter((a) => a.id !== art.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold-light hover:text-gold">
        <ArrowLeft size={14} /> Portfolio
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="overflow-hidden rounded-3xl gold-border bg-[#0e0e0e]">
          <img
            src={art.image}
            alt={`${art.title} — hand-drawn pencil artwork by Paras Arts`}
            className={`w-full ${art.fit === "contain" ? "object-contain p-3" : "object-cover"}`}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="lg:pt-8">
          <div className="text-[11px] tracking-[0.4em] uppercase text-gold-light">{art.category}</div>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{art.title}</h1>
          <p className="mt-6 text-white/75 leading-relaxed">{art.description}</p>

          <dl className="mt-10 space-y-5 border-t border-white/10 pt-8">
            {[
              ["Medium", art.mediumDetail],
              ["Paper size", art.paperSize],
              ["Type", "Original · One-of-One"],
              ["Signed", "Yes · Verso"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-8">
                <dt className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/order" className="btn-gold">Order Similar Sketch <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn-ghost-gold">Ask a question</Link>
          </div>
        </div>
      </div>

      <section className="mt-32">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">Related works</h2>
          <Link to="/portfolio" className="text-xs tracking-[0.3em] uppercase text-gold-light hover:text-gold">View all →</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {related.map((a) => (
            <Link
              key={a.id}
              to="/portfolio/$id"
              params={{ id: a.id }}
              className="group overflow-hidden rounded-2xl card-luxe"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#0e0e0e]">
                <img
                  src={a.image}
                  alt={`${a.title} — pencil sketch by Paras Arts`}
                  className={`h-full w-full transition-transform duration-[1.4s] group-hover:scale-110 ${a.fit === "contain" ? "object-contain p-2" : "object-cover"}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="p-5">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">{a.category}</div>
                <div className="mt-2 font-display text-lg">{a.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
