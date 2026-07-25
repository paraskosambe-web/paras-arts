import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageIcon, ShoppingBag, Mail, Star, Clock, Check } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Stats = {
  artworks: number;
  orders: number;
  messages: number;
  testimonials: number;
  pending: number;
  completed: number;
};

const initial: Stats = {
  artworks: 0, orders: 0, messages: 0, testimonials: 0, pending: 0, completed: 0,
};

function AdminDashboard() {
  const [s, setS] = useState<Stats>(initial);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [aw, orderStats, msg, tst] = await Promise.all([
          api.get("/artworks?limit=1"),
          api.get("/orders/stats"),
          api.get("/messages?limit=1"),
          api.get("/testimonials"),
        ]);
        setS({
          artworks: aw.data.total ?? 0,
          orders: orderStats.data.total ?? 0,
          messages: msg.data.total ?? 0,
          testimonials: tst.data.items?.length ?? 0,
          pending: orderStats.data.pending ?? 0,
          completed: orderStats.data.completed ?? 0,
        });
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? e.message);
      }
    })();
  }, []);

  const cards = [
    { k: "Total Artworks", v: s.artworks, i: ImageIcon },
    { k: "Orders", v: s.orders, i: ShoppingBag },
    { k: "Messages", v: s.messages, i: Mail },
    { k: "Testimonials", v: s.testimonials, i: Star },
    { k: "Pending Orders", v: s.pending, i: Clock },
    { k: "Completed Orders", v: s.completed, i: Check },
  ];

  return (
    <div>
      <div className="text-[10px] tracking-[0.4em] uppercase text-gold-light">Overview</div>
      <h1 className="mt-3 font-display text-4xl">Studio dashboard</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Realtime snapshot of commissions, artworks, and client conversations.
      </p>

      {err && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.i;
          return (
            <div key={c.k} className="rounded-2xl gold-border p-6">
              <div className="flex items-start justify-between">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light">{c.k}</div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-6 font-display text-5xl text-gold-gradient">{c.v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
