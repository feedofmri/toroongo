import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react";
import iconColourful from "../../assets/Logo/icon_colourful.png";
import Navbar from "./Navbar";

const adminNavLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/sellers", icon: Store, label: "Sellers" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-border-soft min-h-screen sticky top-[64px]">
          {/* Header */}
          <div className="p-5 border-b border-border-soft">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={iconColourful} alt="Toroongo" className="w-8 h-8" />
              <span className="font-bold text-lg text-text-primary">Toroongo</span>
            </Link>
            <div className="flex items-center gap-2 px-3 py-2 bg-brand-primary/10 rounded-xl">
              <Shield size={14} className="text-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
                    : "text-text-muted hover:bg-surface-bg hover:text-text-primary"
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Back to platform */}
          <div className="p-3 border-t border-border-soft">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-brand-primary rounded-xl hover:bg-surface-bg transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Platform
            </Link>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Mobile Navigation */}
          <nav className="lg:hidden flex items-center gap-1.5 p-3 border-b border-border-soft overflow-x-auto no-scrollbar bg-white sticky top-[64px] z-10">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
                  ${isActive
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "text-text-muted hover:bg-surface-bg hover:text-text-primary border border-transparent hover:border-border-soft"
                  }`
                }
              >
                <link.icon size={14} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
