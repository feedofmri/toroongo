import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Store, Grid3X3, Info, FileText, Star, MessageSquare, ShieldCheck,
    ShoppingCart, Heart, User, Search, LogOut, ChevronLeft, Menu, X, Loader2,
    Tag, Newspaper
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveSellerTheme } from '../../theme/sellerTheme';
import { themeToCSS, createDefaultTheme } from '../../pages/seller/storefrontBuilder/schema/storefrontSchema';
import { getStorefrontConfig } from '../../pages/seller/storefrontBuilder/services/storefrontService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import LanguageSwitcher from './LanguageSwitcher';
import { messageService } from '../../services';
import { api } from '../../services/api';
import iconColourful from '../../assets/Logo/icon_colourful.png';

export default function SellerLayout() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [seller, setSeller] = useState(null);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [storefrontConfig, setStorefrontConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const { wishlistCount } = useWishlist();

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const userDropdownRef = useRef(null);

    useEffect(() => {
        const fetchSellerData = async () => {
            setIsLoading(true);
            try {
                const sellerData = await api(`/users/sellers/${slug}`);
                setSeller(sellerData);

                const [productsData, config] = await Promise.allSettled([
                    api(`/products/seller/${sellerData.id}`),
                    getStorefrontConfig(sellerData.id),
                ]);

                setSellerProducts(productsData.status === 'fulfilled' ? (productsData.value || []) : []);
                setStorefrontConfig(config.status === 'fulfilled' ? config.value : null);
                setError(null);
            } catch (err) {
                console.error("Seller not found", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchSellerData();
    }, [slug]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        }
        if (userDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userDropdownOpen]);

    const resolvedTheme = storefrontConfig?.theme || null;
    const themeVars = resolvedTheme
        ? themeToCSS(resolvedTheme)
        : resolveSellerTheme({ brandColor: seller?.brand_color || seller?.brandColor });

    const isDarkHeader = resolvedTheme?.headerStyle === 'dark';
    const isCenterLogo = resolvedTheme?.logoPosition === 'center';
    const isSticky = resolvedTheme ? resolvedTheme.stickyHeader !== false : true;

    // Computed theme helpers — derived at render time so hover classes are static strings
    const hoverBg = isDarkHeader ? 'hover:bg-white/10' : 'hover:bg-black/5';
    const iconColor = isDarkHeader ? 'rgba(255,255,255,0.65)' : '#64748B';
    const headerText = isDarkHeader ? '#FFFFFF' : 'var(--seller-text, #0F172A)';
    const headerBorder = isDarkHeader ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

    useEffect(() => {
        if (!resolvedTheme) return;
        const fonts = [...new Set([resolvedTheme.headingFont, resolvedTheme.bodyFont].filter(Boolean))];
        if (!fonts.length) return;
        const families = fonts
            .map((f) => `family=${f.replace(/ /g, '+')}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400`)
            .join('&');
        const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
        const existing = document.getElementById('seller-google-fonts');
        if (existing) {
            existing.href = href;
        } else {
            const link = document.createElement('link');
            link.id = 'seller-google-fonts';
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    }, [resolvedTheme?.headingFont, resolvedTheme?.bodyFont]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center px-4">
                    <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
                    <h2 className="text-xl font-bold text-text-primary mb-3">Store Not Found</h2>
                    <p className="text-text-muted mb-6">The shop you're looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        <ChevronLeft size={16} /> Back to Toroongo
                    </Link>
                </div>
            </div>
        );
    }

    const cartItemCount = getCartCount();

    const handleSendMessage = async () => {
        if (!user || user.role !== 'buyer') {
            alert('Please log in as a buyer to send messages.');
            return;
        }
        if (!messageText.trim()) return;
        setSendingMessage(true);
        try {
            await messageService.sendMessage(user.id, seller.id, messageText);
            setMessageSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessage(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const navLinks = [
        { name: t('storefront.nav.home'), href: `/${slug}`, icon: Store, end: true },
        { name: t('storefront.nav.products'), href: `/${slug}/products`, icon: Grid3X3 },
        { name: t('storefront.nav.deals'), href: `/${slug}/products?sale=true`, icon: Tag },
        { name: t('storefront.nav.reviews'), href: `/${slug}/reviews`, icon: Star },
        { name: t('storefront.nav.blog'), href: `/${slug}/blog`, icon: Newspaper },
        { name: t('storefront.nav.about'), href: `/${slug}/about`, icon: Info },
        { name: t('storefront.nav.policies'), href: `/${slug}/policies`, icon: FileText },
    ];

    const isLinkActive = (link) =>
        link.end
            ? location.pathname === link.href
            : link.href.includes('?')
                ? (location.pathname + location.search).includes(link.href)
                : location.pathname === link.href && !location.search.includes('sale=true');

    return (
        <div
            className="seller-layout min-h-screen flex flex-col animate-fade-in"
            style={{
                ...themeVars,
                backgroundColor: 'var(--seller-bg, #FFFFFF)',
            }}
        >
            {/* ══════════════════════════════════════════════════════
                 TOP HEADER
                 ══════════════════════════════════════════════════════ */}
            <header
                className={`${isSticky ? 'sticky top-0' : ''} z-40 border-b shadow-sm transition-colors`}
                style={{
                    backgroundColor: 'var(--seller-header-bg, #FFFFFF)',
                    borderColor: headerBorder,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center h-14 gap-3 ${isCenterLogo ? 'relative justify-between' : 'justify-between'}`}>

                        {/* Left: Back to Toroongo + Store logo/name */}
                        <div className={`flex items-center gap-3 min-w-0 ${isCenterLogo ? 'flex-1' : ''}`}>
                            <Link
                                to="/"
                                className={`hidden sm:flex flex-shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-70 ${hoverBg}`}
                                title={t("product.home")}
                            >
                                <img src={iconColourful} alt="Toroongo" className="w-6 h-6" />
                            </Link>
                            <div className="hidden sm:block w-px h-6 opacity-20"
                                 style={{ backgroundColor: 'var(--seller-header-text, #CBD5E1)' }} />
                            {!isCenterLogo && (
                                <Link to={`/${slug}`} className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center"
                                         style={{ backgroundColor: isDarkHeader ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }}>
                                        {seller.logo ? (
                                            <img src={seller.logo} alt={seller.store_name || seller.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Store size={14} style={{ color: iconColor }} />
                                        )}
                                    </div>
                                    <span className="text-sm font-bold truncate hidden sm:block"
                                          style={{ color: headerText }}>
                                        {seller.store_name || seller.name}
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Center logo (logoPosition = center) */}
                        {isCenterLogo && (
                            <Link to={`/${slug}`} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center"
                                     style={{ backgroundColor: isDarkHeader ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }}>
                                    {seller.logo ? (
                                        <img src={seller.logo} alt={seller.store_name || seller.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={14} style={{ color: iconColor }} />
                                    )}
                                </div>
                                <span className="text-sm font-bold hidden sm:block" style={{ color: headerText }}>
                                    {seller.store_name || seller.name}
                                </span>
                            </Link>
                        )}

                        {/* Center: Search (desktop) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search size={16}
                                       className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                       style={{ color: iconColor }} />
                                <input
                                    type="text"
                                    placeholder={t("nav.search")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all"
                                    style={{
                                        backgroundColor: isDarkHeader ? 'rgba(255,255,255,0.08)' : '#F8FAFC',
                                        borderColor: isDarkHeader ? 'rgba(255,255,255,0.18)' : '#E2E8F0',
                                        color: headerText,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {/* Search mobile */}
                            <Link
                                to="/products"
                                className={`md:hidden p-2 rounded-lg transition-colors ${hoverBg}`}
                                style={{ color: iconColor }}
                                aria-label="Search"
                            >
                                <Search size={19} />
                            </Link>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className={`hidden sm:flex relative p-2 rounded-lg transition-colors ${hoverBg}`}
                                style={{ color: iconColor }}
                                aria-label="Wishlist"
                            >
                                <Heart size={19} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none"
                                          style={{ backgroundColor: 'var(--seller-brand)' }}>
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className={`relative p-2 rounded-lg transition-colors ${hoverBg}`}
                                style={{ color: iconColor }}
                                aria-label="Cart"
                            >
                                <ShoppingCart size={19} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none"
                                          style={{ backgroundColor: 'var(--seller-brand)' }}>
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Language Switcher */}
                            <div className="flex">
                                <LanguageSwitcher />
                            </div>

                            {/* Account */}
                            <div className="relative" ref={userDropdownRef}>
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${hoverBg}`}
                                    >
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                             style={{ backgroundColor: 'var(--seller-brand)' }}>
                                            {(user?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
                                        style={{ backgroundColor: 'var(--seller-brand)' }}
                                    >
                                        <User size={15} />
                                        <span className="hidden sm:inline">{t("nav.signInUp")}</span>
                                    </Link>
                                )}

                                {/* User Dropdown — always white, neutral UI element */}
                                {userDropdownOpen && isAuthenticated && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border-soft overflow-hidden z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-border-soft">
                                            <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
                                            <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                {t("nav.dashboard")}
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="sm:hidden block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                {t("nav.wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
                                            </Link>
                                            <Link
                                                to="/account/settings"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                {t("nav.settings")}
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-border-soft">
                                            <button
                                                onClick={() => { logout(); setUserDropdownOpen(false); }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LogOut size={15} /> {t("nav.signOut")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile nav toggle */}
                            <button
                                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                className={`sm:hidden p-2 rounded-lg transition-colors ${hoverBg}`}
                                style={{ color: iconColor }}
                            >
                                {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ══════════════════════════════════════════════════════
                 STORE BANNER
                 ══════════════════════════════════════════════════════ */}
            <div className="relative h-44 sm:h-56 lg:h-64 overflow-hidden border-b"
                 style={{ borderColor: headerBorder }}>
                {seller.banner ? (
                    <img
                        src={seller.banner}
                        alt={`${seller.store_name || seller.name} banner`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0"
                         style={{ background: `linear-gradient(135deg, var(--seller-brand, #008080) 0%, var(--seller-brand-secondary, #8B5CF6) 100%)` }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-5">
                    <div className="flex items-end gap-4 justify-between w-full">
                        <div className="flex items-end gap-3 sm:gap-4">
                            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-[3px] border-white shadow-lg bg-white flex-shrink-0 flex items-center justify-center text-text-muted">
                                {seller.logo ? (
                                    <img src={seller.logo} alt={seller.store_name || seller.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Store size={32} />
                                )}
                            </div>
                            <div className="pb-0.5">
                                <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight"
                                    style={{ fontFamily: 'var(--seller-heading-font, Inter, sans-serif)' }}>
                                    {seller.store_name || seller.name}
                                </h1>
                                <div className="flex items-center gap-2.5 mt-0.5">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                        <span className="text-xs sm:text-sm text-white/90 font-medium">{seller.rating}</span>
                                    </div>
                                    <span className="text-xs text-white/50">·</span>
                                    <span className="text-xs sm:text-sm text-white/70">{sellerProducts.length} {t("storefront.stats.products")}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 backdrop-blur-sm text-slate-900 rounded-xl text-xs sm:text-sm font-semibold hover:bg-white transition-colors shadow-lg"
                        >
                            <MessageSquare size={14} className="sm:w-[15px] sm:h-[15px]" /> {t("storefront.contact")}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                 SHOP NAVIGATION (Desktop)
                 ══════════════════════════════════════════════════════ */}
            <nav
                className={`hidden sm:block border-b ${isSticky ? 'sticky top-14' : ''} z-30`}
                style={{
                    backgroundColor: 'var(--seller-header-bg, #FFFFFF)',
                    borderColor: headerBorder,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-11">
                        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                            {navLinks.map((link) => {
                                const active = isLinkActive(link);
                                return (
                                    <NavLink
                                        key={link.href}
                                        to={link.href}
                                        className={() =>
                                            `flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                                            ${active ? 'text-white' : hoverBg}`
                                        }
                                        style={() => active
                                            ? { backgroundColor: 'var(--seller-brand)' }
                                            : { color: iconColor }
                                        }
                                    >
                                        <link.icon size={14} />
                                        {link.name}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile nav drawer */}
            {mobileNavOpen && (
                <div
                    className="sm:hidden border-b px-4 py-3 space-y-1 animate-fade-in shadow-sm"
                    style={{
                        backgroundColor: 'var(--seller-header-bg, #FFFFFF)',
                        borderColor: headerBorder,
                    }}
                >
                    <Link
                        to="/"
                        className={`flex items-center gap-2.5 px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${hoverBg}`}
                        style={{ color: iconColor }}
                    >
                        <img src={iconColourful} alt="Toroongo" className="w-4 h-4 opacity-80" />
                        Toroongo.com
                    </Link>

                    <div className="pb-2 mb-2 border-b" style={{ borderColor: headerBorder }}>
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-1"
                           style={{ color: iconColor }}>
                            {t("storefront.nav.storeNav")}
                        </p>
                        {navLinks.map((link) => {
                            const active = isLinkActive(link);
                            return (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={() =>
                                        `flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                        ${active ? 'text-white' : hoverBg}`
                                    }
                                    style={() => active
                                        ? { backgroundColor: 'var(--seller-brand)' }
                                        : { color: iconColor }
                                    }
                                >
                                    <link.icon size={16} />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>

                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider mb-1"
                       style={{ color: iconColor }}>
                        {t("storefront.nav.userActions")}
                    </p>
                    <Link
                        to="/wishlist"
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${hoverBg}`}
                        style={{ color: iconColor }}
                    >
                        <Heart size={16} /> {t("nav.wishlist", "Wishlist")}
                        {wishlistCount > 0 && (
                            <span className="ml-auto text-xs font-bold text-white px-1.5 py-0.5 rounded-full"
                                  style={{ backgroundColor: 'var(--seller-brand)' }}>
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    {!isAuthenticated && (
                        <Link
                            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                            onClick={() => setMobileNavOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${hoverBg}`}
                            style={{ color: iconColor }}
                        >
                            <User size={16} /> {t("nav.signInUp")}
                        </Link>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                 CONTENT
                 ══════════════════════════════════════════════════════ */}
            <main className="flex-1">
                <Outlet context={{ seller, sellerProducts, storefrontConfig }} />
            </main>

            {/* ══════════════════════════════════════════════════════
                 STORE FOOTER
                 ══════════════════════════════════════════════════════ */}
            <footer
                className="border-t mt-12"
                style={{
                    backgroundColor: 'var(--seller-bg, #F8FAFC)',
                    borderColor: 'rgba(0,0,0,0.06)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border flex items-center justify-center"
                                 style={{
                                     borderColor: 'rgba(0,0,0,0.08)',
                                     backgroundColor: 'rgba(0,0,0,0.04)',
                                     color: 'var(--seller-text-muted, #64748B)',
                                 }}>
                                {seller.logo ? (
                                    <img src={seller.logo} alt={seller.store_name || seller.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Store size={16} />
                                )}
                            </div>
                            <span className="text-sm font-semibold"
                                  style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, Inter, sans-serif)' }}>
                                {seller.store_name || seller.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                            <NavLink to={`/${slug}/policies`} className="hover:opacity-80 transition-opacity">{t("footer.policies")}</NavLink>
                            <NavLink to={`/${slug}/about`} className="hover:opacity-80 transition-opacity">{t("footer.about")}</NavLink>
                            <button onClick={() => setShowMessageModal(true)} className="hover:opacity-80 transition-opacity">{t("footer.contact")}</button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                            {t("footer.poweredBy")}
                            <Link to="/" className="font-semibold transition-opacity hover:opacity-80"
                                  style={{ color: 'var(--seller-brand)' }}>
                                Toroongo
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ══════════════════════════════════════════════════════
                 MESSAGE SELLER MODAL
                 ══════════════════════════════════════════════════════ */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-text-primary">
                        <div className="p-5 border-b border-border-soft flex justify-between items-center bg-surface-bg">
                            <h3 className="font-bold text-text-primary">
                                {t("product.contactStore", { store: seller.store_name || seller.name })}
                            </h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-text-muted hover:text-text-primary text-xl leading-none">&times;</button>
                        </div>
                        <div className="p-5">
                            {messageSent ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h4 className="font-bold text-text-primary mb-2">{t("product.messageSent")}</h4>
                                    <p className="text-sm text-text-muted mb-6">{t("product.messageSentDesc")}</p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => navigate(`/account/messages?userId=${seller.id}`)}
                                            className="w-full py-3 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: 'var(--seller-brand)' }}
                                        >
                                            {t("messages.goToCenter")}
                                        </button>
                                        <button
                                            onClick={() => { setShowMessageModal(false); setMessageSent(false); setMessageText(''); }}
                                            className="w-full py-3 text-sm font-bold text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {t("product.stayAtShop", "Stay at Shop")}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-surface-bg rounded-xl border border-border-soft">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-border-soft flex items-center justify-center text-text-muted">
                                            {seller.logo ? (
                                                <img src={seller.logo} alt={seller.store_name || seller.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Store size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-1">{seller.store_name || seller.name}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">{t("product.contactSupport")}</p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full h-32 p-3 text-sm border border-border-soft rounded-xl focus:border-brand-primary outline-none resize-none mb-4"
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary">
                                            {t("product.cancel")}
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim() || sendingMessage}
                                            className="px-5 py-2 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 hover:opacity-90"
                                            style={{ backgroundColor: 'var(--seller-brand)' }}
                                        >
                                            {sendingMessage ? t("common.sending", "Sending...") : t("product.sendMessage")}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
