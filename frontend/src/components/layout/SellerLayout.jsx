import React from 'react';
import { Outlet, NavLink, Link, useParams } from 'react-router-dom';
import { Store, Grid3X3, Info, FileText, Star } from 'lucide-react';
import { sellers, products } from '../../data/mockData';
import { resolveSellerTheme } from '../../theme/sellerTheme';

export default function SellerLayout() {
    const { slug } = useParams();
    const seller = sellers.find((s) => s.slug === slug || s.id === parseInt(slug));

    if (!seller) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-2xl font-bold text-text-primary mb-3">Store Not Found</h1>
                <p className="text-text-muted mb-6">This seller doesn't exist or has been removed.</p>
                <Link to="/" className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    const theme = resolveSellerTheme({ brandColor: seller.brandColor });
    const sellerProducts = products.filter((p) => p.sellerId === seller.id);

    const navLinks = [
        { to: `/shop/${slug}`, label: 'Home', icon: Store, end: true },
        { to: `/shop/${slug}/products`, label: 'Products', icon: Grid3X3 },
        { to: `/shop/${slug}/about`, label: 'About', icon: Info },
        { to: `/shop/${slug}/policies`, label: 'Policies', icon: FileText },
    ];

    return (
        <div className="animate-fade-in" style={theme}>
            {/* ── Store Banner ──────────────────────────────────── */}
            <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden bg-slate-900">
                <img
                    src={seller.banner}
                    alt={`${seller.name} banner`}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
                    <div className="flex items-end gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                            <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="pb-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{seller.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1">
                                    <Star size={13} className="fill-amber-400 text-amber-400" />
                                    <span className="text-sm text-white/90 font-medium">{seller.rating}</span>
                                </div>
                                <span className="text-sm text-white/60">·</span>
                                <span className="text-sm text-white/70">{sellerProducts.length} products</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Seller Nav Bar ────────────────────────────────── */}
            <nav className="border-b border-border-soft bg-white sticky top-[64px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                  ${isActive
                                        ? 'text-white'
                                        : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'
                                    }`
                                }
                                style={({ isActive }) => isActive ? { backgroundColor: 'var(--seller-brand)' } : {}}
                            >
                                <link.icon size={15} />
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            {/* ── Content ───────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet context={{ seller, sellerProducts, theme }} />
            </div>
        </div>
    );
}
