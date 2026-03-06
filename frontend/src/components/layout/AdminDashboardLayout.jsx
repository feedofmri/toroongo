import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Layers, DollarSign, AlertTriangle, ChevronLeft } from 'lucide-react';
import iconWhite from '../../assets/Logo/icon_white.png';

const sidebarLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/sellers', icon: Store, label: 'Sellers' },
    { to: '/admin/categories', icon: Layers, label: 'Categories' },
    { to: '/admin/finance', icon: DollarSign, label: 'Finance' },
    { to: '/admin/disputes', icon: AlertTriangle, label: 'Disputes' },
];

export default function AdminDashboardLayout() {
    return (
        <div className="min-h-screen bg-surface-bg">
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-60 bg-slate-900 text-white min-h-screen sticky top-0">
                    <div className="p-5 border-b border-white/10">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img src={iconWhite} alt="Toroongo" className="w-8 h-8" />
                            <span className="font-bold text-lg">Admin Panel</span>
                        </Link>
                    </div>
                    <nav className="flex-1 p-3 space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive ? 'bg-brand-primary text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
                                }
                            >
                                <link.icon size={16} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0">
                    <header className="bg-white border-b border-border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="lg:hidden text-text-muted hover:text-text-primary"><ChevronLeft size={20} /></Link>
                            <h1 className="text-lg font-semibold text-text-primary lg:hidden">Admin Panel</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">A</span>
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-text-primary">Super Admin</span>
                        </div>
                    </header>
                    <div className="p-6"><Outlet /></div>
                </main>
            </div>
        </div>
    );
}
