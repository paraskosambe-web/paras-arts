import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ImageIcon,
  ShoppingBag,
  Mail,
  Star,
  Wrench,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { logout } from "@/lib/auth";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
] as const;

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-[#0f0f0f] lg:flex lg:flex-col">
      <div className="border-b border-white/5 px-6 py-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mt-3 text-[10px] tracking-[0.4em] uppercase text-gold-light">
          Admin Console
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                active
                  ? "bg-gold-gradient text-[#121212]"
                  : "text-white/70 hover:bg-white/5 hover:text-gold-light"
              }`}
            >
              <Icon size={16} />
              <span className="tracking-wide">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <button
          onClick={() => {
            logout();
            navigate({ to: "/admin-login" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-destructive"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
