import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal, adminInput, adminLabel } from "@/components/admin/Modal";

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

type S = { _id: string; title: string; description: string; priceFrom: number; icon?: string };

function AdminServices() {
  const [items, setItems] = useState<S[]>([]);
  const [modal, setModal] = useState<S | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = modal !== "new" && modal ? modal : null;

  async function load() {
    const { data } = await api.get("/services");
    setItems(data.items);
  }
  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      if (modal === "new") await api.post("/services", payload);
      else if (modal) await api.put(`/services/${modal._id}`, payload);
      setModal(null);
      load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Offerings"
        title="Manage services"
        action={
          <button onClick={() => setModal("new")} className="btn-gold">
            <Plus size={14} /> Add service
          </button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((s) => (
          <div key={s._id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-xl">{s.title}</div>
                <p className="mt-2 text-sm text-white/70">{s.description}</p>
                <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-gold-light">
                  From ₹{s.priceFrom}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setModal(s)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete?")) return;
                    await api.delete(`/services/${s._id}`);
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
            No services yet.
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "Add service" : "Edit service"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className={adminLabel}>Title</span>
            <input required name="title" defaultValue={editing?.title} className={adminInput} />
          </label>
          <label className="block">
            <span className={adminLabel}>Description</span>
            <textarea required name="description" defaultValue={editing?.description} rows={4} className={adminInput + " resize-none"} />
          </label>
          <label className="block">
            <span className={adminLabel}>Price from (INR)</span>
            <input type="number" name="priceFrom" defaultValue={editing?.priceFrom ?? 0} className={adminInput} />
          </label>
          <button disabled={busy} className="btn-gold w-full">
            {busy ? "Saving…" : "Save service"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
