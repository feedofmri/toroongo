import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, ShoppingBag, Package,
  Tag, Settings, Shield, LogOut, Menu, X, ChevronDown,
  Bell, ExternalLink, CreditCard, Star, BookOpen, Image, Percent,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/',               icon: LayoutDashboard, label: 'Overview',      end: true },
  { to: '/users',          icon: Users,           label: 'Users'                   },
  { to: '/sellers',        icon: Store,           label: 'Sellers'                 },
  { to: '/orders',         icon: ShoppingBag,     label: 'Orders'                  },
  { to: '/products',       icon: Package,         label: 'Products'                },
  { to: '/categories',     icon: Tag,             label: 'Categories'              },
  { to: '/subscriptions',  icon: CreditCard,      label: 'Subscriptions'           },
  { to: '/reviews',        icon: Star,            label: 'Reviews'                 },
  { to: '/blogs',          icon: BookOpen,        label: 'Blogs'                   },
  { to: '/banners',        icon: Image,           label: 'Banners'                 },
  { to: '/discounts',      icon: Percent,         label: 'Discounts'               },
  { to: '/settings',       icon: Settings,        label: 'Settings'                },
];

function NavItem({ link, collapsed, onClick }) {
  return (
    <NavLink
      to={link.to}
      end={link.end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
        ${isActive
          ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/25'
          : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'
        } ${collapsed ? 'justify-center' : ''}`
      }
      title={collapsed ? link.label : undefined}
    >
      <link.icon size={17} className="flex-shrink-0" />
      {!collapsed && <span>{link.label}</span>}
    </NavLink>
  );
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const initials = (user?.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-bg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-text-primary leading-none">{user?.name}</p>
          <p className="text-[10px] text-text-muted mt-0.5">Administrator</p>
        </div>
        <ChevronDown size={14} className="text-text-muted hidden sm:block" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border-soft z-20 overflow-hidden">
            <div className="p-3 border-b border-border-soft bg-surface-bg/50">
              <p className="text-sm font-bold text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.email}</p>
            </div>
            <div className="p-2">
              <a
                href={import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-text-muted hover:bg-surface-bg hover:text-text-primary transition-colors"
              >
                <ExternalLink size={14} /> View Platform
              </a>
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg flex">

      {/* ── Desktop Sidebar ───────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-border-soft min-h-screen sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-border-soft flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-base text-text-primary leading-none">Toroongo</p>
              <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider mt-0.5">Admin CRM</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(link => <NavItem key={link.to} link={link} />)}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-soft flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-surface-bg rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user?.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
              <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b border-border-soft flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-text-primary">Toroongo</p>
                  <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">Admin CRM</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {NAV.map(link => <NavItem key={link.to} link={link} onClick={() => setSidebarOpen(false)} />)}
            </nav>
            <div className="p-3 border-t border-border-soft">
              <button onClick={() => { setSidebarOpen(false); logout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border-soft h-16 flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <Menu size={20} />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-text-primary">CRM</span>
          </div>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-surface-bg text-text-muted hover:text-text-primary transition-colors relative">
              <Bell size={18} />
            </button>
            <UserMenu user={user} logout={logout} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
