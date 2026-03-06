import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Search, ShoppingCart, User, Menu, X, Heart, LogOut,
    Store, HelpCircle, Newspaper, Tag, Percent, Package,
    ChevronRight, LayoutDashboard, Settings, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logoColourful from '../../assets/Logo/logo_colourful.png';

// ── Main navigation links for the second bar ──────────────
const NAV_LINKS = [
    { to: '/products', label: 'Products', icon: Package },
    { to: '/shops', label: 'Shops', icon: Store },
    { to: '/products?sale=true', label: 'Deals', icon: Percent },
    { to: '/blog', label: 'Blog', icon: Newspaper },
    { to: '/sell', label: 'Sell on Toroongo', icon: ShoppingBag },
    { to: '/help', label: 'Help', icon: HelpCircle },
];

// ── Mobile drawer sections ────────────────────────────────
const MOBILE_SHOP_LINKS = [
    { to: '/products', label: 'All Products', icon: Package },
    { to: '/products?category=electronics', label: 'Electronics', icon: null },
    { to: '/products?category=fashion', label: 'Fashion', icon: null },
    { to: '/products?category=home-living', label: 'Home & Living', icon: null },
    { to: '/products?category=beauty', label: 'Beauty', icon: null },
    { to: '/products?category=sports', label: 'Sports & Outdoors', icon: null },
    { to: '/products?category=books', label: 'Books', icon: null },
    { to: '/products?sale=true', label: 'Deals & Offers', icon: Tag },
    { to: '/shops', label: 'Browse Shops', icon: Store },
];

const MOBILE_INFO_LINKS = [
    { to: '/blog', label: 'Blog', icon: Newspaper },
    { to: '/help', label: 'Help Center', icon: HelpCircle },
    { to: '/about', label: 'About Us', icon: null },
    { to: '/contact', label: 'Contact', icon: null },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
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

    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

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
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }
        if (userDropdownOpen) {
            document.addEventListener('mousedown', handleUserDropdownOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleUserDropdownOutside);
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen, userDropdownOpen]);

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
                                placeholder="Search products, sellers, categories..."
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

                        {/* Sell CTA (desktop, not logged in or buyer) */}
                        {(!isAuthenticated || user?.role === 'buyer') && (
                            <Link
                                to="/sell"
                                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                            >
                                <Store size={15} />
                                Sell
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link to="/wishlist" className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Wishlist">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <div className="relative" ref={userDropdownRef}>
                            {isAuthenticated ? (
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-bg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold text-sm">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </button>
                            ) : (
                                <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-secondary transition-colors">
                                    <User size={15} /> Sign in
                                </Link>
                            )}

                            {/* Not logged in — mobile icon fallback */}
                            {!isAuthenticated && (
                                <Link to="/login" className="sm:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Sign in">
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
                                            <LayoutDashboard size={15} className="text-text-muted" /> Dashboard
                                        </Link>
                                        <Link
                                            to="/account"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            <ShoppingBag size={15} className="text-text-muted" /> My Orders
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            <Heart size={15} className="text-text-muted" /> Wishlist
                                            {wishlistCount > 0 && <span className="ml-auto text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
                                        </Link>
                                        <Link
                                            to="/account/settings"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            <Settings size={15} className="text-text-muted" /> Settings
                                        </Link>
                                    </div>
                                    <div className="p-1.5 border-t border-border-soft">
                                        <button
                                            onClick={() => { logout(); setUserDropdownOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut size={15} /> Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors" aria-label="Shopping cart">
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

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
                        {NAV_LINKS.map((link) => {
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
                                    {link.label}
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
                                placeholder="Search products..."
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

                        {/* Shop section */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Shop</p>
                            {MOBILE_SHOP_LINKS.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                >
                                    <span className="flex items-center gap-2.5">
                                        {link.icon && <link.icon size={15} className="text-text-muted" />}
                                        {!link.icon && <span className="w-[15px]" />}
                                        {link.label}
                                    </span>
                                    <ChevronRight size={14} className="text-text-muted/40" />
                                </Link>
                            ))}
                        </div>

                        <div className="mx-3 border-t border-border-soft" />

                        {/* Quick actions */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Account</p>
                            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                <span className="flex items-center gap-2.5"><Heart size={15} className="text-text-muted" /> Wishlist</span>
                                {wishlistCount > 0 && <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full">{wishlistCount}</span>}
                            </Link>
                            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                <span className="flex items-center gap-2.5"><ShoppingCart size={15} className="text-text-muted" /> Cart</span>
                                {cartItemCount > 0 && <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full">{cartItemCount}</span>}
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                    >
                                        <LayoutDashboard size={15} className="text-text-muted" /> Dashboard
                                    </Link>
                                    <Link to="/account/settings" onClick={() => setMobileMenuOpen(false)}
                                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                        <Settings size={15} className="text-text-muted" /> Settings
                                    </Link>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors">
                                    <User size={15} className="text-text-muted" /> Sign in / Sign up
                                </Link>
                            )}
                        </div>

                        <div className="mx-3 border-t border-border-soft" />

                        {/* Info links */}
                        <div className="p-3">
                            <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">More</p>
                            {MOBILE_INFO_LINKS.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                >
                                    {link.icon ? <link.icon size={15} className="text-text-muted" /> : <span className="w-[15px]" />}
                                    {link.label}
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
                                        <LogOut size={15} /> Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* Bottom CTA */}
                    <div className="p-3 border-t border-border-soft">
                        <Link
                            to="/sell"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                        >
                            <Store size={15} /> Sell on Toroongo
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
