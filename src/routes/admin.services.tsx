
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { api, assetUrl } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Modal,
  adminInput,
  adminLabel,
} from "@/components/admin/Modal";

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

type Service = {
  _id: string;
  title: string;
  description: string;
  priceFrom: number;
  icon?: string;
  image?: string;
  imagePublicId?: string;
  delivery?: string;
};

const ICON_OPTIONS = [
  "Brush",
  "Heart",
  "Users",
  "PawPrint",
  "Car",
];

function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [modal, setModal] = useState<Service | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const editing =
    modal !== "new" && modal ? modal : null;

  async function load() {
    try {
      const { data } = await api.get("/services");
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setError("Failed to load services.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setBusy(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (modal === "new") {
        await api.post("/services", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (modal) {
        await api.put(
          `/services/${modal._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setModal(null);
      await load();
    } catch (err: any) {
      console.error("Service save error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteService(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this service?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      await load();
    } catch (err: any) {
      console.error("Service delete error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete service."
      );
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Offerings"
        title="Manage services"
        action={
          <button
            onClick={() => {
              setError("");
              setModal("new");
            }}
            className="btn-gold"
          >
            <Plus size={14} />
            Add service
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((service) => (
          <div
            key={service._id}
            className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            {service.image ? (
              <div className="h-56 w-full overflow-hidden bg-black/20">
                <img
                  src={assetUrl(service.image)}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center bg-white/[0.02] text-white/30">
                <div className="text-center">
                  <Upload
                    size={30}
                    className="mx-auto mb-2"
                  />
                  <p className="text-xs">
                    No image uploaded
                  </p>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-display text-xl">
                    {service.title}
                  </div>

                  <p className="mt-2 text-sm text-white/70">
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold-light">
                      From ₹{service.priceFrom}
                    </div>

                    {service.delivery && (
                      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                        {service.delivery}
                      </div>
                    )}
                  </div>

                  {service.icon && (
                    <div className="mt-3 text-xs text-white/40">
                      Icon: {service.icon}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setError("");
                      setModal(service);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-gold-light hover:text-gold-light"
                    title="Edit service"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() =>
                      deleteService(service._id)
                    }
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:border-destructive hover:text-destructive"
                    title="Delete service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/5 p-16 text-center text-muted-foreground">
            <div className="mb-3 text-lg text-white/70">
              No services yet.
            </div>

            <p className="text-sm">
              Click "Add service" to create your first
              service.
            </p>
          </div>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => {
          if (!busy) {
            setModal(null);
            setError("");
          }
        }}
        title={
          modal === "new"
            ? "Add service"
            : "Edit service"
        }
      >
        <form
          onSubmit={onSubmit}
          className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto pr-2"
        >
          <label className="block">
            <span className={adminLabel}>
              Title
            </span>

            <input
              required
              name="title"
              defaultValue={editing?.title || ""}
              className={adminInput}
              placeholder="Custom Portrait"
            />
          </label>

          <label className="block">
            <span className={adminLabel}>
              Description
            </span>

            <textarea
              required
              name="description"
              defaultValue={
                editing?.description || ""
              }
              rows={4}
              className={adminInput + " resize-none"}
              placeholder="Describe this service..."
            />
          </label>

          <label className="block">
            <span className={adminLabel}>
              Price from (INR)
            </span>

            <input
              required
              type="number"
              min="0"
              name="priceFrom"
              defaultValue={
                editing?.priceFrom ?? 0
              }
              className={adminInput}
              placeholder="1000"
            />
          </label>

          <label className="block">
            <span className={adminLabel}>
              Delivery time
            </span>

            <input
              name="delivery"
              defaultValue={
                editing?.delivery || ""
              }
              className={adminInput}
              placeholder="3–5 weeks"
            />
          </label>

          <label className="block">
            <span className={adminLabel}>
              Icon
            </span>

            <select
              name="icon"
              defaultValue={
                editing?.icon || "Brush"
              }
              className={adminInput}
            >
              {ICON_OPTIONS.map((icon) => (
                <option
                  key={icon}
                  value={icon}
                >
                  {icon}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={adminLabel}>
              Service image
            </span>

            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white hover:border-white/20"
            />

            <p className="mt-2 text-xs text-white/40">
              JPG, PNG, WEBP or GIF. Maximum 8 MB.
            </p>

            {editing?.image && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-white/40">
                  Current image:
                </p>

                <img
                  src={assetUrl(editing.image)}
                  alt={editing.title}
                  className="h-24 w-full max-w-md rounded-xl object-cover sm:h-28"
                />
              </div>
            )}
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            disabled={busy}
            className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Uploading & saving…"
              : modal === "new"
              ? "Add service"
              : "Save changes"}
          </button>
        </form>
      </Modal>
    </div>
  );
}