import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart, LogOut } from 'lucide-react';
import { navCategories } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logoColourful from '../../assets/Logo/logo_colourful.png';

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
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileMenuOpen(false);
            e.target.blur();
        }
    };

    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const { wishlistCount } = useWishlist();

    // For desktop user dropdown
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    // Track scroll for sticky shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        }
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        // Handle desktop user dropdown outside click
        function handleUserDropdownOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
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
        <header
            className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'
                }`}
        >
            {/* ── Top Bar ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <img src={logoColourful} alt="Toroongo" className="h-8 w-auto" />
                    </Link>

                    {/* Search Bar (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-6">
                        <div
                            className={`relative w-full transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''
                                }`}
                        >
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="Search products, sellers, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-surface-bg border
                           transition-all duration-200 outline-none
                           placeholder:text-text-muted/60
                           ${searchFocused
                                        ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white'
                                        : 'border-border-soft hover:border-gray-300'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Search toggle (mobile) */}
                        <Link
                            to="/search"
                            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </Link>

                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                            aria-label="Wishlist"
                        >
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold
                               w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none">
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
                                <Link
                                    to="/login"
                                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors block"
                                    aria-label="Account"
                                >
                                    <User size={20} />
                                </Link>
                            )}

                            {/* User Dropdown */}
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
                                            className="block px-3 py-2 text-sm text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/account/settings"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="block px-3 py-2 text-sm text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                        >
                                            Settings
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-border-soft">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setUserDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[10px] font-bold
                               w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors ml-1"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Category Bar (desktop) ──────────────────────────── */}
            <nav className="hidden lg:block border-t border-border-soft bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
                        {(navCategories || []).map((cat) => {
                            const isActive =
                                location.pathname + location.search === cat.slug;
                            return (
                                <Link
                                    key={cat.slug}
                                    to={cat.slug}
                                    className={`flex-shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive
                                            ? 'text-brand-primary bg-brand-primary/8'
                                            : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ── Mobile Overlay ──────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" />
            )}

            {/* ── Mobile Menu Drawer ──────────────────────────────── */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer header */}
                    <div className="flex items-center justify-between p-4 border-b border-border-soft">
                        <span className="font-semibold text-text-primary">Menu</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-surface-bg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search (mobile drawer) */}
                    <div className="p-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-surface-bg border border-border-soft
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Category links */}
                    <nav className="flex-1 overflow-y-auto px-3 pb-4">
                        <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Categories
                        </p>
                        {(navCategories || []).map((cat) => (
                            <Link
                                key={cat.slug}
                                to={cat.slug}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                           hover:bg-surface-bg hover:text-brand-primary transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <div className="my-4 border-t border-border-soft" />

                        <Link
                            to="/wishlist"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                         hover:bg-surface-bg transition-colors"
                        >
                            <Heart size={16} /> Wishlist
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/account'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                                 hover:bg-surface-bg transition-colors"
                                >
                                    <User size={16} /> My Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600
                                 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} /> Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                             hover:bg-surface-bg transition-colors"
                            >
                                <User size={16} /> Log In / Sign Up
                            </Link>
                        )}
                    </nav>

                    {/* Sell on Toroongo CTA */}
                    <div className="p-4 border-t border-border-soft">
                        <Link
                            to="/sell"
                            className="block w-full text-center py-2.5 bg-brand-primary text-white text-sm font-semibold
                         rounded-xl hover:bg-brand-secondary transition-colors"
                        >
                            Sell on Toroongo
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
