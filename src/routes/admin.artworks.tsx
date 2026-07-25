import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { api, assetUrl, API_URL } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal, adminInput, adminLabel } from "@/components/admin/Modal";

export const Route = createFileRoute("/admin/artworks")({
  component: AdminArtworks,
});

type Artwork = {
  _id: string;
  title: string;
  category: string;
  medium: string;
  paperSize: string;
  description: string;
  image: string;
  price?: number;
  featured?: boolean;
};

const CATS = ["Portrait", "Couple", "Family", "Pet", "Automotive", "Other"];

function AdminArtworks() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modal, setModal] = useState<Artwork | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data } = await api.get(`/artworks`, {
        params: { search, page, limit: 8 },
      });
      setItems(data.items);
      setPages(data.pages || 1);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setErr("");
    try {
      if (modal === "new") {
        await api.post("/artworks", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (modal) {
        await api.put(`/artworks/${modal._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModal(null);
      load();
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    await api.delete(`/artworks/${id}`);
    load();
  }

  const editing = modal !== "new" && modal ? modal : null;

  return (
    <div>
      <AdminHeader
        eyebrow="Gallery"
        title="Manage artworks"
        action={
          <button onClick={() => setModal("new")} className="btn-gold">
            <Plus size={14} /> Add artwork
          </button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
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
            placeholder="Search artworks…"
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-5 text-sm outline-none focus:border-gold-light/50"
          />
        </div>
        <button
          onClick={() => {
            setPage(1);
            load();
          }}
          className="btn-ghost-gold text-xs"
        >
          Search
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-[10px] tracking-[0.3em] uppercase text-gold-light">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Medium</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id} className="border-t border-white/5">
                <td className="p-4">
                  <img
                    src={assetUrl(a.image)}
                    alt={a.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </td>
                <td className="p-4">{a.title}</td>
                <td className="p-4 text-gold-light">{a.category}</td>
                <td className="p-4 text-muted-foreground">{a.medium}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => setModal(a)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(a._id)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground">
                  {API_URL ? "No artworks yet." : "Set VITE_API_URL to connect to the backend."}
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

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal === "new" ? "Add artwork" : "Edit artwork"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={adminLabel}>Title</span>
              <input required name="title" defaultValue={editing?.title} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Category</span>
              <select name="category" defaultValue={editing?.category ?? "Portrait"} className={adminInput}>
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={adminLabel}>Medium</span>
              <input name="medium" defaultValue={editing?.medium} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Paper size</span>
              <input name="paperSize" defaultValue={editing?.paperSize} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Price (INR)</span>
              <input type="number" name="price" defaultValue={editing?.price ?? 0} className={adminInput} />
            </label>
            <label className="block">
              <span className={adminLabel}>Image {editing ? "(leave blank to keep)" : ""}</span>
              <input type="file" name="image" accept="image/*" required={!editing} className={adminInput} />
            </label>
          </div>
          <label className="block">
            <span className={adminLabel}>Description</span>
            <textarea
              name="description"
              defaultValue={editing?.description}
              rows={4}
              className={adminInput + " resize-none"}
            />
          </label>
          <button disabled={busy} className="btn-gold w-full">
            {busy ? "Saving…" : "Save artwork"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
