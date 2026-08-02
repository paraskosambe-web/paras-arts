import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import logoMark from "@/assets/logo-mark.png.asset.json";
import { SITE, whatsappUrl } from "@/lib/site";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "paras_arts_chat_v1";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to **Paras Arts**. I can help with pricing, sketch types, materials, the order process, delivery, payments and how to reach the studio. What would you like to know?",
};

const SUGGESTIONS = [
  "What does a portrait cost?",
  "How long is delivery?",
  "How does the order process work?",
  "What paper and pencils do you use?",
];

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* ignore corrupt history */
  }
  return [GREETING];
}

/** Floating Paras Arts studio assistant — one conversation, stored in this browser. */
export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => setMessages(loadHistory()), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function send(text: string) {
    const clean = text.trim().slice(0, 2000);
    if (!clean || busy) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-20).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "The assistant could not respond.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) {
        setMessages([
          ...next,
          {
            role: "assistant",
            content: "Sorry — I didn't catch that. Could you rephrase your question?",
          },
        ]);
      }
    } catch (err) {
      setMessages(next);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the Paras Arts assistant" : "Open the Paras Arts assistant"}
        aria-expanded={open}
        className="group fixed bottom-6 right-6 z-[90] grid h-14 w-14 place-items-center rounded-full text-[#121212] shadow-luxe transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light"
        style={{ background: "linear-gradient(135deg, #e8c27a, #c98a2b)" }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/30" />
        )}
      </button>

      {/* PANEL */}
      <div
        role="dialog"
        aria-label="Paras Arts studio assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 z-[95] flex w-[min(24rem,calc(100vw-2rem))] max-h-[min(34rem,calc(100vh-8rem))] flex-col overflow-hidden rounded-3xl border border-gold/25 bg-[#141414]/95 shadow-luxe backdrop-blur-xl transition-all duration-400 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4">
          <img src={logoMark.url} alt="" className="h-9 w-9 object-contain" />
          <div className="min-w-0">
            <div className="truncate font-display text-base leading-tight">Studio Assistant</div>
            <div className="text-[10px] tracking-[0.28em] uppercase text-gold-light">
              Paras Arts · online
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages([GREETING]);
              setError("");
            }}
            className="ml-auto rounded-full border border-white/10 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-white/60 hover:border-gold-light/50 hover:text-gold-light"
          >
            New
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-gold px-4 py-2.5 text-sm leading-relaxed text-[#121212]"
                    : "max-w-[92%] text-sm leading-relaxed text-white/85"
                }
              >
                {m.role === "assistant" ? (
                  <div className="space-y-2 [&_a]:text-gold-light [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-gold-light">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {busy && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold-light/80">
              <Loader2 size={12} className="animate-spin" /> Thinking…
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-white/80">
              {error}{" "}
              <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="text-gold-light underline">
                Message us on WhatsApp
              </a>
            </div>
          )}

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/70 hover:border-gold-light/50 hover:text-gold-light"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-white/10 bg-white/[0.02] p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#1a1a1a] p-2">
            <label className="sr-only" htmlFor="paras-chat-input">
              Ask about Paras Arts
            </label>
            <textarea
              id="paras-chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={2000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about pricing, delivery, materials…"
              className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#121212] disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #e8c27a, #c98a2b)" }}
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
          <p className="px-2 pt-2 text-[10px] text-muted-foreground">
            Answers Paras Arts questions only · {SITE.phoneDisplay}
          </p>
        </form>
      </div>
    </>
  );
}
