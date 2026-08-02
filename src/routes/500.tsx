import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/500")({
  head: () => ({
    meta: [
      { title: "Server Error — Paras Arts" },
      {
        name: "description",
        content: "Something went wrong on the Paras Arts studio server. Please try again shortly.",
      },
      { property: "og:title", content: "Server Error — Paras Arts" },
      { property: "og:description", content: "The Paras Arts studio hit an unexpected error." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServerErrorPage,
});

function ServerErrorPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-[7rem] leading-none text-gold-gradient md:text-[10rem]">500</div>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">A smudge on our side</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Something went wrong on the studio server. Your work and enquiries are safe — please try
        again in a moment, or reach us directly and we'll help straight away.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.location.reload()} className="btn-gold">
          <RefreshCw size={16} /> Try again
        </button>
        <Link to="/" className="btn-ghost-gold">
          Return to the studio
        </Link>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer noopener" className="btn-ghost-gold">
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
