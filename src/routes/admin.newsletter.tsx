import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Mail, RefreshCw } from "lucide-react";

import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletter,
});

type Subscriber = {
  _id: string;
  email: string;
  createdAt: string;
};

function AdminNewsletter() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSubscribers() {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/newsletter");

      setItems(data.items || data || []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Unable to load subscribers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function removeSubscriber(id: string) {
    if (!confirm("Remove this subscriber?")) return;

    try {
      await api.delete(`/newsletter/${id}`);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          e?.message ||
          "Unable to remove subscriber."
      );
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Audience"
        title="Newsletter subscribers"
        action={
          <button
            onClick={loadSubscribers}
            disabled={loading}
            className="btn-ghost-gold flex items-center gap-2 text-xs disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        }
      />

      {/* Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-gold-light/20 bg-gold-light/10 text-gold-light">
              <Mail size={17} />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold-light">
                Subscribers
              </div>

              <div className="mt-1 text-2xl font-medium">
                {items.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/5 md:block">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-[0.3em] text-gold-light">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Subscribed</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((subscriber) => (
              <tr
                key={subscriber._id}
                className="border-t border-white/5 transition-colors hover:bg-white/[0.02]"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-gold-light">
                      <Mail size={14} />
                    </div>

                    <span className="break-all">
                      {subscriber.email}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-muted-foreground">
                  {subscriber.createdAt
                    ? new Date(
                        subscriber.createdAt
                      ).toLocaleDateString()
                    : "—"}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => removeSubscriber(subscriber._id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 transition-colors hover:border-destructive hover:text-destructive"
                    title="Remove subscriber"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-12 text-center text-muted-foreground"
                >
                  No newsletter subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((subscriber) => (
          <div
            key={subscriber._id}
            className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-gold-light">
                <Mail size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="break-all text-sm">
                  {subscriber.email}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {subscriber.createdAt
                    ? new Date(
                        subscriber.createdAt
                      ).toLocaleDateString()
                    : "Date unavailable"}
                </div>
              </div>

              <button
                onClick={() => removeSubscriber(subscriber._id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 transition-colors hover:border-destructive hover:text-destructive"
                title="Remove subscriber"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-10 text-center text-sm text-muted-foreground">
            No newsletter subscribers yet.
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Loading subscribers...
        </div>
      )}
    </div>
  );
}