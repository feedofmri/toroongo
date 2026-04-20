import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Search, ShoppingCart, User, Menu, X, Heart, LogOut,
    Store, HelpCircle, Newspaper, Tag, Percent, Package,
    ChevronRight, LayoutDashboard, Settings, ShoppingBag,
    Bell, MessageSquare, Users, Star, MapPin, Paintbrush
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useProduct } from '../../context/ProductContext';
import NotificationDropdown from '../ui/NotificationDropdown';
import LanguageSwitcher from './LanguageSwitcher';
import logoColourful from '../../assets/Logo/logo_colourful.png';

// ── Link Definitions ─────────────────────────────────────
const BUYER_LINKS = [
    { to: '/products', label: 'nav.products', icon: Package, default: 'Products' },
    { to: '/shops', label: 'nav.stores', icon: Store, default: 'Shops' },
    { to: '/products?sale=true', label: 'nav.deals', icon: Percent, default: 'Deals' },
    { to: '/blog', label: 'nav.blog', icon: Newspaper, default: 'Blog' },
    { to: '/sell', label: 'nav.sell', icon: ShoppingBag, default: 'Sell on Toroongo' },
    { to: '/pricing', label: 'nav.pricing', icon: Tag, default: 'Pricing' },
    { to: '/help', label: 'nav.help', icon: HelpCircle, default: 'Help' },
];

const SELLER_LINKS = [
    { to: '/seller', label: 'nav.dashboard', icon: LayoutDashboard, default: 'Dashboard' },
    { to: '/seller/products', label: 'nav.myProducts', icon: Package, default: 'My Products' },
    { to: '/seller/blogs', label: 'nav.blogManager', icon: Newspaper, default: 'Blog Manager' },
    { to: '/seller/storefront-builder', label: 'nav.storefront', icon: Paintbrush, default: 'Storefront' },
    { to: '/pricing', label: 'nav.pricing', icon: Tag, default: 'Pricing' },
    { to: '/help', label: 'nav.helpCenter', icon: HelpCircle, default: 'Help Center' },
];

const ADMIN_LINKS = [
    { to: '/admin', label: 'nav.overview', icon: LayoutDashboard, default: 'Overview' },
    { to: '/admin/users', label: 'nav.users', icon: Users, default: 'Users' },
    { to: '/admin/sellers', label: 'nav.sellers', icon: Store, default: 'Sellers' },
    { to: '/admin/categories', label: 'nav.categories', icon: Tag, default: 'Categories' },
    { to: '/blog', label: 'nav.platformBlog', icon: Newspaper, default: 'Platform Blog' },
];

const GUEST_LINKS = [
    { to: '/products', label: 'nav.products', icon: Package, default: 'Products' },
    { to: '/shops', label: 'nav.stores', icon: Store, default: 'Shops' },
    { to: '/products?sale=true', label: 'nav.deals', icon: Percent, default: 'Deals' },
    { to: '/blog', label: 'nav.blog', icon: Newspaper, default: 'Blog' },
    { to: '/sell', label: 'nav.sell', icon: ShoppingBag, default: 'Sell on Toroongo' },
    { to: '/pricing', label: 'nav.pricing', icon: Tag, default: 'Pricing' },
    { to: '/help', label: 'nav.help', icon: HelpCircle, default: 'Help' },
];

// ── Mobile drawer sections ────────────────────────────────
const MOBILE_SHOP_LINKS = [
    { to: '/products', label: 'nav.products', icon: Package, default: 'All Products' },
    { to: '/products?category=electronics', label: 'nav.cat.electronics', icon: null, default: 'Electronics' },
    { to: '/products?category=fashion', label: 'nav.cat.fashion', icon: null, default: 'Fashion' },
    { to: '/products?category=home-living', label: 'nav.cat.homeLiving', icon: null, default: 'Home & Living' },
    { to: '/products?category=beauty', label: 'nav.cat.beauty', icon: null, default: 'Beauty' },
    { to: '/products?category=sports', label: 'nav.cat.sports', icon: null, default: 'Sports & Outdoors' },
    { to: '/products?category=books', label: 'nav.cat.books', icon: null, default: 'Books' },
    { to: '/products?sale=true', label: 'nav.deals', icon: Tag, default: 'Deals & Offers' },
    { to: '/shops', label: 'nav.stores', icon: Store, default: 'Browse Shops' },
];

const MOBILE_INFO_LINKS = [
    { to: '/blog', label: 'nav.blog', icon: Newspaper, default: 'Blog' },
    { to: '/help', label: 'nav.help', icon: HelpCircle, default: 'Help Center' },
    { to: '/about', label: 'nav.aboutUs', icon: null, default: 'About Us' },
    { to: '/contact', label: 'nav.contactUs', icon: null, default: 'Contact' },
];

export default function Navbar() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const menuRef = useRef(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            e.target.blur();
        }
    };

    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { unreadCount } = useNotifications();
    const { categories } = useProduct();

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);

    // Track scroll for sticky shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    const prevPathnameRef = useRef(location.pathname);
    useEffect(() => {
        if (prevPathnameRef.current !== location.pathname) {
            prevPathnameRef.current = location.pathname;
            requestAnimationFrame(() => setMobileMenuOpen(false));
        }
    }, [location.pathname]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        }
        function handleUserDropdownOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        }
        function handleNotificationClickOutside(e) {
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
                setNotificationDropdownOpen(false);
            }
        }
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }
        if (userDropdownOpen) {
            document.addEventListener('mousedown', handleUserDropdownOutside);
        }
        if (notificationDropdownOpen) {
            document.addEventListener('mousedown', handleNotificationClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleUserDropdownOutside);
            document.removeEventListener('mousedown', handleNotificationClickOutside);
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen, userDropdownOpen, notificationDropdownOpen]);

    const cartItemCount = getCartCount();

    return (
        <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>

            {/* ══════════════════════════════════════════════════════
                 TOP BAR — Logo, Search, Actions
                 ══════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <img src={logoColourful} alt="Toroongo" className="h-8 w-auto" />
                    </Link>

                    {/* Search Bar (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-6">
                        <div className={`relative w-full transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            <input
                                type="text"
                                placeholder={t('nav.search', 'Search products, sellers, categories...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-surface-bg border transition-all duration-200 outline-none placeholder:text-text-muted/60
                                    ${searchFocused
                                        ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white'
                                        : 'border-border-soft hover:border-gray-300'}`}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        {/* Search (mobile) */}
                        <Link to="/products" className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Search">
                            <Search size={20} />
                        </Link>


                        {/* Buyer Actions (desktop) */}
                        {isAuthenticated && user?.role === 'buyer' && (
                            <Link to="/account/messages" className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Messages">
                                <MessageSquare size={20} />
                            </Link>
                        )}

                        {/* Seller Actions (desktop) */}
                        {isAuthenticated && user?.role === 'seller' && (
                            <Link to="/seller/messages" className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Messages">
                                <MessageSquare size={20} />
                            </Link>
                        )}

                        {/* Notifications (Unified for all logged-in roles) */}
                        {isAuthenticated && (
                            <div className="relative hidden sm:block" ref={notificationDropdownRef}>
                                <button
                                    onClick={() => {
                                        setNotificationDropdownOpen(!notificationDropdownOpen);
                                        setUserDropdownOpen(false);
                                    }}
                                    className={`relative p-2 rounded-lg transition-colors ${notificationDropdownOpen ? 'bg-surface-bg text-brand-primary' : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'}`}
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notificationDropdownOpen && (
                                    <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
                                )}
                            </div>
                        )}

                        {/* Wishlist */}
                        {(!isAuthenticated || user?.role === 'buyer') && (
                            <Link to="/wishlist" className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Wishlist">
                                <Heart size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Language Switcher */}
                        <div className="flex">
                            <LanguageSwitcher />
                        </div>

                        {/* Cart */}
                        {(!isAuthenticated || user?.role === 'buyer') && (
                            <Link to="/cart" className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Shopping cart">
                                <ShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Account */}
                        <div className="relative" ref={userDropdownRef}>
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setUserDropdownOpen(!userDropdownOpen);
                                        setNotificationDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-bg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold text-sm">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </button>
                            ) : (
                                <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-secondary transition-colors">
                                    <User size={15} /> {t('nav.signIn', 'Sign in')}
                                </Link>
                            )}

                            {/* Not logged in — mobile icon fallback */}
                            {!isAuthenticated && (
                                <Link to="/login" className="sm:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label={t('nav.signIn', 'Sign in')}>
                                    <User size={20} />
                                </Link>
                            )}

                            {/* User Dropdown */}
                            {userDropdownOpen && isAuthenticated && (
                                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-border-soft overflow-hidden z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-border-soft bg-surface-bg/50">
                                        <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
                                        {user?.role && (
                                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-brand-primary/10 text-brand-primary">
                                                {user.role}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-1.5">
                                        <Link
                                            to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            <LayoutDashboard size={15} className="text-text-muted" /> {t('nav.dashboard')}
                                        </Link>
                                        {isAuthenticated && user?.role === 'seller' && (
                                            <>
                                                <Link
                                                    to="/seller/products"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <Package size={15} className="text-text-muted" /> {t('nav.myProducts')}
                                                </Link>
                                                <Link
                                                    to="/seller/orders"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <ShoppingBag size={15} className="text-text-muted" /> {t('nav.orders')}
                                                </Link>
                                            </>
                                        )}
                                        {isAuthenticated && user?.role === 'admin' && (
                                            <>
                                                <Link
                                                    to="/admin/users"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <Users size={15} className="text-text-muted" /> {t('nav.users')}
                                                </Link>
                                                <Link
                                                    to="/admin/sellers"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <Store size={15} className="text-text-muted" /> {t('nav.sellers')}
                                                </Link>
                                            </>
                                        )}
                                        {(!user || user?.role === 'buyer') && (
                                            <>
                                                <Link
                                                    to="/account/orders"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <ShoppingBag size={15} className="text-text-muted" /> {t('nav.myOrders', 'My Orders')}
                                                </Link>
                                                <Link
                                                    to="/account/reviews"
                                                    onClick={() => setUserDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                >
                                                    <Star size={15} className="text-text-muted" /> {t('nav.myReviews', 'My Reviews')}
                                                </Link>
                                            </>
                                        )}
                                        <Link
                                            to="/account/settings"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            <Settings size={15} className="text-text-muted" /> {t('nav.settings', 'Settings')}
                                        </Link>
                                    </div>
                                    <div className="p-1.5 border-t border-border-soft">
                                        <button
                                            onClick={() => { logout(); setUserDropdownOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut size={15} /> {t('nav.signOut', 'Sign out')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors ml-0.5"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                 NAVIGATION BAR (desktop) — Main menu links
                 ══════════════════════════════════════════════════════ */}
            <nav className="hidden lg:block border-t border-border-soft bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-0.5 h-10">
                        {(isAuthenticated ? (user?.role === 'admin' ? ADMIN_LINKS : user?.role === 'seller' ? SELLER_LINKS : BUYER_LINKS) : GUEST_LINKS).map((link) => {
                            const isActive = location.pathname === link.to || (location.pathname + location.search) === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                                        ${isActive
                                            ? 'text-brand-primary bg-brand-primary/8'
                                            : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'}`}
                                >
                                    <link.icon size={14} />
                                    {t(link.label, link.default)}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ══════════════════════════════════════════════════════
                 MOBILE OVERLAY
                 ══════════════════════════════════════════════════════ */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" />
            )}

            {/* ══════════════════════════════════════════════════════
                 MOBILE MENU DRAWER
                 ══════════════════════════════════════════════════════ */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden
                    ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer header */}
                    <div className="flex items-center justify-between p-4 border-b border-border-soft">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                            <img src={logoColourful} alt="Toroongo" className="h-6 w-auto" />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-bg transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b border-border-soft">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder={t('nav.searchPlaceholderMobile', 'Search products...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-surface-bg border border-border-soft focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <nav className="flex-1 overflow-y-auto">
                        {/* User section (when authenticated) */}
                        {isAuthenticated && (
                            <div className="p-3 border-b border-border-soft">
                                <div className="flex items-center gap-3 p-2">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
                                        <p className="text-[11px] text-text-muted truncate">{user?.email || ''}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Role-based main links (Mobile) */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{t('nav.menuHeader', 'Menu')}</p>
                            {(isAuthenticated ? (user?.role === 'admin' ? ADMIN_LINKS : user?.role === 'seller' ? SELLER_LINKS : BUYER_LINKS) : GUEST_LINKS).map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <link.icon size={15} className="text-text-muted" />
                                        {t(link.label, link.default)}
                                    </span>
                                    <ChevronRight size={14} className="text-text-muted/40" />
                                </Link>
                            ))}
                        </div>

                        <div className="mx-3 border-t border-border-soft" />

                        {/* Shop / Categories section */}
                        <div className="p-3">
                            <div className="flex items-center justify-between px-2 mb-1.5">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('nav.shopHeader', 'Shop')}</p>
                                <button
                                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                                    className="text-[10px] font-bold text-brand-primary hover:underline"
                                >
                                    {mobileCategoriesOpen ? t('common.showLess', 'Show Less') : t('common.viewAll', 'View All')}
                                </button>
                            </div>

                            {/* Essential Shop Links */}
                            <Link to="/products" onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                <span className="flex items-center gap-2.5"><Package size={15} className="text-text-muted" /> {t('nav.products', 'All Products')}</span>
                                <ChevronRight size={14} className="text-text-muted/40" />
                            </Link>

                            {/* Categories Dropdown */}
                            <div className="mt-1">
                                <button
                                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg transition-colors"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Tag size={15} className="text-text-muted" />
                                        {t('nav.categories', 'Categories')}
                                    </span>
                                    <ChevronRight size={14} className={`text-text-muted/40 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-90' : ''}`} />
                                </button>

                                {mobileCategoriesOpen && (
                                    <div className="ml-4 pl-4 border-l border-border-soft mt-1 flex flex-col gap-1 overflow-hidden animate-slide-down">
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <Link
                                                    key={cat.id || cat.slug}
                                                    to={`/products?category=${cat.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-colors"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))
                                        ) : (
                                            MOBILE_SHOP_LINKS.filter(l => l.to.includes('category=')).map((link) => (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-colors"
                                                >
                                                    {t(link.label, link.default)}
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <Link to="/products?sale=true" onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                <span className="flex items-center gap-2.5"><Percent size={15} className="text-text-muted" /> {t('nav.deals', 'Deals')}</span>
                                <ChevronRight size={14} className="text-text-muted/40" />
                            </Link>
                        </div>

                        <div className="mx-3 border-t border-border-soft" />

                        {/* Quick actions */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{t('nav.accountHeader', 'Account')}</p>
                            {(!isAuthenticated || user?.role === 'buyer') && (
                                <>
                                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                        <span className="flex items-center gap-2.5"><ShoppingCart size={15} className="text-text-muted" /> {t('nav.cart', 'Cart')}</span>
                                        {cartItemCount > 0 && <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full">{cartItemCount}</span>}
                                    </Link>
                                </>
                            )}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                    >
                                        <LayoutDashboard size={15} className="text-text-muted" /> {t('nav.dashboard')}
                                    </Link>

                                    {/* Additional for buyer/seller/admin */}
                                    {(!user || user?.role === 'buyer') && (
                                        <>
                                            <Link to="/account/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <ShoppingBag size={15} className="text-text-muted" /> {t('nav.myOrders', 'My Orders')}
                                            </Link>
                                            <Link to="/account/reviews" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <Star size={15} className="text-text-muted" /> {t('nav.myReviews', 'My Reviews')}
                                            </Link>
                                        </>
                                    )}

                                    {user?.role === 'seller' && (
                                        <>
                                            <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <Package size={15} className="text-text-muted" /> {t('nav.myProducts')}
                                            </Link>
                                            <Link to="/seller/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <ShoppingBag size={15} className="text-text-muted" /> {t('nav.orders')}
                                            </Link>
                                        </>
                                    )}

                                    {user?.role === 'admin' && (
                                        <>
                                            <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <Users size={15} className="text-text-muted" /> {t('nav.users')}
                                            </Link>
                                            <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                                <Store size={15} className="text-text-muted" /> {t('nav.sellers')}
                                            </Link>
                                        </>
                                    )}

                                    <Link to="/account/settings" onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                        <Settings size={15} className="text-text-muted" /> {t('nav.settings', 'Settings')}
                                    </Link>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                    <User size={15} className="text-text-muted" /> {t('nav.signInUp', 'Sign in / Sign up')}
                                </Link>
                            )}
                        </div>

                        <div className="mx-3 border-t border-border-soft" />

                        {/* Info links */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">{t('nav.moreHeader', 'More')}</p>
                            {MOBILE_INFO_LINKS.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                >
                                    {link.icon ? <link.icon size={15} className="text-text-muted" /> : <span className="w-[15px]" />}
                                    {t(link.label, link.default)}
                                </Link>
                            ))}
                        </div>

                        {/* Sign out */}
                        {isAuthenticated && (
                            <>
                                <div className="mx-3 border-t border-border-soft" />
                                <div className="p-3">
                                    <button
                                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={15} /> {t('nav.signOut', 'Sign out')}
                                    </button>
                                </div>
                            </>
                        )}
                    </nav>

                </div>
            </div>
        </header>
    );
}
