import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, Heart, Settings, MessageSquare, User } from 'lucide-react';

const sidebarLinks = [
    { to: '/account', icon: Package, label: 'My Orders', end: true },
    { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
    { to: '/account/settings', icon: Settings, label: 'Settings' },
    { to: '/account/messages', icon: MessageSquare, label: 'Messages' },
];

export default function BuyerDashboardLayout() {
    return (
        <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <User size={24} className="text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">My Account</h1>
                        <p className="text-sm text-text-muted">Manage your orders, wishlist, and account settings</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-56 flex-shrink-0">
                        <nav className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                            {sidebarLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
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
