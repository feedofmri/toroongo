import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Package, Heart, Settings, MessageSquare, User, Star, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
    { to: '/account', icon: Package, label: 'My Orders', end: true },
    { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
    { to: '/account/reviews', icon: Star, label: 'My Reviews' },
    { to: '/account/settings', icon: Settings, label: 'Settings' },
    { to: '/account/messages', icon: MessageSquare, label: 'Messages' },
];

export default function BuyerDashboardLayout() {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <div className="animate-fade-in bg-white min-h-screen">
            {/* Mobile Navigation (Horizontal Scroll & Sticky) */}
            <nav className="lg:hidden flex items-center gap-1.5 p-3 overflow-x-auto no-scrollbar bg-white border-b border-border-soft sticky top-[64px] z-10">
                {sidebarLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all
                            ${isActive
                                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                : 'text-text-muted bg-surface-bg/50 border border-border-soft'
                            }`
                        }
                    >
                        <link.icon size={16} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar (Desktop) */}
                    <aside className="hidden lg:block lg:w-56 flex-shrink-0">
                        <nav className="flex flex-col gap-1 sticky top-[80px]">
                            {sidebarLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'
                                        }`
                                    }
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
