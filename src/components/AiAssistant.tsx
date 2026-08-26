import { useEffect, useRef, useState } from "react";

import { MessageCircle, X, Send, Loader2 } from "lucide-react";

import ReactMarkdown from "react-markdown";

import logoMark from "@/assets/logo.png";

import { SITE, whatsappUrl } from "@/lib/site";

import { useLang } from "@/lib/i18n";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "paras_arts_chat_v1";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to **Paras Arts**. I can help with pricing, sketch types, materials, the order process, delivery, payments, contact information, FAQs and website features. What would you like to know?",
};

const SUGGESTIONS = [
  "What does a portrait cost?",
  "How long is delivery?",
  "How does the order process work?",
  "What paper and pencils do you use?",
];

/* =========================================================
   PARAS ARTS LOCAL KNOWLEDGE
   ========================================================= */

function getLocalAnswer(question: string): string {
  const q = question.toLowerCase().trim();

  /* ---------------------------------------------------------
     GREETING
     --------------------------------------------------------- */

  if (
    /^(hi|hello|hey|hii|helo|namaste|good morning|good afternoon|good evening)[!. ]*$/.test(
      q
    )
  ) {
    return `Hello! 👋

Welcome to **Paras Arts**.

I can help you with:

- 🎨 Custom sketches
- 💰 Pricing
- 📐 A4, A3 and A2 sizes
- ✏️ Graphite, charcoal and carbon materials
- 📝 Order form
- 💳 ₹200 order payment
- 📦 Delivery information
- 📱 Contact details
- ❓ FAQs
- 🌐 English, Hindi and Marathi language options
- 🖼️ Portfolio and artwork categories

What would you like to know?`;
  }

  /* ---------------------------------------------------------
     WHO IS PARAS / ABOUT PARAS
     --------------------------------------------------------- */

  if (
    q.includes("who is paras") ||
    q.includes("who is paras kosambe") ||
    q.includes("about paras kosambe") ||
    q.includes("tell me about paras") ||
    q.includes("artist paras") ||
    q.includes("paras kosambe")
  ) {
    return `**Paras Kosambe** is the artist and creator behind **Paras Arts**.

He is a sketch artist focused on detailed hand-drawn artwork and custom sketches.

His artwork explores subjects such as:

- Portraits
- Couples
- Families
- Animals
- Cars and motorsport
- Devotional artwork

Paras works with traditional drawing mediums including **graphite, charcoal and carbon pencils**.

His approach focuses on careful observation, proportion, shading, tonal detail and capturing the visual character of the reference subject.

**Paras Arts** allows customers to commission personalized artwork based on their requirements and reference images.`;
  }

  /* ---------------------------------------------------------
     ABOUT PARAS ARTS
     --------------------------------------------------------- */

  if (
    q.includes("what is paras arts") ||
    q.includes("about paras arts") ||
    q.includes("tell me about paras arts") ||
    q.includes("paras arts website")
  ) {
    return `**Paras Arts** is a digital art portfolio and custom sketch ordering website created by artist **Paras Kosambe**.

The website allows visitors to:

- Explore the Paras Arts portfolio
- Discover different artwork categories
- Learn about custom sketch services
- View starting prices
- Submit a custom sketch request
- Provide a reference image and requirements
- Learn about the ordering process
- Read FAQs
- Contact Paras through the Contact section
- Use the AI assistant
- Change the website language

The goal is to make discovering artwork, requesting a custom sketch and communicating with the artist simple and convenient.`;
  }

  /* ---------------------------------------------------------
     CONTACT
     --------------------------------------------------------- */

  if (
    q.includes("phone") ||
    q.includes("mobile number") ||
    q.includes("contact number") ||
    q.includes("phone number")
  ) {
    return `You can contact **Paras Arts** by phone:

📞 **9137935311**

You can also use the Contact section on the website to send an enquiry.`;
  }

  if (
    q.includes("whatsapp") ||
    q.includes("whats app")
  ) {
    return `You can contact **Paras Arts** on WhatsApp:

💬 **9137935311**

You can also use the website's **Contact form** if you prefer to send an enquiry through the website.`;
  }

  if (
    q.includes("email") ||
    q.includes("email id") ||
    q.includes("mail id")
  ) {
    return `The official Paras Arts email is:

📧 **paraskosambe@gmail.com**

You can also use the Contact section on the website.`;
  }

  if (
    q.includes("instagram") ||
    q.includes("insta")
  ) {
    return `The Paras Arts Instagram account is:

📸 **@paras.arts.3313**`;
  }

  if (
    q.includes("contact form") ||
    q.includes("how to contact") ||
    q.includes("contact paras")
  ) {
    return `You can contact Paras Arts through the website's **Contact section**.

### How to contact through the website:

1. Open the **Contact** section.
2. Fill in the contact form.
3. Enter the required information.
4. Write your enquiry/message.
5. Submit the form.

This provides a convenient way to send your enquiry directly through the website.

You can also contact Paras Arts through:

📞 Phone: **9137935311**  
💬 WhatsApp: **9137935311**  
📧 Email: **paraskosambe@gmail.com**  
📸 Instagram: **@paras.arts.3313**`;
  }

  /* ---------------------------------------------------------
     LANGUAGE
     --------------------------------------------------------- */

  if (
    q.includes("language") ||
    q.includes("hindi") ||
    q.includes("marathi") ||
    q.includes("translate") ||
    q.includes("translation")
  ) {
    return `Yes! 🌐

The Paras Arts website includes a **language conversion option**.

Available languages are:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Marathi

You can use the **language selector** on the website and choose your preferred language.`;
  }

  /* ---------------------------------------------------------
     PORTFOLIO
     --------------------------------------------------------- */

  if (
    q.includes("portfolio") ||
    q.includes("art categories") ||
    q.includes("categories") ||
    q.includes("what artwork")
  ) {
    return `The **Paras Arts portfolio** showcases artwork created by Paras Kosambe.

Main artwork categories include:

- 🧑 Portraits
- 🚗 Cars
- 🐾 Animals
- 🙏 Devotional artwork

Custom services also include:

- Couple sketches
- Family sketches
- Pet sketches
- Car / Motorsport sketches

The portfolio showcases the artist's drawing style, technique, detail and range of subjects.`;
  }

  /* ---------------------------------------------------------
     MEDIUMS
     --------------------------------------------------------- */

  if (
    q.includes("medium") ||
    q.includes("materials") ||
    q.includes("material") ||
    q.includes("tools") ||
    q.includes("pencil")
  ) {
    return `Paras Arts works with traditional drawing mediums including **graphite, charcoal and carbon pencils**.

### Graphite

- Tombow Mono
- Staedtler
- Camlin
- Faber-Castell

### Charcoal

- Tombow Mono
- Camlin
- Apsara

### Carbon Pencil

- Conte Paris
- Koh-I-Noor

### Erasers and erasing tools

- Staedtler Plastic
- Tombow Mono Zero
- Mechanical eraser
- Kneadable eraser

Other supporting drawing tools may also be used depending on the artwork, subject, detail and technique.

The listed tools are **not necessarily all used in every artwork**.`;
  }

  /* ---------------------------------------------------------
     GRAPHITE
     --------------------------------------------------------- */

  if (
    q.includes("graphite")
  ) {
    return `Paras Arts uses graphite drawing tools including:

- **Tombow Mono**
- **Staedtler**
- **Camlin**
- **Faber-Castell**

The exact tools used can depend on the artwork and technique required.`;
  }

  /* ---------------------------------------------------------
     CHARCOAL
     --------------------------------------------------------- */

  if (
    q.includes("charcoal")
  ) {
    return `Paras Arts uses charcoal tools including:

- **Tombow Mono**
- **Camlin**
- **Apsara**

The choice of tools can depend on the artwork and technique required.`;
  }

  /* ---------------------------------------------------------
     CARBON
     --------------------------------------------------------- */

  if (
    q.includes("carbon pencil") ||
    q.includes("carbon")
  ) {
    return `Paras Arts uses carbon pencil brands including:

- **Conte Paris**
- **Koh-I-Noor**`;
  }

  /* ---------------------------------------------------------
     ERASERS
     --------------------------------------------------------- */

  if (
    q.includes("eraser") ||
    q.includes("erasing")
  ) {
    return `Paras Arts uses different erasing tools, including:

- **Staedtler Plastic**
- **Tombow Mono Zero**
- **Mechanical eraser**
- **Kneadable eraser**

Different tools may be selected depending on the artwork and level of detail required.`;
  }

  /* ---------------------------------------------------------
     PRICING - A4
     --------------------------------------------------------- */

  if (
    q.includes("a4") ||
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("cost") ||
    q.includes("how much")
  ) {
    if (
      q.includes("portrait") ||
      q.includes("portrait cost") ||
      q.includes("portrait price")
    ) {
      return `### Custom Portrait Pricing

**A4:** ₹1000+

**A3:** ₹3000+

**A2:** ₹5000+

These are **starting prices**.

The final price may increase depending on:

- Level of detail
- Complexity
- Subject
- Additional customization
- Paper size`;
    }

    if (
      q.includes("couple")
    ) {
      return `### Couple Sketch Pricing

**A4:** ₹3000+

**A3:** ₹5000+

**A2:** ₹7000+

These are starting prices and may increase depending on complexity and customization.`;
    }

    if (
      q.includes("family")
    ) {
      return `### Family Sketch Pricing

**A4:** ₹5000+

**A3:** ₹7000+

**A2:** ₹9000+

These are starting prices and may increase depending on complexity and customization.`;
    }

    if (
      q.includes("pet")
    ) {
      return `### Pet Sketch Pricing

**A4:** ₹2000+

**A3:** ₹4000+

**A2:** ₹6000+

These are starting prices and may increase depending on complexity and customization.`;
    }

    if (
      q.includes("car") ||
      q.includes("motor") ||
      q.includes("motorsport")
    ) {
      return `### Car / Motorsport Sketch Pricing

**A4:** ₹4000+

**A3:** ₹6000+

**A2:** ₹8000+

These are starting prices and may increase depending on complexity and customization.`;
    }

    return `### Paras Arts Starting Prices

| Artwork | A4 | A3 | A2 |
|---|---:|---:|---:|
| Custom Portrait | ₹1000+ | ₹3000+ | ₹5000+ |
| Couple Sketch | ₹3000+ | ₹5000+ | ₹7000+ |
| Family Sketch | ₹5000+ | ₹7000+ | ₹9000+ |
| Pet Sketch | ₹2000+ | ₹4000+ | ₹6000+ |
| Car / Motorsport | ₹4000+ | ₹6000+ | ₹8000+ |

### Size rule

**A4 = Base price**

**A3 = A4 + ₹2000**

**A2 = A4 + ₹4000**

These are starting prices. The final price may increase depending on the detail, complexity and customization required.`;
  }

  /* ---------------------------------------------------------
     SIZE
     --------------------------------------------------------- */

  if (
    q.includes("size") ||
    q.includes("a3") ||
    q.includes("a2")
  ) {
    return `Paras Arts currently offers:

- **A4**
- **A3**
- **A2**

### Size pricing

A3 = applicable A4 starting price + **₹2000**

A2 = applicable A4 starting price + **₹4000**

For example, if an artwork starts at ₹1000 for A4:

- A4 → ₹1000+
- A3 → ₹3000+
- A2 → ₹5000+

Prices are starting prices and can increase depending on complexity and customization.`;
  }

  /* ---------------------------------------------------------
     ORDER
     --------------------------------------------------------- */

  if (
    q.includes("order") ||
    q.includes("place an order") ||
    q.includes("how do i order") ||
    q.includes("how can i order") ||
    q.includes("commission")
  ) {
    return `## How to order a custom sketch

You can place a custom sketch request through the Paras Arts website.

### Step-by-step

1. Open the **Custom Sketch / Order** section.
2. Enter your **name**.
3. Enter your **mobile number**.
4. Enter your **WhatsApp number**.
5. Enter your **email address**.
6. Enter your **address**.
7. Provide/select the required **date**.
8. Upload/provide your **reference image**.
9. Select the required **sketch type**.
10. Enter your **budget**.
11. Select your **paper size** — A4, A3 or A2.
12. Add any **additional notes or requirements**.
13. Submit the form.
14. Proceed with the **₹200 payment** specified by the current website order process.

The ₹200 payment should **not** be considered the total price of the sketch. The final artwork price depends on the sketch type, size, complexity and customization.`;
  }

  /* ---------------------------------------------------------
     FORM
     --------------------------------------------------------- */

  if (
    q.includes("form") ||
    q.includes("fill") ||
    q.includes("information required") ||
    q.includes("what information")
  ) {
    return `The custom sketch order form collects:

- Name
- Mobile number
- WhatsApp number
- Address
- Date
- Reference image
- Email
- Sketch type
- Budget
- Paper size
- Additional notes

Available paper sizes:

- A4
- A3
- A2

After completing the form, submit it and proceed with the **₹200 payment** specified by the website's current order process.`;
  }

  /* ---------------------------------------------------------
     REFERENCE IMAGE
     --------------------------------------------------------- */

  if (
    q.includes("reference image") ||
    q.includes("photo") ||
    q.includes("picture")
  ) {
    return `A **reference image** helps Paras Arts understand what the custom artwork should be based on.

Whenever possible, provide a clear reference image that shows the subject and important details required for the artwork.

The website knowledge does not specify technical requirements such as a particular file size or resolution, so I won't invent any.`;
  }

  /* ---------------------------------------------------------
     PAYMENT
     --------------------------------------------------------- */

  if (
    q.includes("payment") ||
    q.includes("200") ||
    q.includes("₹200")
  ) {
    return `The current Paras Arts order process includes a **₹200 payment**.

⚠️ The ₹200 payment is **not the total price of the sketch**.

The final sketch price depends on:

- Sketch type
- Paper size
- Level of detail
- Complexity
- Customization requirements

If you're asking about a specific payment method, please use the payment option shown on the website or contact Paras Arts.`;
  }

  /* ---------------------------------------------------------
     DELIVERY
     --------------------------------------------------------- */

  if (
    q.includes("delivery") ||
    q.includes("deliver") ||
    q.includes("how long") ||
    q.includes("when will")
  ) {
    return `The exact **delivery timeline is not currently specified** in the official Paras Arts information.

I don't want to give you an incorrect number of days.

For the current delivery information, please contact Paras Arts:

📞 **9137935311**

💬 **WhatsApp: 9137935311**

You can also use the website's Contact form.`;
  }

  /* ---------------------------------------------------------
     FAQ
     --------------------------------------------------------- */

  if (
    q.includes("faq") ||
    q.includes("frequently asked")
  ) {
    return `Yes. The Paras Arts website has a dedicated **FAQ section**.

It covers common questions about:

- Artwork
- Custom sketches
- Pricing
- Materials
- Ordering
- Website features
- Contact and other customer queries

If you need further assistance, you can also use the **Contact section**.`;
  }

  /* ---------------------------------------------------------
     CUSTOM SERVICES
     --------------------------------------------------------- */

  if (
    q.includes("services") ||
    q.includes("custom sketch") ||
    q.includes("what can you draw") ||
    q.includes("what do you draw")
  ) {
    return `Paras Arts provides personalized custom sketch services.

Artwork categories include:

- Custom Portrait
- Couple Sketch
- Family Sketch
- Pet Sketch
- Car / Motorsport Sketch
- Animal artwork
- Devotional artwork

The artwork is created according to the customer's requirements and reference image.`;
  }

  /* ---------------------------------------------------------
     WEBSITE FEATURES
     --------------------------------------------------------- */

  if (
    q.includes("website") ||
    q.includes("features") ||
    q.includes("what can i do")
  ) {
    return `The Paras Arts website allows visitors to:

- Explore the art portfolio
- Browse artwork categories
- Learn about custom sketch services
- View starting prices
- Submit custom sketch requests
- Upload reference images
- Read FAQs
- Contact Paras Arts
- Use the AI assistant
- Switch between English, Hindi and Marathi

The website is designed to make the custom sketch process simple and convenient.`;
  }

  /* ---------------------------------------------------------
     FALLBACK
     --------------------------------------------------------- */

  return `I'm the **Paras Arts website assistant**. I can help with:

- 🎨 Paras Arts and Paras Kosambe
- 🖼️ Portfolio and artwork categories
- 💰 Sketch pricing
- 📐 A4, A3 and A2 sizes
- ✏️ Graphite, charcoal and carbon materials
- 📝 Order form and ordering process
- 💳 ₹200 payment
- 📦 Delivery information
- 📞 Contact details
- ❓ FAQs
- 🌐 English, Hindi and Marathi
- 📱 Website features

I don't want to guess information that isn't officially available.

Try asking something like:

**"What is the price of a portrait?"**

or

**"How do I order a custom sketch?"**`;
}

/* =========================================================
   LOAD CHAT HISTORY
   ========================================================= */

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [GREETING];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    const parsed = raw
      ? (JSON.parse(raw) as ChatMessage[])
      : null;

    if (Array.isArray(parsed) && parsed.length) {
      return parsed;
    }
  } catch {
    // Ignore corrupt history
  }

  return [GREETING];
}

/* =========================================================
   AI ASSISTANT
   ========================================================= */

export function AiAssistant() {
  const { t } = useLang();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    GREETING,
  ]);

  const [input, setInput] = useState("");

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  /* ---------------------------------------------------------
     LOAD HISTORY
     --------------------------------------------------------- */

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  /* ---------------------------------------------------------
     SAVE HISTORY
     --------------------------------------------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-40))
    );
  }, [messages]);

  /* ---------------------------------------------------------
     FOCUS WHEN OPEN
     --------------------------------------------------------- */

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();

      bottomRef.current?.scrollIntoView({
        block: "end",
      });
    }
  }, [open]);

  /* ---------------------------------------------------------
     AUTO SCROLL
     --------------------------------------------------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, busy]);

  /* ---------------------------------------------------------
     SEND MESSAGE
     --------------------------------------------------------- */

  function send(text: string) {
    const clean = text.trim().slice(0, 2000);

    if (!clean || busy) return;

    const next: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: clean,
      },
    ];

    setMessages(next);

    setInput("");

    setBusy(true);

    setError("");

    /*
     * Small timeout allows the user's message to render
     * before the answer is displayed.
     *
     * There is NO API request here.
     * There is NO Gemini request here.
     * There is NO database request here.
     */

    setTimeout(() => {
      try {
        const answer = getLocalAnswer(clean);

        setMessages([
          ...next,
          {
            role: "assistant",
            content: answer,
          },
        ]);
      } catch {
        setError("Something went wrong.");

        setMessages(next);
      } finally {
        setBusy(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }, 80);
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <>
      {/* FLOATING BUTTON */}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          open
            ? "Close the Paras Arts assistant"
            : "Open the Paras Arts assistant"
        }
        aria-expanded={open}
        className="group fixed bottom-6 right-5 z-[90] grid h-14 w-14 place-items-center rounded-full text-[#121212] shadow-[0_10px_30px_-8px_rgba(201,138,43,0.65)] ring-1 ring-white/20 transition-all duration-500 hover:scale-[1.07] hover:shadow-[0_14px_40px_-8px_rgba(232,194,122,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light sm:right-6"
        style={{
          background:
            "linear-gradient(135deg, #f2d59a, #c98a2b)",
        }}
      >
        <span
          className="transition-transform duration-500 group-hover:rotate-[8deg]"
          style={
            open
              ? undefined
              : {
                  animation:
                    "float-soft 4.5s ease-in-out infinite",
                }
          }
        >
          {open ? (
            <X size={22} />
          ) : (
            <MessageCircle size={22} />
          )}
        </span>

        {!open && (
          <>
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/25" />

            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121212] bg-emerald-400" />
          </>
        )}
      </button>

      {/* CHAT PANEL */}

      <div
        role="dialog"
        aria-label="Paras Arts studio assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 z-[95] flex w-[min(23.5rem,calc(100vw-2rem))] max-h-[min(33rem,calc(100vh-8.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-gold/25 bg-[#131313]/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 ease-out sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-6 scale-95 opacity-0"
        }`}
      >
        {/* HEADER */}

        <header className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(320px_90px_at_15%_0%,rgba(201,138,43,0.22),transparent_70%)]" />

          <span className="relative shrink-0">
            <img
              src={logoMark}
              alt=""
              className="h-10 w-10 rounded-full border border-gold/30 bg-white/[0.04] object-contain p-1"
            />

            <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-[#131313] bg-emerald-400">
              <span className="h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            </span>
          </span>

          <div className="min-w-0">
            <div className="truncate font-display text-base leading-tight">
              {t("chat.title")}
            </div>

            <div className="mt-0.5 text-[10px] tracking-[0.26em] uppercase text-gold-light/90">
              Paras Arts · {t("chat.status")}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessages([GREETING]);
              setError("");
            }}
            className="ml-auto rounded-full border border-white/10 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light/50 hover:text-gold-light"
          >
            {t("chat.new")}
          </button>
        </header>

        {/* MESSAGES */}

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`animate-fade-in ${
                m.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start gap-2.5"
              }`}
            >
              {m.role === "assistant" && (
                <img
                  src={logoMark}
                  alt=""
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-gold/25 object-contain p-0.5"
                />
              )}

              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-gold-gradient px-4 py-2.5 text-[13.5px] leading-relaxed text-[#121212] shadow-[0_8px_22px_-14px_rgba(201,138,43,0.9)]"
                    : "max-w-[88%] rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[13.5px] leading-relaxed text-white/85"
                }
                style={
                  m.role === "user"
                    ? {
                        background:
                          "linear-gradient(135deg, #f2d59a, #c98a2b)",
                      }
                    : undefined
                }
              >
                {m.role === "assistant" ? (
                 <div
  className="
    space-y-3
    text-[13.5px]
    leading-relaxed
    [&_p]:mb-2
    [&_p:last-child]:mb-0

    [&_h1]:mb-3
    [&_h1]:text-base
    [&_h1]:font-semibold
    [&_h1]:text-gold-light

    [&_h2]:mb-2
    [&_h2]:mt-4
    [&_h2]:text-sm
    [&_h2]:font-semibold
    [&_h2]:text-gold-light

    [&_h3]:mb-2
    [&_h3]:mt-3
    [&_h3]:text-sm
    [&_h3]:font-semibold
    [&_h3]:text-gold-light

    [&_ul]:my-2
    [&_ul]:space-y-1
    [&_ul]:pl-5
    [&_ul]:list-disc

    [&_ol]:my-2
    [&_ol]:space-y-1
    [&_ol]:pl-5
    [&_ol]:list-decimal

    [&_li]:pl-1

    [&_strong]:font-semibold
    [&_strong]:text-gold-light

    [&_em]:italic
    [&_a]:text-gold-light
    [&_a]:underline
    [&_a]:underline-offset-2
  "
>
  <ReactMarkdown>
    {m.content}
  </ReactMarkdown>
</div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {/* THINKING */}

          {busy &&
            messages[messages.length - 1]?.role ===
              "user" && (
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold-light/80">
                <Loader2
                  size={12}
                  className="animate-spin"
                />

                {t("chat.thinking")}
              </div>
            )}

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-white/80">
              {error}{" "}

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer noopener"
                className="text-gold-light underline"
              >
                Message us on WhatsApp
              </a>
            </div>
          )}

          {/* SUGGESTIONS */}

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-light/50 hover:text-gold-light"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-white/10 bg-white/[0.02] p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#1a1a1a] p-2 transition-colors duration-300 focus-within:border-gold-light/50">
            <label
              className="sr-only"
              htmlFor="paras-chat-input"
            >
              Ask about Paras Arts
            </label>

            <textarea
              id="paras-chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={2000}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t("chat.placeholder")}
              className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#121212] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_22px_-10px_rgba(232,194,122,0.9)] disabled:opacity-40 disabled:hover:scale-100"
              style={{
                background:
                  "linear-gradient(135deg, #f2d59a, #c98a2b)",
              }}
            >
              {busy ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>

          <p className="px-2 pt-2 text-[10px] text-muted-foreground">
            Paras Arts assistant · {SITE.phoneDisplay}
          </p>
        </form>
      </div>
    </>
  );
}