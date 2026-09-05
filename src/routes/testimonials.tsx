import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useLang } from "@/lib/i18n";
import { api, assetUrl } from "@/lib/api";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Paras Arts" },
      {
        name: "description",
        content: "What clients say about their Paras Arts commissions.",
      },
      { property: "og:title", content: "Testimonials — Paras Arts" },
      {
        property: "og:description",
        content: "Reviews from Paras Arts collectors around the world.",
      },
    ],
  }),
  component: TestimonialsPage,
});

const fallbackReviews = [
  {
    n: "Ananya R.",
    role: "Mumbai · Custom Portrait",
    text: "The portrait of my late father brought tears to the entire family. Every line felt sacred — the studio's care is evident in every detail.",
    rating: 5,
  },
  {
    n: "Dr. Karan M.",
    role: "London · Car Sketch",
    text: "Extraordinary attention to detail. The sketch of my father-in-law's Porsche is our most prized gift. Framed and hung above his study.",
    rating: 5,
  },
  {
    n: "Priya & Rohan",
    role: "Bangalore · Couple Portrait",
    text: "Our anniversary sketch is the centrepiece of our home. It is understated, timeless, and utterly personal.",
    rating: 5,
  },
  {
    n: "Alessandra G.",
    role: "Milan · Pet Portrait",
    text: "I have never seen a drawing of my dog that felt so alive. Paras Arts captured her expression exactly.",
    rating: 5,
  },
  {
    n: "Vikram S.",
    role: "Delhi · Family Portrait",
    text: "A four-figure family portrait, drawn with balance and grace. The composition alone is museum-worthy.",
    rating: 5,
  },
  {
    n: "Sarah K.",
    role: "New York · Custom Portrait",
    text: "The shipping was pristine, the piece even better. This will be handed down through generations.",
    rating: 5,
  },
];

type Review = {
  id?: string;
  n: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
};

type ApiTestimonial = {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  rating?: number;
  image?: string;
};

function TestimonialsPage() {
  const { tr } = useLang();

  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    let mounted = true;

    async function loadTestimonials() {
      try {
        const { data } = await api.get("/testimonials");

        const items: ApiTestimonial[] = Array.isArray(data?.items)
          ? data.items
          : [];

        if (!items.length) {
          return;
        }

        const databaseReviews: Review[] = items.map((item) => ({
          id: item._id,
          n: item.name,
          role: item.location || "Paras Arts Collector",
          text: item.quote,
          rating: Math.min(5, Math.max(1, item.rating ?? 5)),
          image: item.image,
        }));

        if (mounted) {
          setReviews(databaseReviews);
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      }
    }

    loadTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow={tr("Praise")}
        title={tr("Kind words from collectors")}
        description={tr(
          "Reviews from clients across three continents — each commission reflected back in their own words."
        )}
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, index) => (
          <div
            key={r.id ?? `${r.n}-${index}`}
            className="card-luxe p-8"
          >
            <Quote size={28} className="text-gold" />

            <p className="mt-6 leading-relaxed text-white/85">
              "{tr(r.text)}"
            </p>

            <div className="mt-8 flex items-center gap-1 text-gold">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill="currentColor"
                />
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-sm tracking-[0.25em] uppercase text-gold-light">
                {r.n}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {tr(r.role)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}