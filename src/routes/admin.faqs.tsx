import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal, adminInput, adminLabel } from "@/components/admin/Modal";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqs,
});

type F = { _id: string; question: string; answer: string; order?: number };

function AdminFaqs() {
  const [items, setItems] = useState<F[]>([]);
  const [modal, setModal] = useState<F | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const editing = modal !== "new" && modal ? modal : null;

  async function load() {
    const { data } = await api.get("/faqs");
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
      if (modal === "new") await api.post("/faqs", payload);
      else if (modal) await api.put(`/faqs/${modal._id}`, payload);
      setModal(null);
      load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Knowledge"
        title="Manage FAQs"
        action={
          <button onClick={() => setModal("new")} className="btn-gold">
            <Plus size={14} /> Add FAQ
          </button>
        }
      />

      <div className="space-y-4">
        {items.map((f) => (
          <div key={f._id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-display text-lg">{f.question}</div>
                <p className="mt-2 text-sm text-white/70">{f.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal(f)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete?")) return;
                    await api.delete(`/faqs/${f._id}`);
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
            No FAQs yet.
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "Add FAQ" : "Edit FAQ"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className={adminLabel}>Question</span>
            <input required name="question" defaultValue={editing?.question} className={adminInput} />
          </label>
          <label className="block">
            <span className={adminLabel}>Answer</span>
            <textarea required name="answer" defaultValue={editing?.answer} rows={5} className={adminInput + " resize-none"} />
          </label>
          <label className="block">
            <span className={adminLabel}>Display order</span>
            <input type="number" name="order" defaultValue={editing?.order ?? 0} className={adminInput} />
          </label>
          <button disabled={busy} className="btn-gold w-full">
            {busy ? "Saving…" : "Save FAQ"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
