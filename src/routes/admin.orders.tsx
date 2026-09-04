import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  CalendarDays,
  FileText,
  Ruler,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api, assetUrl } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

type PaymentStatus = "Pending" | "Paid" | "Verified";

type Order = {
  _id: string;
  orderId: string;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  country?: string;
  sketchType: string;
  paperSize: string;
  budget?: number;
  preferredDate?: string;
  referenceImage?: string;
  notes?: string;
  status: (typeof STATUSES)[number];
  paymentStatus?: PaymentStatus;
  createdAt: string;
};

function AdminOrders() {
  const [items, setItems] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState<string | null>(
    null,
  );

  async function load() {
    try {
      setLoading(true);

      const { data } = await api.get("/orders", {
        params: {
          search,
          status,
          page,
          limit: 15,
        },
      });

      setItems(data.items || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  async function updateStatus(id: string, newStatus: string) {
    try {
      await api.patch(`/orders/${id}/status`, {
        status: newStatus,
      });

      load();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }

  async function verifyPayment(id: string) {
    if (verifyingPayment) return;

    const confirmed = confirm(
      "Have you checked the payment and confirmed that ₹200 was received?",
    );

    if (!confirmed) return;

    try {
      setVerifyingPayment(id);

      await api.patch(`/orders/${id}/verify-payment`);

      await load();
    } catch (err) {
      console.error("Failed to verify payment:", err);
      alert("Unable to verify payment. Please try again.");
    } finally {
      setVerifyingPayment(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this order?")) return;

    try {
      await api.delete(`/orders/${id}`);

      load();
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  }

  const statusColor: Record<string, string> = {
    Pending: "text-yellow-300",
    Accepted: "text-sky-300",
    "In Progress": "text-gold-light",
    Completed: "text-emerald-300",
    Cancelled: "text-red-400",
  };

  const paymentStatus = (payment: PaymentStatus | undefined) =>
    payment || "Pending";

  const paymentColor: Record<PaymentStatus, string> = {
    Pending: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    Paid: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    Verified: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <div>
      <AdminHeader eyebrow="Commissions" title="Manage orders" />

      {/* SEARCH + FILTER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md sm:flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-light"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load();
              }
            }}
            placeholder="Search by name, email, phone..."
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-5 text-sm text-white outline-none transition-colors placeholder:text-muted-foreground focus:border-gold-light/50"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-full border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-gold-light/50 sm:w-auto"
        >
          <option value="All" className="bg-[#141414] text-white">
            All
          </option>

          {STATUSES.map((s) => (
            <option
              key={s}
              value={s}
              className="bg-[#141414] text-white"
            >
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mb-5 rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center text-sm text-muted-foreground">
          Loading orders...
        </div>
      )}

      {/* ORDERS */}
      <div className="space-y-5">
        {items.map((o) => {
          const currentPaymentStatus = paymentStatus(o.paymentStatus);

          return (
            <div
              key={o._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-colors hover:border-gold-light/20"
            >
              {/* TOP SECTION */}
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* CUSTOMER */}
                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-gold-light">
                      Customer
                    </div>

                    <h2 className="font-display text-xl text-white sm:text-2xl">
                      {o.fullName}
                    </h2>

                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 break-all">
                        <Mail
                          size={14}
                          className="shrink-0 text-gold-light"
                        />
                        {o.email}
                      </div>

                      {o.phone && (
                        <div className="flex items-center gap-2">
                          <Phone
                            size={14}
                            className="shrink-0 text-gold-light"
                          />
                          {o.phone}
                        </div>
                      )}

                      {o.whatsapp && (
                        <div className="flex items-center gap-2">
                          <MessageCircle
                            size={14}
                            className="shrink-0 text-gold-light"
                          />
                          {o.whatsapp}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STATUS + DELETE */}
                  <div className="flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto lg:justify-end">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o._id, e.target.value)
                      }
                      className={`rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-center text-xs outline-none ${statusColor[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-[#141414] text-white"
                        >
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => remove(o._id)}
                      title="Delete order"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* ORDER ID + PAYMENT */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {/* ORDER ID */}
                  <div className="rounded-2xl border border-gold-light/20 bg-gold-light/[0.04] p-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gold-light">
                      Order ID
                    </div>

                    <div className="mt-2 break-all font-mono text-sm font-semibold tracking-wider text-white">
                      {o.orderId || "Not available"}
                    </div>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold-light">
                      <CreditCard size={14} />
                      Payment Status
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] ${paymentColor[currentPaymentStatus]}`}
                      >
                        {currentPaymentStatus}
                      </span>

                      {currentPaymentStatus === "Paid" && (
                        <button
                          type="button"
                          onClick={() => verifyPayment(o._id)}
                          disabled={verifyingPayment === o._id}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-300/60 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {verifyingPayment === o._id ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              Verify Payment
                            </>
                          )}
                        </button>
                      )}

                      {currentPaymentStatus === "Verified" && (
                        <span className="flex items-center gap-2 text-xs text-emerald-300">
                          <CheckCircle2 size={15} />
                          Payment confirmed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER INFORMATION */}
              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
                {/* SKETCH TYPE */}
                <InfoBox
                  icon={<FileText size={15} />}
                  label="Sketch Type"
                  value={o.sketchType}
                />

                {/* PAPER SIZE */}
                <InfoBox
                  icon={<Ruler size={15} />}
                  label="Paper Size"
                  value={o.paperSize}
                />

                {/* BUDGET */}
                <InfoBox
                  icon={<IndianRupee size={15} />}
                  label="Budget"
                  value={
                    o.budget
                      ? `₹${o.budget.toLocaleString("en-IN")}`
                      : "Not specified"
                  }
                />

                {/* DATE */}
                <InfoBox
                  icon={<CalendarDays size={15} />}
                  label="Preferred Delivery"
                  value={
                    o.preferredDate
                      ? new Date(
                          o.preferredDate,
                        ).toLocaleDateString()
                      : "Not specified"
                  }
                />

                {/* COUNTRY */}
                <InfoBox
                  icon={<MapPin size={15} />}
                  label="Country"
                  value={o.country || "Not specified"}
                />

                {/* ORDER DATE */}
                <InfoBox
                  icon={<CalendarDays size={15} />}
                  label="Order Date"
                  value={new Date(o.createdAt).toLocaleDateString()}
                />
              </div>

              {/* ADDRESS */}
              {(o.address || o.country) && (
                <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-light">
                    <MapPin size={14} />
                    Delivery Address
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-white/80">
                    {o.address || "Address not provided"}
                    {o.country ? `, ${o.country}` : ""}
                  </p>
                </div>
              )}

              {/* NOTES */}
              {o.notes && (
                <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-light">
                    <FileText size={14} />
                    Additional Notes
                  </div>

                  <p className="whitespace-pre-wrap rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-white/80">
                    {o.notes}
                  </p>
                </div>
              )}

              {/* REFERENCE IMAGE */}
              <div className="border-t border-white/10 px-5 py-5 sm:px-6">
                <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-light">
                  <ImageIcon size={14} />
                  Reference Image
                </div>

                {o.referenceImage ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(assetUrl(o.referenceImage))
                    }
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                  >
                    <img
                      src={assetUrl(o.referenceImage)}
                      alt={`Reference image for ${o.fullName}`}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-60 md:h-72"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <span className="rounded-full bg-black/70 px-4 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to view
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
                    No reference image uploaded.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* NO ORDERS */}
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:border-gold-light disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="px-3 text-xs uppercase tracking-[0.25em] text-gold-light">
            Page {page} / {pages}
          </div>

          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:border-gold-light disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -right-3 -top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#141414] text-white shadow-lg hover:border-gold-light hover:text-gold-light"
            >
              <X size={18} />
            </button>

            <img
              src={selectedImage}
              alt="Reference image"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* INFO BOX */
function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold-light">
        {icon}
        {label}
      </div>

      <div className="break-words text-sm text-white/85">
        {value}
      </div>
    </div>
  );
}