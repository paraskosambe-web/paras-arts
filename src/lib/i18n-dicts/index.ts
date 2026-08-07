/**
 * Phrase dictionaries for the site-wide language converter.
 *
 * Each entry is keyed by the exact English source string and maps to its
 * Hindi (hi) and Marathi (mr) translation. Missing entries fall back to English.
 * Page-level dictionaries live in sibling files so they can grow independently.
 */
export type Phrase = { hi: string; mr: string };
export type PhraseDict = Record<string, Phrase>;

import { commonPhrases } from "./common";
import { homePhrases } from "./home";
import { aboutPhrases } from "./about";
import { servicesPhrases } from "./services";
import { portfolioPhrases } from "./portfolio";
import { orderPhrases } from "./order";
import { contactPhrases } from "./contact";
import { faqPhrases } from "./faq";
import { testimonialsPhrases } from "./testimonials";
import { trackPhrases } from "./track";

export const PHRASES: PhraseDict = {
  ...commonPhrases,
  ...homePhrases,
  ...aboutPhrases,
  ...servicesPhrases,
  ...portfolioPhrases,
  ...orderPhrases,
  ...contactPhrases,
  ...faqPhrases,
  ...testimonialsPhrases,
  ...trackPhrases,
};
