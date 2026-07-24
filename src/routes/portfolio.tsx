import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { artworks, categories } from "@/data/artworks";
import { SectionHeader } from "@/components/SectionHeader";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Paras Arts" },
      { name: "description", content: "A curated gallery of hyper-realistic pencil commissions by Paras Arts." },
      { property: "og:title", content: "Portfolio — Paras Arts" },
      { property: "og:description", content: "Handcrafted portraits, couples, pets, family and automotive art." },
    ],
  }),
  component: PortfolioPage,
});

const PAGE_SIZE = 6;

function PortfolioPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return artworks.filter((a) => {
      const matchCat = cat === "All" || a.category === cat;
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.description.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="The Portfolio"
        title="A private gallery of commissions"
        description="Search, filter, and step inside — each piece is a story handed to us in a photograph and returned in graphite."
      />

      {/* CONTROLS */}
      <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-light" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search artworks, subjects or mediums…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 pl-12 pr-5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setPage(1); }}
              className={`rounded-full border px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all ${
                cat === c
                  ? "border-transparent bg-gold-gradient text-[#121212]"
                  : "border-white/10 text-white/70 hover:border-gold-light/40 hover:text-gold-light"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((a, i) => (
          <div key={a.id} className="card-luxe group overflow-hidden">
            <button
              onClick={() => setLightbox(i)}
              className="relative block aspect-[4/5] w-full overflow-hidden"
              aria-label={`Open ${a.title}`}
            >
              <img
                src={a.image}
                alt={a.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-gold-light backdrop-blur">
                {a.category}
              </div>
            </button>
            <div className="p-6">
              <h3 className="font-display text-2xl">{a.title}</h3>
              <p className="mt-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                {a.medium}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70 line-clamp-2">{a.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <Link
                  to="/portfolio/$id"
                  params={{ id: a.id }}
                  className="text-xs tracking-[0.3em] uppercase text-gold-light hover:text-gold"
                >
                  View details →
                </Link>
                <Link to="/order" className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-gold-light">
                  Order
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-24 text-center text-muted-foreground">No artworks match those filters.</div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 disabled:opacity-30 hover:border-gold-light hover:text-gold-light"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-10 min-w-10 rounded-full border px-4 text-sm ${
                page === i + 1
                  ? "border-transparent bg-gold-gradient text-[#121212]"
                  : "border-white/10 text-white/70 hover:border-gold-light"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 disabled:opacity-30 hover:border-gold-light hover:text-gold-light"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox !== null && paged[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white hover:border-gold-light hover:text-gold-light"
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>
          <div className="max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={paged[lightbox].image}
              alt={paged[lightbox].title}
              className="max-h-[85vh] rounded-2xl object-contain shadow-luxe"
            />
            <div className="mt-6 flex items-center justify-between text-white">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold-light">{paged[lightbox].category}</div>
                <div className="font-display text-2xl">{paged[lightbox].title}</div>
              </div>
              <Link
                to="/portfolio/$id"
                params={{ id: paged[lightbox].id }}
                className="btn-gold text-sm"
              >
                View details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
