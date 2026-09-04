import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { artworks, categories, mediums, sorts } from "@/data/artworks";
import { SectionHeader } from "@/components/SectionHeader";
import { ArtworkImage } from "@/components/ArtworkImage";
import { ArtworkSkeleton } from "@/components/Skeleton";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

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
        content:
          "A curated gallery of hand-drawn portraits, devotional art and automotive studies.",
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
  const { tr } = useLang();

  const [q, setQ] = useState("");
  const [cat, setCat] =
    useState<(typeof categories)[number]>("All");
  const [med, setMed] =
    useState<(typeof mediums)[number]>("All");
  const [sort, setSort] =
    useState<(typeof sorts)[number]>("Newest");
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
      if (sort === "Popular") {
        return b.popularity - a.popularity;
      }

      if (sort === "A–Z") {
        return a.title.localeCompare(b.title);
      }

      return b.year - a.year || b.popularity - a.popularity;
    });
  }, [q, cat, med, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const active =
    lightbox !== null ? paged[lightbox] : undefined;

  useEffect(() => {
    if (!active) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setZoomed(false);
      }

      if (e.key === "ArrowRight") {
        setZoomed(false);
        setLightbox((i) =>
          i === null ? i : (i + 1) % paged.length
        );
      }

      if (e.key === "ArrowLeft") {
        setZoomed(false);
        setLightbox((i) =>
          i === null
            ? i
            : (i - 1 + paged.length) % paged.length
        );
      }
    };

    window.addEventListener("keydown", onKey);

    return () =>
      window.removeEventListener("keydown", onKey);
  }, [active, paged.length]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow={tr("The Portfolio")}
        title={tr("A private gallery of commissions")}
        description={tr(
          "Search, filter and step inside — each piece is a story handed to us in a photograph and returned in graphite."
        )}
      />

      {/* CONTROLS */}
      <div className="mt-14 space-y-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-light"
          />

          <label
            className="sr-only"
            htmlFor="portfolio-search"
          >
            {tr("Search artworks")}
          </label>

          <input
            id="portfolio-search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder={tr(
              "Search artworks, subjects or mediums…"
            )}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 pl-12 pr-5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {tr("Category")}
          </span>

          {categories.map((c) => (
            <button
              key={c}
              type="button"
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
              {tr(c)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {tr("Medium")}
          </span>

          {mediums.map((m) => (
            <button
              key={m}
              type="button"
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
              {tr(m)}
            </button>
          ))}

          <span className="ml-auto mr-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {tr("Sort")}
          </span>

          {sorts.map((s) => (
            <button
              key={s}
              type="button"
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
              {tr(s)}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ArtworkSkeleton key={i} />
            ))
          : paged.map((a, i) => (
              <Reveal key={a.id} delay={i * 70}>
                <div className="card-luxe group h-full overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setLightbox(i);
                      setZoomed(false);
                    }}
                    className="relative block w-full overflow-hidden"
                    aria-label={`Open ${a.title} in the lightbox`}
                  >
                    <ArtworkImage
                      src={a.image}
                      alt={`${a.title} — pencil sketch by Paras Arts`}
                      fit={a.fit}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-gold-light backdrop-blur">
                      {a.category}
                    </div>

                    <div className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-gold-light opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ZoomIn size={15} />
                    </div>
                  </button>

                  <div className="p-6">
                    <h3 className="font-display text-2xl">
                      {a.title}
                    </h3>

                    <p className="mt-2 text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {a.mediumDetail}
                    </p>

                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/70">
                      {a.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setLightbox(i);
                          setZoomed(false);
                        }}
                        className="text-xs tracking-[0.3em] uppercase text-gold-light hover:text-gold"
                      >
                        {tr("View details →")}
                      </button>

                      <Link
                        to="/order"
                        className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-gold-light"
                      >
                        {tr("Order")}
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-24 text-center text-muted-foreground">
          {tr("No artworks match those filters.")}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            aria-label={tr("Previous page")}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 hover:border-gold-light hover:text-gold-light disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map(
            (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                aria-current={
                  page === i + 1 ? "page" : undefined
                }
                className={`h-10 min-w-10 rounded-full border px-4 text-sm ${
                  page === i + 1
                    ? "border-transparent bg-gold-gradient text-[#121212]"
                    : "border-white/10 text-white/70 hover:border-gold-light"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            aria-label={tr("Next page")}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 hover:border-gold-light hover:text-gold-light disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* LIGHTBOX / ARTWORK DETAILS */}
      {active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/95 p-4 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          onClick={() => {
            setLightbox(null);
            setZoomed(false);
          }}
        >
          {/* PREVIOUS BUTTON */}
          <button
            type="button"
            className="absolute left-4 top-1/2 z-[10001] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:left-7"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
              setLightbox((i) =>
                i === null
                  ? i
                  : (i - 1 + paged.length) %
                    paged.length
              );
            }}
            aria-label={tr("Previous artwork")}
          >
            <ChevronLeft size={19} strokeWidth={1.8} />
          </button>

          {/* NEXT BUTTON */}
          <button
            type="button"
            className="absolute right-4 top-1/2 z-[10001] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:right-7"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
              setLightbox((i) =>
                i === null
                  ? i
                  : (i + 1) % paged.length
              );
            }}
            aria-label={tr("Next artwork")}
          >
            <ChevronRight size={19} strokeWidth={1.8} />
          </button>

          {/* MAIN MODAL BOX */}
          <div
            className="relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/95 shadow-2xl md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON — INSIDE THE BOX */}
            <button
              type="button"
              className="absolute right-4 top-4 z-[10002] grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/70 text-white/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:right-5 sm:top-5"
              onClick={() => {
                setLightbox(null);
                setZoomed(false);
              }}
              aria-label={tr("Close preview")}
            >
              <X size={19} strokeWidth={1.8} />
            </button>

            {/* ARTWORK */}
            <div className="flex min-h-[42vh] min-w-0 flex-1 items-center justify-center bg-black/30 p-5 pt-16 sm:p-8 sm:pt-16 md:min-h-0 md:p-8 md:pr-14 lg:p-10 lg:pr-16">
              <div className="flex max-h-full max-w-full items-center justify-center overflow-auto rounded-2xl">
                <img
                  src={active.image}
                  alt={`${active.title} — hand-drawn by Paras Arts`}
                  onClick={() => setZoomed((z) => !z)}
                  className={`max-h-[50vh] max-w-full rounded-2xl object-contain shadow-luxe transition-transform duration-500 ${
                    zoomed
                      ? "scale-[1.5] cursor-zoom-out"
                      : "scale-100 cursor-zoom-in"
                  }`}
                />
              </div>
            </div>

            {/* INFORMATION */}
            <div className="flex w-full flex-col justify-center overflow-y-auto border-t border-white/10 p-6 pt-16 sm:p-8 sm:pt-16 md:w-[38%] md:border-l md:border-t-0 md:p-7 md:pt-14 lg:w-[390px] lg:p-10 lg:pt-16">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                {active.category} · {active.medium}
              </div>

              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                {active.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/65">
                {active.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {tr("Medium")}
                </div>

                <div className="mt-2 text-sm text-white/80">
                  {active.mediumDetail}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="btn-ghost-gold text-sm"
                  aria-label={
                    zoomed
                      ? tr("Zoom out")
                      : tr("Zoom in")
                  }
                >
                  {zoomed ? (
                    <ZoomOut size={14} />
                  ) : (
                    <ZoomIn size={14} />
                  )}

                  {zoomed
                    ? tr("Zoom out")
                    : tr("Zoom in")}
                </button>

                <Link
                  to="/order"
                  className="btn-gold text-sm"
                >
                  {tr("Order this sketch")}
                  <ArrowRight size={14} />
                </Link>
              </div>

              <p className="mt-6 text-[10px] tracking-[0.15em] uppercase text-white/30">
                {tr("Click the artwork to zoom")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}