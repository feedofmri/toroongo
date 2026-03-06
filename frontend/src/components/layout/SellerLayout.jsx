import React, { useState } from 'react';
import { Outlet, NavLink, Link, useParams } from 'react-router-dom';
import { Store, Grid3X3, Info, FileText, Star, MessageSquare, ShieldCheck } from 'lucide-react';
import { sellers, products } from '../../data/mockData';
import { resolveSellerTheme } from '../../theme/sellerTheme';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services';

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
    const { user } = useAuth();

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

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
                    <div className="flex items-end gap-4 justify-between w-full">
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
                        <div className="pb-1">
                            <button
                                onClick={() => setShowMessageModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors shadow-lg"
                            >
                                <MessageSquare size={16} /> Contact Store
                            </button>
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

            {/* Message Seller Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-text-primary">
                        <div className="p-5 border-b border-border-soft flex justify-between items-center bg-surface-bg">
                            <h3 className="font-bold text-text-primary">Contact {seller.name}</h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-text-muted hover:text-text-primary text-xl">&times;</button>
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
                                        <div className="w-10 h-10 rounded-md overflow-hidden bg-white">
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
                                            className="px-5 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
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
