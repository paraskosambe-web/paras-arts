import gThor from "@/assets/thor.jpeg";
import gStrange from "@/assets/strange.jpeg";
import gKrishna from "@/assets/krishna.jpeg";
import gGanesha from "@/assets/ganesha.jpeg";
import gGaneshaTurban from "@/assets/ganpati1.jpeg";
import gChild from "@/assets/krishna1.jpeg";
import gBmw from "@/assets/bmw.jpeg";
import gPorsche from "@/assets/porsche.jpeg";
import gRonaldo from "@/assets/ronaldo.jpeg";

export type Category = "Portrait" | "Cars" | "Animals" | "Devotional";
export type Medium = "Graphite" | "Charcoal";

export type Artwork = {
  id: string;
  title: string;
  category: Category;
  medium: Medium;
  mediumDetail: string;
  paperSize: string;
  image: string;
  description: string;
  /** Higher = more popular; used by the "Popular" sort. */
  popularity: number;
  /** Newest first ordering weight. */
  year: number;
  /** Wide subjects (cars) must not be cropped — render them contained. */
  fit?: "cover" | "contain";
};

export const artworks: Artwork[] = [
  {
    id: "the-god-of-thunder",
    title: "The God of Thunder",
    category: "Portrait",
    medium: "Graphite",
    mediumDetail: "Graphite on Archival Paper",
    paperSize: "A3 · 297 × 420 mm",
    image: gThor,
    description:
      "A cinematic character study built in fine 2H layers, with charcoal deepening the armour and storm-lit shadows.",
    popularity: 96,
    year: 2025,
  },
  {
    id: "shree-ganesha",
    title: "Shree Ganesha",
    category: "Devotional",
    medium: "Graphite",
    mediumDetail: "Graphite on 300gsm Archival Paper",
    paperSize: "A3 · 297 × 420 mm",
    image: gGanesha,
    description:
      "A devotional commission rendered with patient tonal work — ornament, cloth and gaze balanced in soft graphite.",
    popularity: 92,
    year: 2025,
  },
  {
    id: "porsche-gt3",
    title: "Porsche GT3",
    category: "Cars",
    medium: "Graphite",
    mediumDetail: "Graphite & Ink",
    paperSize: "A2 · 420 × 594 mm",
    image: gPorsche,
    description:
      "Chrome, carbon and reflection rendered in hyper-detail — a collector's piece for a favourite machine.",
    popularity: 88,
    year: 2025,
    fit: "contain",
  },
  {
    id: "bal-krishna",
    title: "Bal Krishna",
    category: "Devotional",
    medium: "Charcoal",
    mediumDetail: "Charcoal & Graphite",
    paperSize: "A3 · 297 × 420 mm",
    image: gKrishna,
    description:
      "Charcoal softness across skin and jewellery, finished with graphite highlights for a luminous, serene face.",
    popularity: 85,
    year: 2024,
  },
  {
    id: "Multiverse-Master",
    title: "Dr. Strange",
    category: "Portrait",
    medium: "Charcoal",
    mediumDetail: "Charcoal on Bristol Paper",
    paperSize: "A3 · 297 × 420 mm",
    image: gStrange,
    description:
      "High-contrast charcoal portraiture — every strand of beard and fold of cloth drawn by hand over many sittings.",
    popularity: 81,
    year: 2024,
  },
  {
    id: "bmw-m4",
    title: "BMW M4",
    category: "Cars",
    medium: "Graphite",
    mediumDetail: "Graphite & Ink",
    paperSize: "A2 · 420 × 594 mm",
    image: gBmw,
    description:
      "An automotive study of hard edges and mirrored light, drawn from the owner's own photographs.",
    popularity: 79,
    year: 2024,
    fit: "contain",
  },
  {
    id: "krishna with kamdhenu",
    title: "Krishna1",
    category: "Portrait",
    medium: "Graphite",
    mediumDetail: "Graphite on Archival Paper",
    paperSize: "A4 · 210 × 297 mm",
    image: gChild,
    description:
      "Charcoal and graphite softness across skin and jewellery, finished with charcoal highlights.",
    popularity: 74,
    year: 2024,
  },
  {
    id: "ganpati-bappa",
    title: "Ganpati Bappa",
    category: "Devotional",
    medium: "Graphite",
    mediumDetail: "Graphite on Archival Paper",
    paperSize: "A3 · 297 × 420 mm",
    image: gGaneshaTurban,
    description:
      "A regal devotional study — turban texture, embroidery and expression built up in dozens of graphite passes.",
    popularity: 71,
    year: 2023,
  },
  {
    id: "cristiano-ronaldo",
    title: "Cristiano Ronaldo",
    category: "Portrait",
    medium: "Graphite",
    mediumDetail: "Graphite Realism",
    paperSize: "A3 · 297 × 420 mm",
    image: gRonaldo,
    description:
      "A sporting portrait focused on likeness and intensity — skin tone graded from 2H through 6B.",
    popularity: 68,
    year: 2023,
  },
];

export const categories = ["All", "Portrait", "Cars", "Animals", "Devotional"] as const;
export const mediums = ["All", "Graphite", "Charcoal"] as const;
export const sorts = ["Newest", "Popular", "A–Z"] as const;

export function findArtwork(id: string) {
  return artworks.find((a) => a.id === id);
}
