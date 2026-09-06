import { createFileRoute, Link } from "@tanstack/react-router";

import { useEffect, useState } from "react";

import {
  ArrowRight,
  Brush,
  Car,
  Clock,
  Heart,
  PawPrint,
  Users,
} from "lucide-react";

import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";
import art5 from "@/assets/art-5.jpg";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";
import { api, assetUrl } from "@/lib/api";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Paras Arts" },
      {
        name: "description",
        content:
          "Custom, couple, family, pet and automotive pencil commissions by Paras Arts, with transparent A4, A3 and A2 pricing.",
      },
      {
        property: "og:title",
        content: "Services & Pricing — Paras Arts",
      },
      {
        property: "og:description",
        content:
          "Signature commissions and transparent pricing by Paras Arts.",
      },
    ],
  }),
  component: ServicesPage,
});

export const PAGE_SIZES = [
  {
    key: "A4",
    label: "A4",
    dims: "210 × 297 mm",
    add: 0,
  },
  {
    key: "A3",
    label: "A3",
    dims: "297 × 420 mm",
    add: 2000,
  },
  {
    key: "A2",
    label: "A2",
    dims: "420 × 594 mm",
    add: 4000,
  },
] as const;

type SizeKey = (typeof PAGE_SIZES)[number]["key"];

type Service = {
  _id: string;
  title: string;
  description: string;
  priceFrom: number;
  icon?: string;
  image?: string;
  delivery?: string;
};

type DisplayService = Service & {
  fallbackImage: string;
  fit: "cover" | "contain";
};

const ICONS = {
  Brush,
  Heart,
  Users,
  PawPrint,
  Car,
};

const FALLBACK_IMAGES: Record<string, string> = {
  "Custom Portrait": art1,
  "Couple Portrait": art2,
  "Car / Motorsports Sketch": art3,
  "Pet Portrait": art4,
  "Family Portrait": art5,
};

const FITS: Record<string, "cover" | "contain"> = {
  "Car / Motorsports Sketch": "contain",
};

const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN")}`;

function ServicesPage() {
  const { tr } = useLang();

  const [size, setSize] = useState<SizeKey>("A4");

  const [services, setServices] =
    useState<DisplayService[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const add =
    PAGE_SIZES.find((s) => s.key === size)!.add;

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError(false);

        const { data } = await api.get("/services");

        const databaseServices: Service[] =
          data.items || [];

        const mappedServices: DisplayService[] =
          databaseServices.map((service) => ({
            ...service,

            fallbackImage:
              FALLBACK_IMAGES[service.title] || art1,

            fit:
              FITS[service.title] || "cover",
          }));

        setServices(mappedServices);
      } catch (err) {
        console.error(
          "Failed to load services:",
          err
        );

        setError(true);

        // Keep the existing services visible
        // if the backend is temporarily unavailable.
        setServices([
          {
            _id: "fallback-1",
            title: "Custom Portrait",
            description:
              "A single-subject hyper-realistic portrait — the flagship commission. Perfect for gifting, memorials or personal legacy.",
            priceFrom: 1000,
            icon: "Brush",
            delivery: "3–5 weeks",
            image: "",
            fallbackImage: art1,
            fit: "cover",
          },
          {
            _id: "fallback-2",
            title: "Couple Portrait",
            description:
              "Two figures composed with intimacy and grace. Popular for weddings, anniversaries and engagements.",
            priceFrom: 3000,
            icon: "Heart",
            delivery: "4–6 weeks",
            image: "",
            fallbackImage: art2,
            fit: "cover",
          },
          {
            _id: "fallback-3",
            title: "Family Portrait",
            description:
              "A multi-figure heirloom piece with careful composition and shared tonal harmony.",
            priceFrom: 5000,
            icon: "Users",
            delivery: "5–8 weeks",
            image: "",
            fallbackImage: art5,
            fit: "cover",
          },
          {
            _id: "fallback-4",
            title: "Pet Portrait",
            description:
              "The character of your companion, drawn with the same reverence we bring to any portrait.",
            priceFrom: 2000,
            icon: "PawPrint",
            delivery: "3–5 weeks",
            image: "",
            fallbackImage: art4,
            fit: "cover",
          },
          {
            _id: "fallback-5",
            title: "Car / Motorsports Sketch",
            description:
              "Chrome, carbon and reflection rendered in exacting detail — a modern collector's piece.",
            priceFrom: 4000,
            icon: "Car",
            delivery: "4–6 weeks",
            image: "",
            fallbackImage: art3,
            fit: "contain",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeader
        eyebrow={tr("Services & Pricing")}
        title={tr("Every piece, handmade to last.")}
        description={tr(
          "Every service below is a private commission — never a print, never digital. Choose your page size and the starting price updates instantly."
        )}
      />

      {/* PAGE SIZE SELECTOR */}
      <div className="mt-10 flex flex-col items-center gap-4 lg:mt-14">
        <span className="text-[10px] tracking-[0.35em] uppercase text-gold-light">
          {tr("Select page size")}
        </span>

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
                <span className="block text-sm font-medium tracking-[0.15em]">
                  {s.label}
                </span>

                <span
                  className={`mt-0.5 block text-[10px] tracking-[0.12em] ${
                    active
                      ? "text-[#121212]/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.dims}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          {size === "A4"
            ? tr("Base size")
            : `${tr(
                "A4 base price +"
              )} ${inr(add)} ${tr(
                "for"
              )} ${size}`}
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-16 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <div className="aspect-[16/10] animate-pulse bg-white/[0.05]" />

              <div className="space-y-4 p-6 sm:p-8">
                <div className="h-7 w-2/3 animate-pulse rounded bg-white/[0.05]" />

                <div className="h-16 animate-pulse rounded bg-white/[0.05]" />

                <div className="h-10 animate-pulse rounded bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SERVICE CARDS */}
      {!loading && (
        <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
          {services.map((s, i) => {
            const Icon =
              ICONS[
                s.icon as keyof typeof ICONS
              ] || Brush;

            const imageSrc = s.image
              ? assetUrl(s.image)
              : s.fallbackImage;

            const calculatedPrice =
              s.priceFrom + add;

            return (
              <Reveal
                key={s._id}
                delay={i * 60}
              >
                <div className="group flex h-full flex-col overflow-hidden card-luxe">
                  <div className="aspect-[16/10] overflow-hidden bg-[#0e0e0e]">
                    <img
                      src={imageSrc}
                      alt={`${s.title} — hand-drawn pencil sketch by Paras Arts`}
                      loading="lazy"
                      className={`h-full w-full transition-transform duration-[1.4s] group-hover:scale-105 ${
                        s.fit === "contain"
                          ? "object-contain p-2"
                          : "object-cover"
                      }`}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-[#121212]">
                        <Icon size={18} />
                      </span>

                      <h3 className="font-display text-2xl leading-tight sm:text-[26px]">
                        {tr(s.title)}
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/75">
                      {tr(s.description)}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                      <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                          {size} ·{" "}
                          {tr("Starts")}
                        </div>

                        <div className="mt-1 font-display text-2xl text-gold-gradient">
                          {inr(
                            calculatedPrice
                          )}
                          +
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                          {tr("Delivery")}
                        </div>

                        <div className="mt-1.5 flex items-center gap-2 text-sm text-white/80">
                          <Clock
                            size={14}
                            className="text-gold"
                          />

                          {s.delivery ||
                            "Contact us"}
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/order"
                      search={{
                        service: s.title,
                        size,
                      }}
                      className="btn-gold mt-7 w-full justify-center"
                    >
                      {tr("Order Now")}

                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* BACKEND ERROR NOTICE */}
      {error && (
        <div className="mt-6 text-center text-xs text-muted-foreground">
          {tr(
            "Showing the latest available services."
          )}
        </div>
      )}

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center sm:p-10">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold-light">
          {tr("Note")}
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {tr(
            "Prices may increase depending on the image and its complexity."
          )}
        </p>
      </div>

      <div className="mt-10 rounded-3xl gold-border p-8 text-center sm:p-14">
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl">
          {tr(
            "Not sure which service fits?"
          )}
        </h3>

        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          {tr(
            "Share your idea — we'll recommend the size, medium and timeline that best honours it."
          )}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/contact"
            className="btn-ghost-gold justify-center"
          >
            {tr("Talk to us")}
          </Link>

          <Link
            to="/order"
            className="btn-gold justify-center"
          >
            {tr("Order a sketch")}
          </Link>
        </div>
      </div>
    </div>
  );
}