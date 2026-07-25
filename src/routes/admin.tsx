import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { isAuthed } from "@/lib/auth";
import { useHydrated } from "@/lib/useHydrated";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Paras Arts" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthed()) {
      navigate({ to: "/admin-login" });
    } else {
      setOk(true);
    }
  }, [hydrated, navigate]);

  if (!hydrated || !ok) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
        <div className="text-xs tracking-[0.3em] uppercase text-gold-light">Loading console…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
