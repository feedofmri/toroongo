import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingBag, Settings, DollarSign, MessageSquare, Store, ChevronLeft, Paintbrush, Menu, X } from 'lucide-react';
import { useState } from 'react';
import iconColourful from '../../assets/Logo/icon_colourful.png';
import Navbar from './Navbar';

const sidebarLinks = [
    { to: '/seller', icon: LayoutDashboard, labelKey: 'dashboard', end: true },
    { to: '/seller/products', icon: Package, labelKey: 'products' },
    { to: '/seller/orders', icon: ShoppingBag, labelKey: 'orders' },
    { to: '/seller/blogs', icon: MessageSquare, labelKey: 'blogPosts' },
    { to: '/seller/finance', icon: DollarSign, labelKey: 'finance' },
    { to: '/seller/messages', icon: MessageSquare, labelKey: 'messages' },
    { to: '/seller/storefront-builder', icon: Paintbrush, labelKey: 'storefront' },
    { to: '/seller/settings', icon: Settings, labelKey: 'settings' },
];

export default function SellerDashboardLayout() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    return (
        <div className="min-h-screen bg-surface-bg flex flex-col" dir={i18n.dir()}>
            <Navbar />
            <div className="flex flex-1">
                {/* ── Sidebar ──────────────────────────────────────── */}
                <aside className={`hidden lg:flex flex-col w-60 bg-white border-border-soft min-h-screen sticky top-[64px] ${isRTL ? 'border-l' : 'border-r'}`}>
                    {/* Logo */}
                    <div className="p-5 border-b border-border-soft">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img src={iconColourful} alt="Toroongo" className="w-8 h-8" />
                            <span className="font-bold text-lg text-text-primary">{t('sellerDashboard.title')}</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-brand-primary text-white'
                                        : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'
                                    }`
                                }
                            >
                                <link.icon size={16} />
                                {t(`sellerDashboard.nav.${link.labelKey}`)}
                            </NavLink>
                        ))}
                    </nav>

                    {/* View Store link */}
                    <div className="p-3 border-t border-border-soft">
                        <Link
                            to="/sony-electronics"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-brand-primary rounded-xl hover:bg-surface-bg transition-colors"
                        >
                            <Store size={16} />
                            {t('sellerDashboard.nav.viewStore')}
                        </Link>
                    </div>
                </aside>


                {/* ── Main Content ─────────────────────────────────── */}
                <main className="flex-1 min-w-0">
                    {/* Mobile Navigation (Horizontal Scroll) */}
                    <nav className="lg:hidden flex items-center gap-1.5 p-3 border-b border-border-soft overflow-x-auto no-scrollbar bg-white sticky top-[64px] z-10">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
                                    ${isActive
                                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                        : 'text-text-muted hover:bg-surface-bg hover:text-text-primary border border-transparent hover:border-border-soft'
                                    }`
                                }
                            >
                                <link.icon size={14} />
                                {t(`sellerDashboard.nav.${link.labelKey}`)}
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
