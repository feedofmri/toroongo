import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link, useParams, useNavigate } from 'react-router-dom';
import {
    Store, Grid3X3, Info, FileText, Star, MessageSquare, ShieldCheck,
    ShoppingCart, Heart, User, Search, LogOut, ChevronLeft, Menu, X
} from 'lucide-react';
import { sellers, products } from '../../data/mockData';
import { resolveSellerTheme } from '../../theme/sellerTheme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { messageService } from '../../services';
import iconColourful from '../../assets/Logo/icon_colourful.png';

export default function SellerLayout() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const seller = sellers.find((s) => s.slug === slug || s.id === parseInt(slug));
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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        }
        if (userDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userDropdownOpen]);

    if (!seller) {
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

    const theme = resolveSellerTheme({ brandColor: seller.brandColor });
    const sellerProducts = products.filter((p) => {
        const pId = String(p.sellerId);
        return pId === String(seller.id) || pId === `seller_${seller.id}`;
    });
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
            setTimeout(() => {
                setShowMessageModal(false);
                setMessageSent(false);
                setMessageText('');
            }, 2000);
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
        { to: `/${slug}`, label: 'Home', icon: Store, end: true },
        { to: `/${slug}/products`, label: 'Products', icon: Grid3X3 },
        { to: `/${slug}/about`, label: 'About', icon: Info },
        { to: `/${slug}/policies`, label: 'Policies', icon: FileText },
    ];

    return (
        <div className="min-h-screen flex flex-col animate-fade-in bg-white" style={theme}>
            {/* ══════════════════════════════════════════════════════
                 TOP BAR — Sign in, Cart, Wishlist, Profile
                 ══════════════════════════════════════════════════════ */}
            <header className="sticky top-0 z-40 bg-white border-b border-border-soft shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 gap-3">
                        {/* Left: Back to Toroongo + Store logo/name */}
                        <div className="flex items-center gap-3 min-w-0">
                            <Link
                                to="/"
                                className="flex-shrink-0 p-1.5 rounded-lg text-text-muted hover:text-brand-primary hover:bg-surface-bg transition-colors"
                                title="Back to Toroongo"
                            >
                                <img src={iconColourful} alt="Toroongo" className="w-6 h-6" />
                            </Link>
                            <div className="hidden sm:block w-px h-6 bg-border-soft" />
                            <Link to={`/${slug}`} className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg overflow-hidden border border-border-soft bg-white flex-shrink-0">
                                    <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-bold text-text-primary truncate hidden sm:block">{seller.name}</span>
                            </Link>
                        </div>

                        {/* Center: Search (desktop) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder={`Search ${seller.name}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-surface-bg border border-border-soft
                                               focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:bg-white outline-none transition-all
                                               placeholder:text-text-muted/60"
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {/* Search (mobile) */}
                            <Link
                                to="/products"
                                className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                                aria-label="Search"
                            >
                                <Search size={19} />
                            </Link>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="hidden sm:flex relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
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
                                className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
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

                            {/* Account / Sign in */}
                            <div className="relative" ref={userDropdownRef}>
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-bg transition-colors"
                                    >
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                             style={{ backgroundColor: 'var(--seller-brand)' }}>
                                            {(user?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
                                        style={{ backgroundColor: 'var(--seller-brand)' }}
                                    >
                                        <User size={15} />
                                        <span className="hidden sm:inline">Sign in</span>
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
                                                className="block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="sm:hidden block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                                            </Link>
                                            <Link
                                                to="/account/settings"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="block px-3 py-2 text-sm text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                            >
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-border-soft">
                                            <button
                                                onClick={() => { logout(); setUserDropdownOpen(false); }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LogOut size={15} /> Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile nav toggle */}
                            <button
                                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                                className="sm:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
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
            <div className="relative h-44 sm:h-56 lg:h-64 overflow-hidden bg-slate-900">
                <img
                    src={seller.banner}
                    alt={`${seller.name} banner`}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-5">
                    <div className="flex items-end gap-4 justify-between w-full">
                        <div className="flex items-end gap-3 sm:gap-4">
                            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-[3px] border-white shadow-lg bg-white flex-shrink-0">
                                <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="pb-0.5">
                                <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight">{seller.name}</h1>
                                <div className="flex items-center gap-2.5 mt-0.5">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                        <span className="text-xs sm:text-sm text-white/90 font-medium">{seller.rating}</span>
                                    </div>
                                    <span className="text-xs text-white/50">·</span>
                                    <span className="text-xs sm:text-sm text-white/70">{sellerProducts.length} products</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-slate-900 rounded-xl text-sm font-semibold hover:bg-white transition-colors shadow-lg"
                        >
                            <MessageSquare size={15} /> Contact
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                 SHOP NAVIGATION
                 ══════════════════════════════════════════════════════ */}
            <nav className="border-b border-border-soft bg-white sticky top-[56px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-11">
                        {/* Desktop nav links */}
                        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.end}
                                    className={({ isActive }) =>
                                        `flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                                        ${isActive
                                            ? 'text-white'
                                            : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'
                                        }`
                                    }
                                    style={({ isActive }) => isActive ? { backgroundColor: 'var(--seller-brand)' } : {}}
                                >
                                    <link.icon size={14} />
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                        {/* Contact on mobile */}
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors text-text-muted hover:text-text-primary hover:bg-surface-bg"
                        >
                            <MessageSquare size={13} /> Contact
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile nav drawer */}
            {mobileNavOpen && (
                <div className="sm:hidden border-b border-border-soft bg-white px-4 py-3 space-y-1 animate-fade-in">
                    <Link to="/wishlist" onClick={() => setMobileNavOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-lg transition-colors">
                        <Heart size={16} /> Wishlist {wishlistCount > 0 && <span className="ml-auto text-xs font-bold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--seller-brand)' }}>{wishlistCount}</span>}
                    </Link>
                    {!isAuthenticated && (
                        <Link to="/login" onClick={() => setMobileNavOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-lg transition-colors">
                            <User size={16} /> Sign in / Sign up
                        </Link>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                 CONTENT
                 ══════════════════════════════════════════════════════ */}
            <main className="flex-1">
                <Outlet context={{ seller, sellerProducts, theme }} />
            </main>

            {/* ══════════════════════════════════════════════════════
                 STORE FOOTER
                 ══════════════════════════════════════════════════════ */}
            <footer className="border-t border-border-soft bg-surface-bg mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-soft bg-white">
                                <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-semibold text-text-primary">{seller.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                            <NavLink to={`/${slug}/policies`} className="hover:text-text-primary transition-colors">Policies</NavLink>
                            <NavLink to={`/${slug}/about`} className="hover:text-text-primary transition-colors">About</NavLink>
                            <button onClick={() => setShowMessageModal(true)} className="hover:text-text-primary transition-colors">Contact</button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            Powered by
                            <Link to="/" className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors">Toroongo</Link>
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
                            <h3 className="font-bold text-text-primary">Contact {seller.name}</h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-text-muted hover:text-text-primary text-xl leading-none">&times;</button>
                        </div>
                        <div className="p-5">
                            {messageSent ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h4 className="font-bold text-text-primary mb-2">Message Sent!</h4>
                                    <p className="text-sm text-text-muted">The store will respond to you shortly via the Message Center.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-surface-bg rounded-xl border border-border-soft">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-border-soft">
                                            <img src={seller.logo} alt={seller.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-1">{seller.name}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">Contact Support</p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full h-32 p-3 text-sm border border-border-soft rounded-xl focus:border-brand-primary outline-none resize-none mb-4"
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary">Cancel</button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim() || sendingMessage}
                                            className="px-5 py-2 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 hover:opacity-90"
                                            style={{ backgroundColor: 'var(--seller-brand)' }}
                                        >
                                            {sendingMessage ? 'Sending...' : 'Send Message'}
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
