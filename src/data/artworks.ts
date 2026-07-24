import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";
import art5 from "@/assets/art-5.jpg";
import art6 from "@/assets/art-6.jpg";

export type Artwork = {
  id: string;
  title: string;
  category: "Portrait" | "Couple" | "Family" | "Pet" | "Automotive";
  medium: string;
  paperSize: string;
  image: string;
  description: string;
};

export const artworks: Artwork[] = [
  {
    id: "silhouette-of-grace",
    title: "Silhouette of Grace",
    category: "Portrait",
    medium: "Graphite on Archival Paper",
    paperSize: "A3 · 297 × 420 mm",
    image: art1,
    description:
      "A study in restraint and light. Every strand of hair is rendered with fine 2H layering, while the eyes anchor the composition with quiet intensity.",
  },
  {
    id: "an-embrace-in-charcoal",
    title: "An Embrace in Charcoal",
    category: "Couple",
    medium: "Charcoal & Graphite",
    paperSize: "A2 · 420 × 594 mm",
    image: art2,
    description:
      "Commissioned for an anniversary, this piece captures the softness of shared silence — a heirloom rendered by hand over 42 hours.",
  },
  {
    id: "midnight-machine",
    title: "Midnight Machine",
    category: "Automotive",
    medium: "Graphite & Ink",
    paperSize: "A2 · 420 × 594 mm",
    image: art3,
    description:
      "A hyper-detailed rendering of chrome, carbon, and reflection. Ideal for collectors who wish to immortalise their finest machine.",
  },
  {
    id: "faithful-companion",
    title: "Faithful Companion",
    category: "Pet",
    medium: "Graphite on Bristol Paper",
    paperSize: "A4 · 210 × 297 mm",
    image: art4,
    description:
      "The soul of a beloved friend — captured in every subtle fur direction, whisker, and gentle glance.",
  },
  {
    id: "family-heirloom",
    title: "Family Heirloom",
    category: "Family",
    medium: "Graphite Ensemble Study",
    paperSize: "A2 · 420 × 594 mm",
    image: art5,
    description:
      "A commissioned four-figure composition designed to be passed through generations. Framed in solid oak on request.",
  },
  {
    id: "weathered-wisdom",
    title: "Weathered Wisdom",
    category: "Portrait",
    medium: "Graphite Realism",
    paperSize: "A3 · 297 × 420 mm",
    image: art6,
    description:
      "A character study exploring the language of time — pored, layered, and finished with a museum-grade fixative.",
  },
];

export const categories = ["All", "Portrait", "Couple", "Family", "Pet", "Automotive"] as const;
