import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"] as const;

type Order = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  sketchType: string;
  paperSize: string;
  budget?: number;
  status: (typeof STATUSES)[number];
  createdAt: string;
};

function AdminOrders() {
  const [items, setItems] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  async function load() {
    const { data } = await api.get("/orders", {
      params: { search, status, page, limit: 15 },
    });
    setItems(data.items);
    setPages(data.pages || 1);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function updateStatus(id: string, s: string) {
    await api.patch(`/orders/${id}/status`, { status: s });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    load();
  }

  const statusColor: Record<string, string> = {
    Pending: "text-yellow-300",
    Accepted: "text-sky-300",
    "In Progress": "text-gold-light",
    Completed: "text-emerald-300",
    Cancelled: "text-destructive",
  };

  return (
    <div>
      <AdminHeader eyebrow="Commissions" title="Manage orders" />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load();
              }
            }}
            placeholder="Search by name, email, phone…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-5 text-sm outline-none focus:border-gold-light/50"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-gold-light/50"
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-white/[0.03] text-[10px] tracking-[0.3em] uppercase text-gold-light">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Size</th>
              <th className="p-4 text-left">Budget</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o._id} className="border-t border-white/5">
                <td className="p-4">
                  <div>{o.fullName}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                  {o.phone && <div className="text-xs text-muted-foreground">{o.phone}</div>}
                </td>
                <td className="p-4">{o.sketchType}</td>
                <td className="p-4 text-muted-foreground">{o.paperSize}</td>
                <td className="p-4">{o.budget ? `₹${o.budget}` : "—"}</td>
                <td className="p-4 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-xs ${statusColor[o.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} className="bg-[#141414] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => remove(o._id)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="text-xs tracking-[0.3em] uppercase text-gold-light">
            Page {page} / {pages}
          </div>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
