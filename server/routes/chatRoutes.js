const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const PARAS_ARTS_KNOWLEDGE = require("../knowledge/parasArtsKnowledge");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/*
==================================================
LOCAL KNOWLEDGE HELPERS
==================================================
*/

/*
Convert text into simple searchable words.
This helps recognize questions such as:

"What is the price of a portrait?"
"How much does a portrait cost?"
"portrait cost?"

as related questions.
*/
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[₹,!?."']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
Remove common words that don't help much with
question matching.
*/
function getKeywords(text) {
  const stopWords = new Set([
    "what",
    "is",
    "the",
    "a",
    "an",
    "of",
    "for",
    "to",
    "how",
    "much",
    "does",
    "do",
    "can",
    "i",
    "you",
    "your",
    "me",
    "tell",
    "about",
    "please",
    "give",
    "my",
    "are",
    "and",
    "or",
    "in",
    "on",
    "with",
    "use",
    "used",
    "does",
    "it",
    "this",
    "that",
    "is",
    "there",
    "available",
    "where",
    "which",
    "who",
  ]);

  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length >= 3 && !stopWords.has(word));
}

/*
==================================================
EXTRACT FAQ QUESTIONS + ANSWERS
==================================================
*/

function extractFaqEntries(knowledge) {
  const entries = [];

  /*
  Looks for:

  Q: What is Paras Arts?

  A:
  Paras Arts is...
  */

  const regex =
    /Q:\s*(.+?)\s*\n+\s*A:\s*\n([\s\S]*?)(?=\n\s*Q:|\n={5,}|$)/gi;

  let match;

  while ((match = regex.exec(knowledge)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();

    if (question && answer) {
      entries.push({
        question,
        answer,
      });
    }
  }

  return entries;
}

const FAQ_ENTRIES = extractFaqEntries(PARAS_ARTS_KNOWLEDGE);

/*
==================================================
SECTION EXTRACTION
==================================================
*/

function getSection(knowledge, sectionNumber) {
  const pattern = new RegExp(
    `={5,}\\s*\\n${sectionNumber}\\.\\s+[^\\n]+\\s*\\n={5,}([\\s\\S]*?)(?=\\n={5,}\\s*\\n\\d+\\.\\s+|\\n={5,}\\s*\\nEND OF OFFICIAL PARAS ARTS KNOWLEDGE)`,
    "i"
  );

  const match = knowledge.match(pattern);

  if (!match) {
    return null;
  }

  return match[1].trim();
}

/*
==================================================
LOCAL ANSWER ENGINE
==================================================
*/

function getLocalAnswer(userMessage) {
  const normalized = normalizeText(userMessage);
  const keywords = getKeywords(userMessage);

  if (!keywords.length) {
    return null;
  }

  /*
  ------------------------------------------------
  1. FIRST TRY FAQ MATCHING
  ------------------------------------------------
  */

  let bestFaq = null;
  let bestFaqScore = 0;

  for (const faq of FAQ_ENTRIES) {
    const faqQuestion = normalizeText(faq.question);
    const faqKeywords = getKeywords(faq.question);

    let score = 0;

    for (const keyword of keywords) {
      if (faqQuestion.includes(keyword)) {
        score += 2;
      }

      if (faqKeywords.includes(keyword)) {
        score += 2;
      }
    }

    /*
    Strong bonus when important words occur.
    */

    const importantWords = [
      "price",
      "pricing",
      "portrait",
      "couple",
      "family",
      "pet",
      "car",
      "motorsport",
      "delivery",
      "order",
      "contact",
      "language",
      "hindi",
      "marathi",
      "english",
      "materials",
      "graphite",
      "charcoal",
      "carbon",
      "eraser",
      "payment",
      "website",
    ];

    for (const word of importantWords) {
      if (normalized.includes(word) && faqQuestion.includes(word)) {
        score += 3;
      }
    }

    if (score > bestFaqScore) {
      bestFaqScore = score;
      bestFaq = faq;
    }
  }

  /*
  A reasonably strong FAQ match is answered
  immediately without Gemini.
  */

  if (bestFaq && bestFaqScore >= 5) {
    return bestFaq.answer;
  }

  /*
  ------------------------------------------------
  2. TOPIC / SECTION MATCHING
  ------------------------------------------------
  */

  /*
  Pricing
  */

  if (
    normalized.includes("price") ||
    normalized.includes("pricing") ||
    normalized.includes("cost") ||
    normalized.includes("₹") ||
    normalized.includes("rupee") ||
    normalized.includes("a4") ||
    normalized.includes("a3") ||
    normalized.includes("a2")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 9);

    if (section) {
      return `### Paras Arts Pricing\n\n${section}`;
    }
  }

  /*
  Contact
  */

  if (
    normalized.includes("contact") ||
    normalized.includes("phone") ||
    normalized.includes("whatsapp") ||
    normalized.includes("email") ||
    normalized.includes("instagram")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 4);

    if (section) {
      return `### Contact Paras Arts\n\n${section}`;
    }
  }

  /*
  Language
  */

  if (
    normalized.includes("language") ||
    normalized.includes("hindi") ||
    normalized.includes("marathi") ||
    normalized.includes("english") ||
    normalized.includes("translate") ||
    normalized.includes("translation")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 3);

    if (section) {
      return `### Website Languages\n\n${section}`;
    }
  }

  /*
  Portfolio
  */

  if (
    normalized.includes("portfolio") ||
    normalized.includes("artwork") ||
    normalized.includes("portrait") ||
    normalized.includes("animal") ||
    normalized.includes("devotional") ||
    normalized.includes("motorsport")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 6);

    if (section) {
      return `### Paras Arts Portfolio\n\n${section}`;
    }
  }

  /*
  Services
  */

  if (
    normalized.includes("service") ||
    normalized.includes("custom sketch") ||
    normalized.includes("custom artwork") ||
    normalized.includes("couple sketch") ||
    normalized.includes("family sketch") ||
    normalized.includes("pet sketch")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 7);

    if (section) {
      return `### Custom Sketch Services\n\n${section}`;
    }
  }

  /*
  Materials
  */

  if (
    normalized.includes("material") ||
    normalized.includes("pencil") ||
    normalized.includes("graphite") ||
    normalized.includes("charcoal") ||
    normalized.includes("carbon") ||
    normalized.includes("eraser") ||
    normalized.includes("tombow") ||
    normalized.includes("staedtler") ||
    normalized.includes("camlin") ||
    normalized.includes("faber")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 8);

    if (section) {
      return `### Art Mediums & Materials\n\n${section}`;
    }
  }

  /*
  Order process
  */

  if (
    normalized.includes("order") ||
    normalized.includes("ordering") ||
    normalized.includes("form") ||
    normalized.includes("how do i order") ||
    normalized.includes("place an order")
  ) {
    const orderSection = getSection(PARAS_ARTS_KNOWLEDGE, 11);

    if (orderSection) {
      return `### How to Order a Custom Sketch\n\n${orderSection}`;
    }
  }

  /*
  Payment
  */

  if (
    normalized.includes("payment") ||
    normalized.includes("200") ||
    normalized.includes("deposit")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 13);

    if (section) {
      return `### ₹200 Payment\n\n${section}`;
    }
  }

  /*
  Reference image
  */

  if (
    normalized.includes("reference image") ||
    normalized.includes("reference photo") ||
    normalized.includes("photo") ||
    normalized.includes("image")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 12);

    if (section) {
      return `### Reference Image\n\n${section}`;
    }
  }

  /*
  Delivery
  */

  if (
    normalized.includes("delivery") ||
    normalized.includes("deliver") ||
    normalized.includes("how long") ||
    normalized.includes("days")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 15);

    if (section) {
      return `### Delivery Information\n\n${section}`;
    }
  }

  /*
  About Paras Arts
  */

  if (
    normalized.includes("paras arts") ||
    normalized.includes("who is paras") ||
    normalized.includes("artist") ||
    normalized.includes("paras kosambe")
  ) {
    const aboutParas = getSection(PARAS_ARTS_KNOWLEDGE, 2);
    const aboutBrand = getSection(PARAS_ARTS_KNOWLEDGE, 1);

    if (aboutParas && aboutBrand) {
      return `### About Paras Arts\n\n${aboutBrand}\n\n### About Paras Kosambe\n\n${aboutParas}`;
    }
  }

  /*
  FAQ
  */

  if (
    normalized.includes("faq") ||
    normalized.includes("frequently asked") ||
    normalized.includes("common question")
  ) {
    const section = getSection(PARAS_ARTS_KNOWLEDGE, 5);

    if (section) {
      return `### Frequently Asked Questions\n\n${section}`;
    }
  }

  /*
  ------------------------------------------------
  No reliable local answer
  ------------------------------------------------

  Return null.

  This means Gemini can be used as the fallback.
  */

  return null;
}

/*
==================================================
POST /api/chat
==================================================
*/

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    /*
    Validate request
    */

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }

    const latestMessage = messages[messages.length - 1];

    if (
      !latestMessage ||
      latestMessage.role !== "user" ||
      !latestMessage.content?.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a valid message.",
      });
    }

    const userMessage = latestMessage.content.trim();

    /*
    ==================================================
    HYBRID STEP 1
    ==================================================

    Try local Paras Arts knowledge FIRST.

    If the question is known, Gemini is NOT called.
    */

    const localAnswer = getLocalAnswer(userMessage);

    if (localAnswer) {
      console.log("Chatbot: Local knowledge answer");

      res.status(200);
      res.setHeader(
        "Content-Type",
        "text/plain; charset=utf-8"
      );
      res.setHeader(
        "Cache-Control",
        "no-cache, no-transform"
      );

      /*
      Small chunks make the frontend display the answer
      progressively while still being much faster than
      a Gemini request.
      */

      const chunkSize = 120;

      for (let i = 0; i < localAnswer.length; i += chunkSize) {
        res.write(localAnswer.slice(i, i + chunkSize));
      }

      res.end();
      return;
    }

    /*
    ==================================================
    HYBRID STEP 2
    ==================================================

    No reliable local answer.

    Now Gemini becomes the fallback.
    */

    console.log("Chatbot: Gemini fallback");

    const conversation = messages
      .slice(-10)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are the official AI assistant for Paras Arts.

Use ONLY the official information provided below.

IMPORTANT RULES:

- Never invent information.
- Never hallucinate prices.
- Never invent phone numbers.
- Never invent email addresses.
- Never invent delivery timelines.
- Never invent materials.
- Never invent payment methods.
- Never invent policies.
- Never invent artwork details.
- Never invent artist achievements.
- Never invent qualifications.
- Never invent awards.
- Never invent client information.
- Never claim information that is not present in the knowledge base.

If the exact answer is not available in the knowledge base,
clearly say that the exact information is not currently available
and recommend using the Contact section or contacting Paras Arts.

You are not Paras Kosambe.

You are the official AI assistant for Paras Arts.

Be friendly, professional and concise.

For simple questions, give concise answers.

For detailed questions, use organized bullet points or numbered steps.

The Paras Arts website supports English, Hindi and Marathi.

OFFICIAL PARAS ARTS KNOWLEDGE:

${PARAS_ARTS_KNOWLEDGE}

CONVERSATION:

${conversation}

Answer the customer's latest question using ONLY the official
Paras Arts knowledge above.

FORMATTING RULES:

- Use Markdown formatting.
- Use a short heading when the answer has multiple sections.
- Use bullet points for lists.
- Use numbered lists for procedures or steps.
- Use **bold** for important prices, names and key information.
- Keep paragraphs short.
- Do not put the entire answer into one large paragraph.
- For pricing questions, use a clean bullet list or table-like structure.
- For "how to order" questions, use numbered steps.
- Do not use unnecessary emojis.
`;

    /*
    ==================================================
    GEMINI STREAM
    ==================================================
    */

    let stream;

    try {
      stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: prompt,
      });
    } catch (geminiError) {
      console.error(
        "Gemini fallback error:",
        geminiError
      );

      /*
      Handle quota/rate-limit errors specifically.
      */

      const status =
        geminiError?.status ||
        geminiError?.code;

      if (status === 429) {
        return res.status(429).json({
          message:
            "The AI assistant has temporarily reached its AI usage limit. Please try again later or use the Contact section to reach Paras Arts.",
        });
      }

      return res.status(500).json({
        message:
          "Sorry, the assistant could not respond right now.",
      });
    }

    /*
    ==================================================
    STREAM RESPONSE TO FRONTEND
    ==================================================
    */

    res.status(200);

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    for await (const chunk of stream) {
      const text = chunk.text;

      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (error) {
    console.error(
      "Chatbot route error:",
      error
    );

    if (res.headersSent) {
      res.end();
      return;
    }

    res.status(500).json({
      message:
        "Sorry, the assistant could not respond right now.",
    });
  }
});

module.exports = router;