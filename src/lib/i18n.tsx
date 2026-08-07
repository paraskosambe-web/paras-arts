import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PHRASES } from "./i18n-dicts";

export type Lang = "en" | "hi" | "mr";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मरा" },
];

const STORAGE_KEY = "paras_arts_lang";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.portfolio": "Portfolio",
  "nav.services": "Services",
  "nav.testimonials": "Testimonials",
  "nav.track": "Track",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.order": "Order Sketch",
  "nav.language": "Language",
  "hero.badge": "A Luxury Pencil-Art Atelier",
  "hero.title1": "The art of",
  "hero.titleItalic": "stillness",
  "hero.title2": ", drawn by hand.",
  "hero.sub":
    "Paras Arts crafts museum-grade hyper-realistic pencil portraits — commissioned pieces for those who prefer their memories rendered with a lifetime of care.",
  "hero.cta1": "Commission a Sketch",
  "hero.cta2": "View the Portfolio",
  "hero.stat1": "Commissions",
  "hero.stat2": "Countries",
  "hero.stat3": "Studio",
  "footer.studio": "Studio",
  "footer.explore": "Explore",
  "chat.title": "Studio Assistant",
  "chat.status": "online",
  "chat.new": "New",
  "chat.placeholder": "Ask about pricing, delivery, materials…",
  "chat.thinking": "Thinking…",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.about": "परिचय",
  "nav.portfolio": "पोर्टफ़ोलियो",
  "nav.services": "सेवाएँ",
  "nav.testimonials": "प्रशंसापत्र",
  "nav.track": "ट्रैक",
  "nav.faq": "सामान्य प्रश्न",
  "nav.contact": "संपर्क",
  "nav.order": "स्केच ऑर्डर करें",
  "nav.language": "भाषा",
  "hero.badge": "एक लक्ज़री पेंसिल-आर्ट स्टूडियो",
  "hero.title1": "हाथ से बनी",
  "hero.titleItalic": "शांति",
  "hero.title2": " की कला।",
  "hero.sub":
    "पारस आर्ट्स संग्रहालय-स्तरीय हाइपर-रियलिस्टिक पेंसिल पोर्ट्रेट बनाता है — उन लोगों के लिए जो अपनी यादों को जीवनभर की देखभाल के साथ संजोना चाहते हैं।",
  "hero.cta1": "स्केच ऑर्डर करें",
  "hero.cta2": "पोर्टफ़ोलियो देखें",
  "hero.stat1": "कमीशन",
  "hero.stat2": "देश",
  "hero.stat3": "स्टूडियो",
  "footer.studio": "स्टूडियो",
  "footer.explore": "खोजें",
  "chat.title": "स्टूडियो सहायक",
  "chat.status": "ऑनलाइन",
  "chat.new": "नया",
  "chat.placeholder": "कीमत, डिलीवरी, सामग्री के बारे में पूछें…",
  "chat.thinking": "सोच रहे हैं…",
};

const mr: Dict = {
  "nav.home": "मुख्यपृष्ठ",
  "nav.about": "आमच्याबद्दल",
  "nav.portfolio": "पोर्टफोलिओ",
  "nav.services": "सेवा",
  "nav.testimonials": "अभिप्राय",
  "nav.track": "ट्रॅक",
  "nav.faq": "प्रश्नोत्तरे",
  "nav.contact": "संपर्क",
  "nav.order": "स्केच ऑर्डर करा",
  "nav.language": "भाषा",
  "hero.badge": "एक लक्झरी पेन्सिल-आर्ट स्टुडिओ",
  "hero.title1": "हातांनी रेखाटलेली",
  "hero.titleItalic": "शांतता",
  "hero.title2": " ची कला.",
  "hero.sub":
    "पारस आर्ट्स संग्रहालय-दर्जाची हायपर-रिअॅलिस्टिक पेन्सिल पोर्ट्रेट्स तयार करते — ज्यांना आपल्या आठवणी आयुष्यभराच्या काळजीने जपायच्या आहेत त्यांच्यासाठी.",
  "hero.cta1": "स्केच ऑर्डर करा",
  "hero.cta2": "पोर्टफोलिओ पहा",
  "hero.stat1": "कमिशन",
  "hero.stat2": "देश",
  "hero.stat3": "स्टुडिओ",
  "footer.studio": "स्टुडिओ",
  "footer.explore": "एक्सप्लोर",
  "chat.title": "स्टुडिओ सहाय्यक",
  "chat.status": "ऑनलाइन",
  "chat.new": "नवीन",
  "chat.placeholder": "किंमत, डिलिव्हरी, साहित्याबद्दल विचारा…",
  "chat.thinking": "विचार करत आहे…",
};

const DICTS: Record<Lang, Dict> = { en, hi, mr };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Key-based lookup (legacy keys such as "nav.home"). */
  t: (key: string) => string;
  /** English-source lookup: tr("Order Now") → translated string, falls back to English. */
  tr: (english: string) => string;
};

/** Collapse newlines/indentation so JSX multi-line strings match dictionary keys. */
function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => en[k] ?? k,
  tr: (s) => s,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && saved in DICTS) {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const t = useCallback((key: string) => DICTS[lang][key] ?? en[key] ?? key, [lang]);

  const tr = useCallback(
    (english: string) => {
      if (lang === "en") return english;
      const entry = PHRASES[english] ?? PHRASES[normalize(english)];
      return entry?.[lang] ?? english;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t, tr }), [lang, setLang, t, tr]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
