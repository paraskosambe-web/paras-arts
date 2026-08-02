import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { artworks, categories, mediums, sorts } from "@/data/artworks";
import { SectionHeader } from "@/components/SectionHeader";
import { ArtworkImage } from "@/components/ArtworkImage";
import { ArtworkSkeleton } from "@/components/Skeleton";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Hand-Drawn Pencil Art | Paras Arts" },
      {
        name: "description",
        content:
          "Browse hyper-realistic pencil commissions by Paras Arts — portraits, devotional art, cars and animals in graphite and charcoal.",
      },
      { property: "og:title", content: "Portfolio — Paras Arts" },
      {
        property: "og:description",
        content: "A curated gallery of hand-drawn portraits, devotional art and automotive studies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const PAGE_SIZE = 6;
const chip =
  "rounded-full border px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light";

function PortfolioPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [med, setMed] = useState<(typeof mediums)[number]>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Newest");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const list = artworks.filter((a) => {
      const matchCat = cat === "All" || a.category === cat;
      const matchMed = med === "All" || a.medium === med;
      const needle = q.trim().toLowerCase();
      const matchQ =
        !needle ||
        a.title.toLowerCase().includes(needle) ||
        a.description.toLowerCase().includes(needle) ||
        a.mediumDetail.toLowerCase().includes(needle) ||
        a.category.toLowerCase().includes(needle);
      return matchCat && matchMed && matchQ;
    });

    return [...list].sort((a, b) => {
      if (sort === "Popular") return b.popularity - a.popularity;
      if (sort === "A–Z") return a.title.localeCompare(b.title);
      return b.year - a.year || b.popularity - a.popularity;
    });
  }, [q, cat, med, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = lightbox !== null ? paged[lightbox] : undefined;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % paged.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + paged.length) % paged.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, paged.length]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="The Portfolio"
        title="A private gallery of commissions"
        description="Search, filter and step inside — each piece is a story handed to us in a photograph and returned in graphite."
      />

      {/* CONTROLS */}
      <div className="mt-14 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-light" />
          <label className="sr-only" htmlFor="portfolio-search">
            Search artworks
          </label>
          <input
            id="portfolio-search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search artworks, subjects or mediums…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 pl-12 pr-5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Category
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setPage(1);
              }}
              aria-pressed={cat === c}
              className={`${chip} ${
                cat === c
                  ? "border-transparent bg-gold-gradient text-[#121212]"
                  : "border-white/10 text-white/70 hover:border-gold-light/40 hover:text-gold-light"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Medium
          </span>
          {mediums.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMed(m);
                setPage(1);
              }}
              aria-pressed={med === m}
              className={`${chip} ${
                med === m
                  ? "border-transparent bg-gold-gradient text-[#121212]"
                  : "border-white/10 text-white/70 hover:border-gold-light/40 hover:text-gold-light"
              }`}
            >
              {m}
            </button>
          ))}

          <span className="ml-auto mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Sort
          </span>
          {sorts.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
              aria-pressed={sort === s}
              className={`${chip} ${
                sort === s
                  ? "border-gold-light/60 text-gold-light"
                  : "border-white/10 text-white/60 hover:border-gold-light/40 hover:text-gold-light"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ArtworkSkeleton key={i} />)
          : paged.map((a, i) => (
              <Reveal key={a.id} delay={i * 70}>
                <div className="card-luxe group h-full overflow-hidden">
                  <button
                    onClick={() => {
                      setLightbox(i);
                      setZoomed(false);
                    }}
                    className="relative block w-full overflow-hidden"
                    aria-label={`Open ${a.title} in the lightbox`}
                  >
                    <ArtworkImage src={a.image} alt={`${a.title} — pencil sketch by Paras Arts`} fit={a.fit} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-gold-light backdrop-blur">
                      {a.category}
                    </div>
                    <div className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-gold-light opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ZoomIn size={15} />
                    </div>
                  </button>
                  <div className="p-6">
                    <h3 className="font-display text-2xl">{a.title}</h3>
                    <p className="mt-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {a.mediumDetail}
                    </p>
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/70">
                      {a.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <Link
                        to="/portfolio/$id"
                        params={{ id: a.id }}
                        className="text-xs tracking-[0.3em] uppercase text-gold-light hover:text-gold"
                      >
                        View details →
                      </Link>
                      <Link
                        to="/order"
                        className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-gold-light"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-24 text-center text-muted-foreground">
          No artworks match those filters.
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 hover:border-gold-light hover:text-gold-light disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? "page" : undefined}
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
            aria-label="Next page"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 hover:border-gold-light hover:text-gold-light disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* LIGHTBOX */}
      {active && (
        <div
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white hover:border-gold-light hover:text-gold-light"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
          <button
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white hover:border-gold-light hover:text-gold-light"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
              setLightbox((i) => (i === null ? i : (i - 1 + paged.length) % paged.length));
            }}
            aria-label="Previous artwork"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white hover:border-gold-light hover:text-gold-light"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
              setLightbox((i) => (i === null ? i : (i + 1) % paged.length));
            }}
            aria-label="Next artwork"
          >
            <ChevronRight size={18} />
          </button>

          <div className="max-h-[86vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-auto rounded-2xl">
              <img
                src={active.image}
                alt={`${active.title} — hand-drawn by Paras Arts`}
                onClick={() => setZoomed((z) => !z)}
                className={`max-h-[70vh] cursor-zoom-in rounded-2xl object-contain shadow-luxe transition-transform duration-500 ${
                  zoomed ? "scale-[1.8] cursor-zoom-out" : "scale-100"
                }`}
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold-light">
                  {active.category} · {active.medium}
                </div>
                <div className="font-display text-2xl">{active.title}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoomed((z) => !z)}
                  className="btn-ghost-gold text-sm"
                  aria-label={zoomed ? "Zoom out" : "Zoom in"}
                >
                  {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                  {zoomed ? "Zoom out" : "Zoom in"}
                </button>
                <Link to="/portfolio/$id" params={{ id: active.id }} className="btn-gold text-sm">
                  View details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
