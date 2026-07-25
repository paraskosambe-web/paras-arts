import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { api, assetUrl } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal, adminInput, adminLabel } from "@/components/admin/Modal";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
});

type T = {
  _id: string;
  name: string;
  location?: string;
  quote: string;
  rating: number;
  image?: string;
};

function AdminTestimonials() {
  const [items, setItems] = useState<T[]>([]);
  const [modal, setModal] = useState<T | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = modal !== "new" && modal ? modal : null;

  async function load() {
    const { data } = await api.get("/testimonials");
    setItems(data.items);
  }
  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      if (modal === "new") {
        await api.post("/testimonials", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (modal) {
        await api.put(`/testimonials/${modal._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModal(null);
      load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Reviews"
        title="Manage testimonials"
        action={
          <button onClick={() => setModal("new")} className="btn-gold">
            <Plus size={14} /> Add testimonial
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((t) => (
          <div key={t._id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-start gap-4">
              {t.image ? (
                <img src={assetUrl(t.image)} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-[#121212]">
                  {t.name.slice(0, 1)}
                </div>
              )}
              <div className="flex-1">
                <div className="font-display text-lg">{t.name}</div>
                {t.location && <div className="text-xs text-muted-foreground">{t.location}</div>}
                <div className="mt-1 flex gap-0.5 text-gold-light">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-white/75">"{t.quote}"</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setModal(t)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete?")) return;
                    await api.delete(`/testimonials/${t._id}`);
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
          <div className="col-span-full rounded-2xl border border-white/5 p-16 text-center text-muted-foreground">
            No testimonials yet.
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "Add testimonial" : "Edit testimonial"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={adminLabel}>Name</span>
              <input required name="name" defaultValue={editing?.name} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Location</span>
              <input name="location" defaultValue={editing?.location} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Rating (1–5)</span>
              <input type="number" min={1} max={5} name="rating" defaultValue={editing?.rating ?? 5} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Photo (optional)</span>
              <input type="file" name="image" accept="image/*" className={adminInput} />
            </label>
          </div>
          <label className="block">
            <span className={adminLabel}>Quote</span>
            <textarea required name="quote" defaultValue={editing?.quote} rows={4} className={adminInput + " resize-none"} />
          </label>
          <button disabled={busy} className="btn-gold w-full">
            {busy ? "Saving…" : "Save testimonial"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
