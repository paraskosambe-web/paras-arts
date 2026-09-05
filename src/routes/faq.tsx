import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useLang } from "@/lib/i18n";
import { api } from "@/lib/api";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Paras Arts" },
      {
        name: "description",
        content: "Answers to frequently asked questions about Paras Arts commissions.",
      },
      { property: "og:title", content: "FAQ — Paras Arts" },
      {
        property: "og:description",
        content:
          "Everything you need to know before commissioning a Paras Arts piece.",
      },
    ],
  }),
  component: FAQPage,
});

const fallbackGroups = [
  {
    title: "Commissions",
    items: [
      {
        q: "How long does a commission take?",
        a: "Typical delivery is 3 to 6 weeks depending on complexity, size and current studio queue. Rush service is available on request.",
      },
      {
        q: "How do I begin?",
        a: "Fill out the Order Sketch form. The studio will reply within 24 hours to confirm composition, timeline and pricing.",
      },
      {
        q: "Can you draw from multiple photographs?",
        a: "Yes — we routinely blend references to produce the ideal composition, especially for family portraits or restorations.",
      },
    ],
  },
  {
    title: "Materials & Delivery",
    items: [
      {
        q: "What paper and pencils do you use?",
        a: "Fabriano and Strathmore archival papers with Faber-Castell, Staedtler, and Caran d'Ache artist-grade graphite. Every piece is finished with archival fixative.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes. Foam-mounted, moisture-sealed and shipped fully insured worldwide with tracking.",
      },
      {
        q: "Can I get the piece framed?",
        a: "Framing in oak or walnut is available on request, quoted separately based on size.",
      },
    ],
  },
  {
    title: "Payments & Revisions",
    items: [
      {
        q: "How does payment work?",
        a: "A 50% booking amount reserves your slot. The remainder is due once you approve the digital proof, before dispatch.",
      },
      {
        q: "Can I request revisions?",
        a: "Two rounds of refinement are included at the proof stage. Structural changes are best resolved at reference approval.",
      },
      {
        q: "Do you offer refunds?",
        a: "Booking amounts are non-refundable once work begins, but we will always work with you to arrive at a piece you love.",
      },
    ],
  },
];

type FAQItemType = {
  q: string;
  a: string;
};

type FAQGroup = {
  title: string;
  items: FAQItemType[];
};

type ApiFAQ = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
};

function FAQItem({ q, a }: FAQItemType) {
  const { tr } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-white/10 transition-colors ${
        open ? "bg-white/[0.02]" : ""
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left"
      >
        <span className="font-display text-lg md:text-xl">{tr(q)}</span>

        <ChevronDown
          className={`shrink-0 text-gold-light transition-transform ${
            open ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      <div
        className={`grid overflow-hidden px-6 transition-all duration-500 ${
          open
            ? "grid-rows-[1fr] pb-6 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tr(a)}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  const { tr } = useLang();

  const [groups, setGroups] = useState<FAQGroup[]>(fallbackGroups);

  useEffect(() => {
    let mounted = true;

    async function loadFAQs() {
      try {
        const { data } = await api.get("/faqs");

        const items: ApiFAQ[] = Array.isArray(data?.items)
          ? data.items
          : [];

        if (!items.length) {
          return;
        }

        const categoryOrder = [
          "Commissions",
          "Materials & Delivery",
          "Payments & Revisions",
        ];

        const grouped: FAQGroup[] = categoryOrder.map((category) => ({
          title: category,
          items: items
            .filter((item) => item.category === category)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => ({
              q: item.question,
              a: item.answer,
            })),
        }));

        const hasFAQs = grouped.some((group) => group.items.length > 0);

        if (hasFAQs && mounted) {
          setGroups(grouped);
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      }
    }

    loadFAQs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow={tr("Answered")}
        title={tr("Frequently asked questions")}
        description={tr(
          "Everything you'd like to know before commissioning your first piece."
        )}
      />

      <div className="mt-16 space-y-10">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-4 text-[11px] tracking-[0.4em] uppercase text-gold-light">
              {tr(g.title)}
            </h3>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.01]">
              {g.items.map((i) => (
                <FAQItem key={i.q} q={i.q} a={i.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          {tr("Still have a question?")}
        </p>

        <Link to="/contact" className="btn-gold mt-4">
          {tr("Contact the studio")}
        </Link>
      </div>
    </div>
  );
}