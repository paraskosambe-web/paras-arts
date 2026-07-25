import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Check, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

type Message = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
};

function AdminMessages() {
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    const { data } = await api.get("/messages", { params: { limit: 50 } });
    setItems(data.items);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <AdminHeader eyebrow="Inbox" title="Client messages" />

      <div className="space-y-4">
        {items.map((m) => (
          <div
            key={m._id}
            className={`rounded-2xl border p-6 transition-all ${
              m.read ? "border-white/5 bg-white/[0.02]" : "border-gold-light/30 bg-white/[0.03]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                    <Mail size={14} />
                  </div>
                  <div>
                    <div className="font-display text-lg">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.email} · {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {m.subject && (
                  <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-gold-light">
                    {m.subject}
                  </div>
                )}
                <p className="mt-2 max-w-3xl text-sm text-white/80">{m.message}</p>
              </div>
              <div className="flex gap-2">
                {!m.read && (
                  <button
                    onClick={async () => {
                      await api.patch(`/messages/${m._id}/read`);
                      load();
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                    title="Mark read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!confirm("Delete this message?")) return;
                    await api.delete(`/messages/${m._id}`);
                    load();
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-white/5 p-16 text-center text-muted-foreground">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
