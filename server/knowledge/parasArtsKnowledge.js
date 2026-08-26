const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const PARAS_ARTS_KNOWLEDGE = require("../knowledge/parasArtsKnowledge");

const router = express.Router();

// ============================================================
// GEMINI
// ============================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// OFFICIAL QUICK ANSWERS
// These answers do NOT use Gemini.
// They are returned immediately.
// ============================================================

const QUICK_ANSWERS = [
  {
    keywords: [
      "who is paras kosambe",
      "who is paras",
      "about paras kosambe",
      "tell me about paras kosambe",
      "artist paras kosambe",
    ],

    answer: `
**Paras Kosambe** is the artist and creator behind **Paras Arts**.

He is a sketch artist focused on detailed hand-drawn artwork and custom sketches.

His artwork includes subjects such as:

- Portraits
- Couples
- Families
- Animals
- Cars and motorsport
- Devotional artwork

Paras works with traditional drawing mediums including **graphite, charcoal and carbon pencils**.

His approach focuses on careful observation, proportion, shading, tonal detail and the visual character of the reference subject.

Paras Arts allows customers to commission personalized artwork based on their requirements and reference images.
`,
  },

  // ----------------------------------------------------------
  // ABOUT PARAS ARTS
  // ----------------------------------------------------------

  {
    keywords: [
      "what is paras arts",
      "what is paras arts website",
      "about paras arts",
      "tell me about paras arts",
      "paras arts",
    ],

    answer: `
**Paras Arts** is a digital art portfolio and custom sketch ordering website created by artist **Paras Kosambe**.

The website allows visitors to:

- Explore the Paras Arts portfolio
- Discover different artwork categories
- Learn about custom sketch services
- View starting prices
- Submit a custom sketch request
- Upload a reference image
- Learn about the ordering process
- Read FAQs
- Contact Paras through the Contact section
- Use the AI assistant
- Change the website language

The goal of Paras Arts is to make discovering artwork, requesting a custom sketch and communicating with the artist simple and convenient.
`,
  },

  // ----------------------------------------------------------
  // CONTACT
  // ----------------------------------------------------------

  {
    keywords: [
      "phone",
      "phone number",
      "mobile number",
      "contact number",
      "contact paras",
      "how can i contact",
      "contact information",
    ],

    answer: `
You can contact **Paras Arts** through:

📞 **Phone:** 9137935311

💬 **WhatsApp:** 9137935311

📧 **Email:** paraskosambe@gmail.com

📷 **Instagram:** @paras.arts.3313

You can also use the **Contact section** on the website and submit the contact form to send an enquiry.
`,
  },

  {
    keywords: [
      "whatsapp",
      "whatsapp number",
      "whatsapp contact",
    ],

    answer: `
The official Paras Arts WhatsApp number is:

💬 **9137935311**

You can also use the **Contact section** of the website to submit an enquiry.
`,
  },

  {
    keywords: [
      "email",
      "email id",
      "email address",
      "mail id",
    ],

    answer: `
The official Paras Arts email address is:

📧 **paraskosambe@gmail.com**

You can also use the Contact form on the website.
`,
  },

  {
    keywords: [
      "instagram",
      "instagram id",
      "instagram handle",
      "instagram account",
    ],

    answer: `
The Paras Arts Instagram account is:

📷 **@paras.arts.3313**
`,
  },

  // ----------------------------------------------------------
  // CONTACT FORM
  // ----------------------------------------------------------

  {
    keywords: [
      "contact form",
      "how to contact through website",
      "contact through website",
      "fill contact form",
      "contact section",
    ],

    answer: `
You can contact Paras Arts directly through the website's **Contact section**.

Steps:

1. Open the **Contact** section.
2. Fill in the required information.
3. Write your enquiry or message.
4. Submit the form.

This provides a convenient way to send your enquiry and makes communication smoother.

You can also contact Paras Arts through phone, WhatsApp, email or Instagram.
`,
  },

  // ----------------------------------------------------------
  // LANGUAGE
  // ----------------------------------------------------------

  {
    keywords: [
      "language",
      "languages",
      "hindi",
      "marathi",
      "english",
      "change language",
      "translate website",
      "language converter",
    ],

    answer: `
Yes. The Paras Arts website supports **three languages**:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Marathi

You can use the **language selector** on the website to switch between English, Hindi and Marathi according to your preference.
`,
  },

  // ----------------------------------------------------------
  // PORTFOLIO
  // ----------------------------------------------------------

  {
    keywords: [
      "portfolio",
      "artwork categories",
      "art categories",
      "what artwork",
      "what art",
      "categories",
    ],

    answer: `
The Paras Arts portfolio showcases artwork created by Paras Kosambe.

Main artwork categories include:

- Portraits
- Cars
- Animals
- Devotional artwork

Custom services also include:

- Couple sketches
- Family sketches
- Pet sketches
- Car / Motorsport sketches

The artwork uses traditional mediums including **graphite, charcoal and carbon**.
`,
  },

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  {
    keywords: [
      "services",
      "custom sketch",
      "custom sketches",
      "what sketches do you make",
      "types of sketches",
      "sketch types",
    ],

    answer: `
Paras Arts provides personalized custom sketch services.

Available artwork categories include:

- **Custom Portrait**
- **Couple Sketch**
- **Family Sketch**
- **Pet Sketch**
- **Car / Motorsport Sketch**
- **Animal artwork**
- **Devotional artwork**

The final artwork is created according to the customer's requirements and reference image.
`,
  },

  // ----------------------------------------------------------
  // PRICING - GENERAL
  // ----------------------------------------------------------

  {
    keywords: [
      "price",
      "prices",
      "pricing",
      "cost",
      "how much",
      "all prices",
      "sketch price",
    ],

    answer: `
Here are the current **starting prices for A4**:

- 🖼️ **Custom Portrait:** ₹1000+
- 💑 **Couple Sketch:** ₹3000+
- 👨‍👩‍👧 **Family Sketch:** ₹5000+
- 🐾 **Pet Sketch:** ₹2000+
- 🚗 **Car / Motorsport Sketch:** ₹4000+

### Size pricing

**A4:** Base starting price

**A3:** A4 price + ₹2000

**A2:** A4 price + ₹4000

These are starting prices. The final price may increase depending on detail, complexity, composition and customization requirements.
`,
  },

  // ----------------------------------------------------------
  // A4
  // ----------------------------------------------------------

  {
    keywords: [
      "a4 price",
      "a4 size price",
      "a4 sketch price",
    ],

    answer: `
The current **A4 starting prices** are:

- Custom Portrait: **₹1000+**
- Couple Sketch: **₹3000+**
- Family Sketch: **₹5000+**
- Pet Sketch: **₹2000+**
- Car / Motorsport Sketch: **₹4000+**

These are starting prices and may increase depending on complexity and customization.
`,
  },

  // ----------------------------------------------------------
  // A3
  // ----------------------------------------------------------

  {
    keywords: [
      "a3 price",
      "a3 size price",
      "a3 sketch price",
      "a3 cost",
    ],

    answer: `
For A3 size, **₹2000 is added to the applicable A4 starting price**.

Examples:

- Portrait: A4 ₹1000+ → A3 **₹3000+**
- Couple: A4 ₹3000+ → A3 **₹5000+**
- Family: A4 ₹5000+ → A3 **₹7000+**
- Pet: A4 ₹2000+ → A3 **₹4000+**
- Car / Motorsport: A4 ₹4000+ → A3 **₹6000+**

These are starting prices and may increase depending on complexity and customization.
`,
  },

  // ----------------------------------------------------------
  // A2
  // ----------------------------------------------------------

  {
    keywords: [
      "a2 price",
      "a2 size price",
      "a2 sketch price",
      "a2 cost",
    ],

    answer: `
For A2 size, **₹4000 is added to the applicable A4 starting price**.

Examples:

- Portrait: A4 ₹1000+ → A2 **₹5000+**
- Couple: A4 ₹3000+ → A2 **₹7000+**
- Family: A4 ₹5000+ → A2 **₹9000+**
- Pet: A4 ₹2000+ → A2 **₹6000+**
- Car / Motorsport: A4 ₹4000+ → A2 **₹8000+**

These are starting prices and may increase depending on complexity and customization.
`,
  },

  // ----------------------------------------------------------
  // MATERIALS
  // ----------------------------------------------------------

  {
    keywords: [
      "materials",
      "material",
      "pencils",
      "tools",
      "what pencils",
      "which pencils",
      "drawing tools",
    ],

    answer: `
Paras Arts works with traditional drawing mediums including **graphite, charcoal and carbon pencils**.

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

Other supporting drawing tools may also be used depending on the artwork, subject, detail and technique required.

Not every tool is necessarily used in every artwork.
`,
  },

  // ----------------------------------------------------------
  // ORDER
  // ----------------------------------------------------------

  {
    keywords: [
      "how to order",
      "how do i order",
      "place an order",
      "order a sketch",
      "ordering process",
      "order process",
      "how can i order",
    ],

    answer: `
You can request a custom sketch through the **Order / Custom Sketch** section.

### Order process

1. Open the custom sketch/order section.
2. Enter your **name**.
3. Enter your **mobile number**.
4. Enter your **WhatsApp number**.
5. Enter your **email address**.
6. Enter your **address**.
7. Provide the required **date**.
8. Upload your **reference image**.
9. Select the **sketch type**.
10. Enter your **budget**.
11. Select the **paper size**.
12. Add any **additional notes or requirements**.
13. Submit the form.
14. Proceed with the **₹200 payment** specified by the current website order process.

Remember: ₹200 is **not the total sketch price**. The final artwork price depends on the sketch type, size, detail, complexity and customization.
`,
  },

  // ----------------------------------------------------------
  // FORM DETAILS
  // ----------------------------------------------------------

  {
    keywords: [
      "what information",
      "form details",
      "what do i fill",
      "what should i enter",
      "order form",
      "form fields",
    ],

    answer: `
The custom sketch order form collects information including:

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

Available paper sizes are:

- A4
- A3
- A2
`,
  },

  // ----------------------------------------------------------
  // PAYMENT
  // ----------------------------------------------------------

  {
    keywords: [
      "200 payment",
      "₹200",
      "200 rupees",
      "payment",
      "advance payment",
      "is 200 the price",
    ],

    answer: `
The current Paras Arts order process includes a **₹200 payment**.

Important: **₹200 is not the complete price of the sketch.**

The final sketch price depends on:

- Sketch type
- Paper size
- Detail
- Complexity
- Customization requirements

If you need information about a payment method that isn't specified, please check the payment option shown on the website or use the Contact section.
`,
  },

  // ----------------------------------------------------------
  // REFERENCE IMAGE
  // ----------------------------------------------------------

  {
    keywords: [
      "reference image",
      "reference photo",
      "photo for sketch",
      "image for sketch",
      "what image",
    ],

    answer: `
A reference image helps Paras Arts understand what the custom artwork should be based on.

Whenever possible, provide a **clear reference image** that shows the subject and important details required for the artwork.

The website knowledge does not specify particular file-size or resolution requirements, so I won't invent any.
`,
  },

  // ----------------------------------------------------------
  // DELIVERY
  // ----------------------------------------------------------

  {
    keywords: [
      "delivery",
      "delivery time",
      "how long",
      "when will i get",
      "shipping time",
      "how many days",
    ],

    answer: `
The exact delivery timeline is **not currently specified** in the official Paras Arts information.

I don't want to guess a delivery period.

For the current delivery information, please contact Paras Arts:

📞 Phone: **9137935311**

💬 WhatsApp: **9137935311**

You can also use the website's Contact section.
`,
  },

  // ----------------------------------------------------------
  // FAQ
  // ----------------------------------------------------------

  {
    keywords: [
      "faq",
      "frequently asked",
      "common questions",
      "questions",
    ],

    answer: `
The Paras Arts website has a dedicated **FAQ section** where visitors can find answers to common questions about:

- Artwork
- Custom sketches
- Pricing
- Ordering
- Services
- Website features

If your question isn't answered there, you can use the **Contact section** to send an enquiry.
`,
  },
];

// ============================================================
// FIND QUICK ANSWER
// ============================================================

function findQuickAnswer(message) {
  const text = message.toLowerCase().trim();

  // Exact/strong matching first
  for (const item of QUICK_ANSWERS) {
    const matched = item.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    if (matched) {
      return item.answer.trim();
    }
  }

  return null;
}

// ============================================================
// GEMINI FALLBACK
// ============================================================

async function askGemini(messages) {
  const conversation = messages
    .slice(-6)
    .map((m) => {
      const role = m.role === "user" ? "Customer" : "Assistant";
      return `${role}: ${m.content}`;
    })
    .join("\n");

  const prompt = `
You are the official AI assistant for Paras Arts.

Use ONLY the official Paras Arts knowledge below.

Never invent:

- Prices
- Contact details
- Delivery times
- Materials
- Policies
- Services
- Artist achievements
- Qualifications
- Awards
- Client information

If information is unavailable, clearly say that it is not currently available.

Be friendly and professional.

Answer simple questions concisely.

Give detailed answers when the customer asks for details.

Use bullet points or numbered steps when helpful.

Do not claim to be Paras Kosambe.

You are the official AI assistant for Paras Arts.

==================================================
OFFICIAL KNOWLEDGE
==================================================

${PARAS_ARTS_KNOWLEDGE}

==================================================
RECENT CONVERSATION
==================================================

${conversation}

==================================================
INSTRUCTION
==================================================

Answer the customer's latest question using ONLY the official knowledge.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text;
}

// ============================================================
// CHAT ROUTE
// ============================================================

router.post("/", async (req, res) => {
  try {
    const { messages, message } = req.body;

    // --------------------------------------------------------
    // Support both frontend formats
    // --------------------------------------------------------

    let conversationMessages = [];

    if (Array.isArray(messages) && messages.length > 0) {
      conversationMessages = messages;
    } else if (typeof message === "string" && message.trim()) {
      conversationMessages = [
        {
          role: "user",
          content: message.trim(),
        },
      ];
    } else {
      return res.status(400).json({
        message: "Please enter a valid message.",
      });
    }

    const latestMessage =
      conversationMessages[conversationMessages.length - 1];

    if (
      !latestMessage ||
      latestMessage.role !== "user" ||
      !latestMessage.content ||
      !latestMessage.content.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a valid message.",
      });
    }

    const question = latestMessage.content.trim();

    // --------------------------------------------------------
    // FIRST: LOCAL ANSWER
    // --------------------------------------------------------

    const quickAnswer = findQuickAnswer(question);

    if (quickAnswer) {
      console.log("CHATBOT: Local answer");

      return res.status(200).json({
        reply: quickAnswer,
        source: "local",
      });
    }

    // --------------------------------------------------------
    // SECOND: GEMINI ONLY IF NEEDED
    // --------------------------------------------------------

    console.log("CHATBOT: Gemini fallback");

    try {
      const reply = await askGemini(conversationMessages);

      if (!reply || !reply.trim()) {
        return res.status(200).json({
          reply:
            "I couldn't find that information in the available Paras Arts information. Please use the Contact section for assistance.",
          source: "fallback",
        });
      }

      return res.status(200).json({
        reply: reply.trim(),
        source: "gemini",
      });
    } catch (error) {
      console.error("Gemini fallback error:", error);

      // ------------------------------------------------------
      // Gemini quota exceeded
      // ------------------------------------------------------

      if (error?.status === 429) {
        return res.status(200).json({
          reply:
            "I don't currently have enough official information to answer that accurately. Please use the Paras Arts Contact section or contact Paras Arts directly at 9137935311.",
          source: "fallback",
        });
      }

      // ------------------------------------------------------
      // Other Gemini error
      // ------------------------------------------------------

      return res.status(200).json({
        reply:
          "I couldn't get an AI response right now. Please try asking about Paras Arts pricing, artwork, materials, ordering, FAQs or contact information.",
        source: "fallback",
      });
    }
  } catch (error) {
    console.error("Chatbot route error:", error);

    return res.status(500).json({
      message: "Sorry, the assistant could not respond right now.",
    });
  }
});

module.exports = router;