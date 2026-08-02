import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant-knowledge";

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(40),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = BodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ message: "Invalid request." }, { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return Response.json({ message: "Assistant is not configured." }, { status: 500 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system: ASSISTANT_SYSTEM_PROMPT,
            messages: parsed.data.messages,
          });
          return result.toTextStreamResponse();
        } catch (err) {
          const status = (err as { statusCode?: number })?.statusCode ?? 500;
          const message =
            status === 429
              ? "The assistant is busy right now — please try again in a moment."
              : status === 402
                ? "The assistant is temporarily unavailable. Please reach the studio on WhatsApp."
                : "The assistant could not respond. Please try again.";
          console.error("chat error", err);
          return Response.json({ message }, { status });
        }
      },
    },
  },
});
