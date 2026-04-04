import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingBag, Settings, DollarSign, MessageSquare, Store, ChevronLeft, Paintbrush } from 'lucide-react';
import iconColourful from '../../assets/Logo/icon_colourful.png';

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
        <div className="min-h-screen bg-surface-bg" dir={i18n.dir()}>
            <div className="flex">
                {/* ── Sidebar ──────────────────────────────────────── */}
                <aside className={`hidden lg:flex flex-col w-60 bg-white border-border-soft min-h-screen sticky top-0 ${isRTL ? 'border-l' : 'border-r'}`}>
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
                    {/* Top bar */}
                    <header className="bg-white border-b border-border-soft px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <Link to="/" className={`lg:hidden text-text-muted hover:text-text-primary ${isRTL ? 'rotate-180' : ''}`}>
                                <ChevronLeft size={20} />
                            </Link>
                            <h1 className="text-lg font-semibold text-text-primary lg:hidden">{t('sellerDashboard.title')}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-brand-primary">SE</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-text-primary">Sony Electronics</p>
                                <p className="text-[11px] text-text-muted">Premium Seller</p>
                            </div>
                        </div>
                    </header>

                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
