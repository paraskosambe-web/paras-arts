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

import {
  artworks,
  categories,
  mediums,
  sorts,
  type Artwork,
} from "@/data/artworks";

import { SectionHeader } from "@/components/SectionHeader";
import { ArtworkImage } from "@/components/ArtworkImage";
import { ArtworkSkeleton } from "@/components/Skeleton";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { api, assetUrl } from "@/lib/api";

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

type ApiArtwork = {
  _id: string;
  title: string;
  category: string;
  medium: string;
  paperSize: string;
  description: string;
  image: string;
  price?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function mapApiArtwork(a: ApiArtwork): Artwork {
  const categoryMap: Record<string, Artwork["category"]> = {
    Portrait: "Portrait",
    Couple: "Portrait",
    Family: "Portrait",
    Pet: "Animals",
    Automotive: "Cars",
    Other: "Portrait",
  };

  const mappedCategory = categoryMap[a.category] ?? "Portrait";

  const mediumLower = (a.medium || "").toLowerCase();

  const mappedMedium: Artwork["medium"] =
    mediumLower.includes("charcoal")
      ? "Charcoal"
      : "Graphite";

  const year = a.createdAt
    ? new Date(a.createdAt).getFullYear()
    : new Date().getFullYear();

  return {
    id: a._id,
    title: a.title,
    category: mappedCategory,
    medium: mappedMedium,
    mediumDetail: a.medium || "Graphite on Archival Paper",
    paperSize: a.paperSize || "A3 · 297 × 420 mm",
    image: assetUrl(a.image),
    description: a.description || "",
    popularity: a.featured ? 100 : 0,
    year,
    fit: mappedCategory === "Cars" ? "contain" : "cover",
  };
}

function PortfolioPage() {
  const { tr } = useLang();

  const [mongoArtworks, setMongoArtworks] = useState<Artwork[]>([]);
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
    let mounted = true;

    async function loadMongoArtworks() {
      try {
        const { data } = await api.get("/artworks", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        if (!mounted) return;

        const items: ApiArtwork[] = Array.isArray(data?.items)
          ? data.items
          : [];

        const mapped = items.map(mapApiArtwork);

        setMongoArtworks(mapped);
      } catch (error) {
        console.error(
          "Failed to load portfolio artworks:",
          error
        );

        if (mounted) {
          setMongoArtworks([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMongoArtworks();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);

    return () => clearTimeout(t);
  }, []);

  const allArtworks = useMemo(() => {
    return [...artworks, ...mongoArtworks];
  }, [mongoArtworks]);

  const filtered = useMemo(() => {
    const list = allArtworks.filter((a) => {
      const matchCat =
        cat === "All" || a.category === cat;

      const matchMed =
        med === "All" || a.medium === med;

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

      return (
        b.year - a.year ||
        b.popularity - a.popularity
      );
    });
  }, [allArtworks, q, cat, med, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paged = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const active =
    lightbox !== null
      ? paged[lightbox]
      : undefined;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
          i === null
            ? i
            : (i + 1) % paged.length
        );
      }

      if (e.key === "ArrowLeft") {
        setZoomed(false);

        setLightbox((i) =>
          i === null
            ? i
            : (i - 1 + paged.length) %
              paged.length
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

          {Array.from({
            length: totalPages,
          }).map((_, i) => (
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
          ))}

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

      {/* LIGHTBOX */}
      {active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/95 p-2 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          onClick={() => {
            setLightbox(null);
            setZoomed(false);
          }}
        >
          {/* PREVIOUS */}
          <button
            type="button"
            className="absolute left-2 top-1/2 z-[10001] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/80 text-white/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:left-7 sm:h-11 sm:w-11"
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
            <ChevronLeft
              size={19}
              strokeWidth={1.8}
            />
          </button>

          {/* NEXT */}
          <button
            type="button"
            className="absolute right-2 top-1/2 z-[10001] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/80 text-white/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:right-7 sm:h-11 sm:w-11"
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
            <ChevronRight
              size={19}
              strokeWidth={1.8}
            />
          </button>

          {/* MAIN MODAL */}
          <div
            className="relative isolate mt-8 flex h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-2xl sm:mt-6 sm:h-[86vh] sm:rounded-3xl md:mt-0 md:h-auto md:max-h-[88vh] md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              type="button"
              className="absolute right-3 top-3 z-[10010] grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/90 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-white/10 hover:text-gold-light sm:right-5 sm:top-5"
              onClick={() => {
                setLightbox(null);
                setZoomed(false);
              }}
              aria-label={tr("Close preview")}
            >
              <X
                size={19}
                strokeWidth={1.8}
              />
            </button>

            {/* ARTWORK AREA */}
            <div className="relative flex min-h-0 w-full shrink-0 items-center justify-center overflow-hidden bg-black/30 px-6 pb-4 pt-10 sm:px-12 sm:pb-6 sm:pt-14 md:min-h-0 md:flex-1 md:px-8 md:py-8 md:pr-14 lg:px-10 lg:pr-16">
              <div
                className={`flex h-full w-full items-center justify-center overflow-auto rounded-2xl ${
                  zoomed
                    ? "touch-pan-x touch-pan-y"
                    : ""
                }`}
              >
                <img
                  src={active.image}
                  alt={`${active.title} — hand-drawn by Paras Arts`}
                  onClick={() =>
                    setZoomed((z) => !z)
                  }
                  className={`block max-h-full max-w-full rounded-2xl object-contain shadow-luxe transition-transform duration-500 ${
                    zoomed
                      ? "scale-[1.35] cursor-zoom-out sm:scale-[1.5]"
                      : "scale-100 cursor-zoom-in"
                  }`}
                />
              </div>

              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase text-white/40 backdrop-blur md:hidden">
                {zoomed
                  ? tr("Tap image to zoom out")
                  : tr("Tap image to zoom")}
              </div>
            </div>

            {/* INFORMATION AREA */}
            <div className="min-h-0 w-full flex-1 overflow-y-auto border-t border-white/10 p-6 pt-6 md:flex-none md:w-[38%] md:border-l md:border-t-0 md:p-7 md:pt-14 lg:w-[390px] lg:p-10 lg:pt-16">
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                {active.category} · {active.medium}
              </div>

              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                {active.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5">
                {active.description}
              </p>

              <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6">
                <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {tr("Medium")}
                </div>

                <div className="mt-2 text-sm leading-6 text-white/80">
                  {active.mediumDetail}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setZoomed((z) => !z)
                  }
                  className="btn-ghost-gold w-full justify-center text-sm sm:w-auto"
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
                  className="btn-gold w-full justify-center text-sm sm:w-auto"
                >
                  {tr("Order a Custom Sketch")}
                  <ArrowRight size={14} />
                </Link>
              </div>

              <p className="mt-5 text-center text-[10px] tracking-[0.15em] uppercase text-white/30 sm:text-left">
                {tr("Click the artwork to zoom")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}