import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { navCategories } from '../../data/mockData';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const menuRef = useRef(null);

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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const cartItemCount = 3; // Mock count

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
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary tracking-tight hidden sm:block">
                            Toroongo
                        </span>
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
                            className="hidden sm:flex p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                            aria-label="Wishlist"
                        >
                            <Heart size={20} />
                        </Link>

                        {/* Account */}
                        <Link
                            to="/account"
                            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                            aria-label="Account"
                        >
                            <User size={20} />
                        </Link>

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
                        {navCategories.map((cat) => {
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
                                placeholder="Search..."
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
                        {navCategories.map((cat) => (
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
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                         hover:bg-surface-bg transition-colors"
                        >
                            <Heart size={16} /> Wishlist
                        </Link>
                        <Link
                            to="/account"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary
                         hover:bg-surface-bg transition-colors"
                        >
                            <User size={16} /> Account
                        </Link>
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
