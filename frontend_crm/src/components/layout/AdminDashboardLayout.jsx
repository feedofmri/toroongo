import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
    LayoutDashboard, Users, Store, Layers, DollarSign,
    AlertTriangle, Shield, Settings, History, Activity
} from 'lucide-react';
import iconWhite from '../../assets/Logo/icon_white.png';
import AdminNavbar from './AdminNavbar';

const sidebarLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/sellers', icon: Store, label: 'Sellers' },
    { to: '/categories', icon: Layers, label: 'Categories' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
    { to: '/disputes', icon: AlertTriangle, label: 'Disputes' },
    { to: '/logs', icon: History, label: 'Audit Logs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AdminDashboardLayout() {
    return (
        <div className="min-h-screen bg-surface-bg flex flex-col">
            <AdminNavbar />
            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-[calc(100vh-64px)] sticky top-[64px] border-r border-white/5">
                    <div className="p-6 border-b border-white/10 bg-slate-950/20">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                <Shield size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-base leading-tight">Toroongo</h1>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Command Center</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
                        <div className="px-3 mb-4 mt-2">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Main Menu</p>
                        </div>
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${isActive
                                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 active:scale-95'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'}`
                                }
                            >
                                <link.icon size={18} className="transition-transform group-hover:scale-110" />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-white/10">
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                            <p className="text-xs text-white/40 mb-2">Build v1.0.4 - CRM PRO</p>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-white/60 tracking-wider">SYSTEM ONLINE</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0 bg-[#F1F5F9]">
                    {/* Mobile Quick Nav */}
                    <nav className="lg:hidden flex items-center gap-2 p-3 border-b border-border-soft overflow-x-auto no-scrollbar bg-white sticky top-[64px] z-30">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
                                    ${isActive
                                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                        : 'text-text-muted hover:bg-surface-bg hover:text-text-primary border border-border-soft/50'
                                    }`
                                }
                            >
                                <link.icon size={14} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
