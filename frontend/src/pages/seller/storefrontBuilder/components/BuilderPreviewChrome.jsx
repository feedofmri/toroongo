import React, { useState } from 'react';
import {
    Store, Star, ShoppingCart, Heart, Search, Menu, X,
    MessageSquare, Grid3X3, Tag, Newspaper, Info, FileText, Globe, User,
} from 'lucide-react';
import useBuilderStore from '../store/useBuilderStore.js';
import { useAuth } from '../../../../context/AuthContext';
import iconColourful from '../../../../assets/Logo/icon_colourful.png';

const NAME_SIZE_MAP = {
    sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
    '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
};

const NAV_LINKS = [
    { name: 'Home',     Icon: Store },
    { name: 'Products', Icon: Grid3X3 },
    { name: 'Deals',    Icon: Tag },
    { name: 'Reviews',  Icon: Star },
    { name: 'Blog',     Icon: Newspaper },
    { name: 'About',    Icon: Info },
    { name: 'Policies', Icon: FileText },
];

export function BuilderHeaderChrome() {
    const theme        = useBuilderStore((s) => s.theme);
    const hero         = useBuilderStore((s) => s.hero);
    const heroSelected = useBuilderStore((s) => s.heroSelected);
    const selectHero   = useBuilderStore((s) => s.selectHero);
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const viewportMode = useBuilderStore((s) => s.viewportMode);
    const { user }     = useAuth();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const isMobile     = viewportMode === 'mobile';
    const isDark       = theme.headerStyle === 'dark';
    const isCenterLogo = theme.logoPosition === 'center';

    const headerBg    = 'var(--seller-header-bg, #FFFFFF)';
    const headerText  = isDark ? '#FFFFFF' : '#0F172A';
    const iconColor   = isDark ? 'rgba(255,255,255,0.65)' : '#64748B';
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
    const logoIconBg  = isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9';

    // Hero overrides take priority over profile data
    const storeName   = hero.storeName || user?.store_name || user?.name || 'Your Store';
    const logo        = user?.logo   || null;
    const bannerImage = hero.bannerImage || user?.banner || null;
    const initial     = (user?.name || 'S').charAt(0).toUpperCase();
    const overlayOpacity = (hero.overlayOpacity ?? 70) / 100;

    // Clicking chrome areas (not the banner) deselects everything
    const deselect = (e) => { e.stopPropagation(); selectWidget(null); };

    return (
        <>
            {/* ══ TOP HEADER ══════════════════════════════════════ */}
            <header
                className="z-40 border-b shadow-sm transition-colors"
                style={{ backgroundColor: headerBg, borderColor }}
                onClick={deselect}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center h-14 gap-3 ${isCenterLogo ? 'relative justify-between' : 'justify-between'}`}>

                        {/* Left: Toroongo icon + store name */}
                        <div className={`flex items-center gap-3 min-w-0 ${isCenterLogo ? 'flex-1' : ''}`}>
                            {/* Toroongo icon — hidden on mobile (same as real) */}
                            {!isMobile && (
                                <>
                                    <div className="flex-shrink-0 p-1.5 rounded-lg cursor-pointer"
                                         style={{ color: iconColor }}>
                                        <img src={iconColourful} alt="Toroongo" className="w-6 h-6" />
                                    </div>
                                    <div className="w-px h-6 opacity-20" style={{ backgroundColor: headerText }} />
                                </>
                            )}
                            {!isCenterLogo && (
                                <div className="flex items-center gap-2.5 min-w-0 cursor-pointer">
                                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center"
                                         style={{ backgroundColor: logoIconBg }}>
                                        {logo
                                            ? <img src={logo} alt={storeName} className="w-full h-full object-cover" />
                                            : <Store size={14} style={{ color: iconColor }} />
                                        }
                                    </div>
                                    <span className="text-sm font-bold truncate" style={{ color: headerText }}>
                                        {storeName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Center logo (logoPosition = center) */}
                        {isCenterLogo && (
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 cursor-pointer">
                                <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center"
                                     style={{ backgroundColor: logoIconBg }}>
                                    {logo
                                        ? <img src={logo} alt={storeName} className="w-full h-full object-cover" />
                                        : <Store size={14} style={{ color: iconColor }} />
                                    }
                                </div>
                                <span className="text-sm font-bold" style={{ color: headerText }}>{storeName}</span>
                            </div>
                        )}

                        {/* Center: search bar (desktop only) */}
                        {!isMobile && (
                            <div className="flex flex-1 max-w-md mx-4">
                                <div className="relative w-full">
                                    <Search size={16}
                                           className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                           style={{ color: iconColor }} />
                                    <div className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border"
                                         style={{
                                             backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F8FAFC',
                                             borderColor:     isDark ? 'rgba(255,255,255,0.18)' : '#E2E8F0',
                                             color: isDark ? 'rgba(255,255,255,0.35)' : '#94A3B8',
                                         }}>
                                        Search products...
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right: action icons */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {/* Mobile: search icon */}
                            {isMobile && (
                                <div className="p-2 rounded-lg cursor-pointer" style={{ color: iconColor }}>
                                    <Search size={19} />
                                </div>
                            )}

                            {/* Wishlist — hidden on mobile */}
                            {!isMobile && (
                                <div className="relative p-2 rounded-lg cursor-pointer" style={{ color: iconColor }}>
                                    <Heart size={19} />
                                </div>
                            )}

                            {/* Cart */}
                            <div className="relative p-2 rounded-lg cursor-pointer" style={{ color: iconColor }}>
                                <ShoppingCart size={19} />
                            </div>

                            {/* Language switcher — hidden on mobile */}
                            {!isMobile && (
                                <div className="p-2 rounded-lg cursor-pointer" style={{ color: iconColor }}>
                                    <Globe size={18} />
                                </div>
                            )}

                            {/* Account avatar */}
                            <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                     style={{ backgroundColor: 'var(--seller-brand, #008080)' }}>
                                    {initial}
                                </div>
                            </div>

                            {/* Mobile: hamburger menu toggle */}
                            {isMobile && (
                                <div
                                    className="p-2 rounded-lg cursor-pointer"
                                    style={{ color: iconColor }}
                                    onClick={(e) => { e.stopPropagation(); setMobileNavOpen((v) => !v); }}
                                >
                                    {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ══ STORE BANNER (click to edit) ════════════════════ */}
            <div
                className={`relative overflow-hidden border-b cursor-pointer group transition-all ${heroSelected ? 'ring-2 ring-brand-primary ring-inset' : 'hover:ring-2 hover:ring-brand-primary/40 hover:ring-inset'} ${isMobile ? 'h-44' : 'h-44 sm:h-56 lg:h-64'}`}
                style={{ borderColor }}
                onClick={(e) => { e.stopPropagation(); selectHero(); }}
                title="Click to edit banner"
            >
                {bannerImage ? (
                    <img src={bannerImage} alt={storeName}
                         className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0"
                         style={{ background: 'linear-gradient(135deg, var(--seller-brand, #008080) 0%, var(--seller-brand-secondary, #8B5CF6) 100%)' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
                     style={{ opacity: overlayOpacity }} />

                {/* Edit hint badge */}
                {!heroSelected && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-sm select-none">
                        Click to edit
                    </div>
                )}
                {heroSelected && (
                    <div className="absolute top-3 right-3 bg-brand-primary text-white text-[10px] font-semibold px-2 py-1 rounded-lg select-none">
                        Editing
                    </div>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-5">
                    <div className="flex items-end gap-4 justify-between w-full">
                        <div className="flex items-end gap-3 sm:gap-4">
                            <div className={`rounded-2xl overflow-hidden border-[3px] border-white shadow-lg bg-white flex-shrink-0 flex items-center justify-center text-gray-400 ${isMobile ? 'w-12 h-12' : 'w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem]'}`}>
                                {logo
                                    ? <img src={logo} alt={storeName} className="w-full h-full object-cover" />
                                    : <Store size={isMobile ? 22 : 32} />
                                }
                            </div>
                            <div className="pb-0.5">
                                <h1 className={`leading-tight ${isMobile ? 'text-base' : 'text-lg sm:text-2xl'}`}
                                    style={{
                                        fontFamily: hero.nameFont ? `"${hero.nameFont}", sans-serif` : 'var(--seller-heading-font, Inter, sans-serif)',
                                        fontSize: hero.nameSize ? NAME_SIZE_MAP[hero.nameSize] : undefined,
                                        fontWeight: hero.nameWeight || '700',
                                        color: hero.nameColor || '#ffffff',
                                    }}>
                                    {storeName}
                                </h1>
                                {hero.tagline && (
                                    <p className="text-xs mt-0.5 mb-0.5"
                                       style={{ color: hero.taglineColor || 'rgba(255,255,255,0.8)' }}>
                                        {hero.tagline}
                                    </p>
                                )}
                                {hero.showRating !== false && (
                                    <div className="flex items-center gap-2.5 mt-0.5">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="fill-amber-400 text-amber-400" />
                                            <span className="text-xs text-white/90 font-medium">4.8</span>
                                        </div>
                                        <span className="text-xs text-white/50">·</span>
                                        <span className="text-xs text-white/70">Your products</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hero.showContact !== false && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-900 rounded-xl text-xs font-semibold shadow-lg select-none">
                                <MessageSquare size={13} />
                                {hero.contactText || 'Contact'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ DESKTOP NAV TABS (hidden on mobile) ══════════════ */}
            {!isMobile && (
                <nav className="border-b z-30"
                     style={{ backgroundColor: headerBg, borderColor }}
                     onClick={deselect}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-11">
                            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                                {NAV_LINKS.map(({ name, Icon }, i) => (
                                    <div
                                        key={name}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap cursor-pointer select-none"
                                        style={i === 0
                                            ? { backgroundColor: 'var(--seller-brand, #008080)', color: '#fff' }
                                            : { color: iconColor }
                                        }
                                    >
                                        <Icon size={14} />
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* ══ MOBILE NAV DRAWER ════════════════════════════════ */}
            {isMobile && mobileNavOpen && (
                <div className="border-b px-4 py-3 space-y-1 shadow-sm"
                     style={{ backgroundColor: headerBg, borderColor }}
                     onClick={deselect}>
                    {/* Toroongo.com link */}
                    <div className="flex items-center gap-2.5 px-3 py-2 mb-1 text-sm font-medium rounded-lg cursor-pointer select-none"
                         style={{ color: iconColor }}>
                        <img src={iconColourful} alt="Toroongo" className="w-4 h-4 opacity-80" />
                        Toroongo.com
                    </div>

                    {/* Store Nav section */}
                    <div className="pb-2 mb-2 border-b" style={{ borderColor }}>
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-1"
                           style={{ color: iconColor }}>
                            Store Nav
                        </p>
                        {NAV_LINKS.map(({ name, Icon }, i) => (
                            <div
                                key={name}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer select-none"
                                style={i === 0
                                    ? { backgroundColor: 'var(--seller-brand, #008080)', color: '#fff' }
                                    : { color: iconColor }
                                }
                            >
                                <Icon size={16} />
                                {name}
                            </div>
                        ))}
                    </div>

                    {/* User Actions section */}
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-1"
                       style={{ color: iconColor }}>
                        User Actions
                    </p>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer select-none"
                         style={{ color: iconColor }}>
                        <Heart size={16} /> Wishlist
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer select-none"
                         style={{ color: iconColor }}>
                        <User size={16} /> Account
                    </div>
                </div>
            )}
        </>
    );
}

export function BuilderFooterChrome() {
    const { user }     = useAuth();
    const selectWidget = useBuilderStore((s) => s.selectWidget);
    const storeName    = user?.store_name || user?.name || 'Your Store';
    const logo         = user?.logo || null;

    return (
        <footer className="border-t mt-12 select-none"
                style={{ backgroundColor: 'var(--seller-bg, #F8FAFC)', borderColor: 'rgba(0,0,0,0.06)' }}
                onClick={(e) => { e.stopPropagation(); selectWidget(null); }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center"
                             style={{ borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--seller-text-muted, #64748B)' }}>
                            {logo
                                ? <img src={logo} alt={storeName} className="w-full h-full object-cover" />
                                : <Store size={16} />
                            }
                        </div>
                        <span className="text-sm font-semibold"
                              style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, Inter, sans-serif)' }}>
                            {storeName}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                        <span className="cursor-pointer hover:opacity-80">Policies</span>
                        <span className="cursor-pointer hover:opacity-80">About</span>
                        <span className="cursor-pointer hover:opacity-80">Contact</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                        Powered by
                        <span className="font-semibold" style={{ color: 'var(--seller-brand, #008080)' }}>Toroongo</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
