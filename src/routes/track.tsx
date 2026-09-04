import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  PackageSearch,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Hourglass,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { api } from "@/lib/api";
import { whatsappUrl } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Commission — Paras Arts" },
      {
        name: "description",
        content:
          "Check the live status of your Paras Arts commission with your email and order ID — pending, accepted, in progress, completed or cancelled.",
      },
      {
        property: "og:title",
        content: "Track Your Commission — Paras Arts",
      },
      {
        property: "og:description",
        content: "Live status for your Paras Arts pencil-art commission.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

const STAGES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
] as const;

const META: Record<string, { icon: typeof Clock; note: string }> = {
  Pending: {
    icon: Hourglass,
    note: "We've received your enquiry and are preparing your quote.",
  },
  Accepted: {
    icon: CheckCircle2,
    note: "Your commission is confirmed and queued in the studio.",
  },
  "In Progress": {
    icon: Loader2,
    note: "Paras is drawing your piece — progress photos are shared.",
  },
  Completed: {
    icon: CheckCircle2,
    note: "Finished, sealed and dispatched with tracking.",
  },
  Cancelled: {
    icon: XCircle,
    note: "This commission was cancelled. Contact the studio to restart.",
  },
};

type Order = {
  _id: string;
  orderId: string;
  fullName: string;
  status: string;
  paymentStatus?: string;
  sketchType?: string;
  paperSize?: string;
  createdAt?: string;
  updatedAt?: string;
};

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50";

function TrackPage() {
  const { tr } = useLang();

  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanEmail = email.trim().slice(0, 255);
    const cleanId = orderId.trim().slice(0, 64);

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanId.length < 6) {
      setError(
        tr(
          "Please enter the email you ordered with and your full order ID."
        )
      );
      return;
    }

    setBusy(true);
    setError("");
    setOrder(null);

    try {
      const { data } = await api.get("/orders/track", {
        params: {
          email: cleanEmail,
          orderId: cleanId.toUpperCase(),
        },
      });

      setOrder(data);
    } catch (err) {
      const e2 = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setError(
        e2.response?.data?.message ??
          tr(
            "We couldn't find that commission. Check the details or message the studio."
          )
      );
    } finally {
      setBusy(false);
    }
  }

  const stageIndex = order
    ? STAGES.indexOf(order.status as (typeof STAGES)[number])
    : -1;

  const cancelled = order?.status === "Cancelled";

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow={tr("Order Tracking")}
        title={tr("Where is my commission?")}
        description={tr(
          "Enter the email you ordered with and the order ID from your confirmation to see the live status."
        )}
      />

      <form
        onSubmit={onSubmit}
        className="mt-14 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:grid-cols-[1fr_1fr_auto] md:items-end md:p-8"
      >
        <div>
          <label
            htmlFor="track-email"
            className="text-[10px] tracking-[0.3em] uppercase text-gold-light"
          >
            {tr("Email")}
          </label>

          <input
            id="track-email"
            type="email"
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tr("you@email.com")}
            className={`mt-2 ${inputCls}`}
            required
          />
        </div>

        <div>
          <label
            htmlFor="track-id"
            className="text-[10px] tracking-[0.3em] uppercase text-gold-light"
          >
            {tr("Order ID")}
          </label>

          <input
            id="track-id"
            value={orderId}
            maxLength={64}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={tr("e.g. PA-20260904-4821")}
            className={`mt-2 ${inputCls}`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="btn-gold h-[52px] justify-center"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}

          {tr("Track")}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-4 text-sm text-white/80">
          {error}{" "}
          <a
            href={whatsappUrl("Hi, I'd like to check my order status.")}
            target="_blank"
            rel="noreferrer noopener"
            className="text-gold-light underline"
          >
            {tr("Message the studio")}
          </a>
        </div>
      )}

      {order && (
        <div className="mt-10 rounded-3xl gold-border p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                {tr("Commission")}
              </div>

              <h2 className="mt-2 font-display text-3xl">
                {order.sketchType ?? tr("Custom Sketch")}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {order.fullName} · {order.paperSize ?? "—"} · ID{" "}
                {order.orderId}
              </p>
            </div>

            <div
              className={`rounded-full px-5 py-2 text-xs tracking-[0.25em] uppercase ${
                cancelled
                  ? "border border-destructive/50 text-destructive"
                  : "bg-gold-gradient text-[#121212]"
              }`}
            >
              {tr(order.status)}
            </div>
          </div>

          <p className="mt-6 text-sm text-white/75">
            {tr(META[order.status]?.note ?? "")}
          </p>

          {!cancelled && (
            <ol className="mt-10 grid gap-4 sm:grid-cols-4">
              {STAGES.map((s, i) => {
                const done = i <= stageIndex;
                const Icon = META[s].icon;

                return (
                  <li
                    key={s}
                    className={`rounded-2xl border p-5 transition-colors ${
                      done
                        ? "border-gold/50 bg-gold/[0.06]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        done ? "text-gold-light" : "text-white/30"
                      }
                    />

                    <div
                      className={`mt-3 text-xs tracking-[0.2em] uppercase ${
                        done ? "text-gold-light" : "text-white/40"
                      }`}
                    >
                      {tr(s)}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <a
              href={whatsappUrl(
                `Hi, an update on my order ${order.orderId}?`
              )}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-gold text-sm"
            >
              {tr("Ask for an update")}
            </a>

            <Link
              to="/portfolio"
              className="btn-ghost-gold text-sm"
            >
              {tr("Browse the portfolio")}
            </Link>
          </div>
        </div>
      )}

      {!order && !error && (
        <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-14 text-center">
          <PackageSearch size={28} className="text-gold-light" />

          <p className="max-w-md text-sm text-muted-foreground">
            {tr(
              "Your order ID is in the confirmation message from the studio. Lost it? Message us on WhatsApp and we'll look it up for you."
            )}
          </p>
        </div>
      )}
    </div>
  );
}