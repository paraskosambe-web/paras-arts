import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import heroImg from "@/assets/hero.jpg";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin — Paras Arts" },
      { name: "description", content: "Private administrative access for Paras Arts studio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] pl-12 pr-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50";

function AdminLoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(String(fd.get("email")), String(fd.get("password")));
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/"><Logo /></Link>
          <div className="max-w-md">
            <div className="text-[10px] tracking-[0.4em] uppercase text-gold-light">Private Access</div>
            <h2 className="mt-4 font-display text-4xl leading-tight">The atelier, behind the curtain.</h2>
            <p className="mt-4 text-white/70">
              Manage commissions, gallery uploads, and client conversations from a single quiet console.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10"><Link to="/"><Logo /></Link></div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold-light">Admin Portal</div>
          <h1 className="mt-3 font-display text-4xl">Sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">Access is restricted to studio staff.</p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Email</span>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-light" />
                <input required name="email" type="email" placeholder="admin@parasarts.com" className={inputCls} />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-light" />
                <input required name="password" type="password" placeholder="••••••••" className={inputCls} />
              </div>
            </label>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button disabled={busy} type="submit" className="btn-gold w-full">
              {busy ? "Signing in…" : "Sign in"} <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-gold-light">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
