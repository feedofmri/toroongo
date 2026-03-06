import React, { useState, useCallback } from 'react';
import { Store, Paintbrush, Globe, Bell, Link2, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sellers } from '../../data/mockData';

// Reserved slugs that cannot be taken as shop usernames (matches static routes & system paths)
const RESERVED_SLUGS = [
    'search', 'products', 'product', 'shops', 'cart', 'checkout', 'order-confirmation', 'wishlist',
    'login', 'signup', 'forgot-password', 'account',
    'about', 'careers', 'press', 'blog',
    'help', 'shipping', 'returns', 'contact',
    'sell', 'terms', 'privacy', 'data-preferences',
    'seller', 'admin', 'api', 'app', 'www', 'shop',
    'toroongo', 'settings', 'dashboard', 'explore', 'discover',
];

/**
 * Check if a slug is available (not taken by another seller and not reserved).
 * @param {string} slug
 * @param {string} [currentSellerId] - Exclude the current seller's own slug
 * @returns {{ available: boolean, reason?: string }}
 */
function checkSlugAvailability(slug, currentSellerId) {
    if (!slug || slug.length < 3) {
        return { available: false, reason: 'Must be at least 3 characters' };
    }
    if (slug.length > 30) {
        return { available: false, reason: 'Must be 30 characters or fewer' };
    }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length > 1) {
        return { available: false, reason: 'Only lowercase letters, numbers, and hyphens. Cannot start/end with a hyphen.' };
    }
    if (/--/.test(slug)) {
        return { available: false, reason: 'Cannot contain consecutive hyphens' };
    }
    if (RESERVED_SLUGS.includes(slug)) {
        return { available: false, reason: 'This username is reserved' };
    }
    // Check against existing sellers
    const takenBy = sellers.find((s) => s.slug === slug);
    if (takenBy) {
        // Allow if it's the current seller's own slug
        const currentNumId = typeof currentSellerId === 'string' && currentSellerId.startsWith('seller_')
            ? parseInt(currentSellerId.replace('seller_', ''))
            : parseInt(currentSellerId);
        if (takenBy.id === currentNumId) {
            return { available: true, reason: 'This is your current username' };
        }
        return { available: false, reason: `Already taken by "${takenBy.name}"` };
    }
    return { available: true };
}

export default function SellerSettings() {
    const { user } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'store';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Resolve current seller slug
    const currentSellerId = user?.id || 'seller_1';
    const currentNumId = typeof currentSellerId === 'string' && currentSellerId.startsWith('seller_')
        ? parseInt(currentSellerId.replace('seller_', ''))
        : parseInt(currentSellerId);
    const currentSeller = sellers.find((s) => s.id === currentNumId);
    const currentSlug = currentSeller?.slug || 'sony-electronics';

    // Shop username state
    const [shopUsername, setShopUsername] = useState(currentSlug);
    const [slugStatus, setSlugStatus] = useState({ available: true, reason: 'This is your current username' });
    const [isChecking, setIsChecking] = useState(false);

    // Debounced slug check
    const checkSlug = useCallback((value) => {
        const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
        setShopUsername(slug);
        if (!slug) {
            setSlugStatus({ available: false, reason: 'Username cannot be empty' });
            return;
        }
        setIsChecking(true);
        // Simulate async check (would be API call in production)
        setTimeout(() => {
            const result = checkSlugAvailability(slug, currentSellerId);
            setSlugStatus(result);
            setIsChecking(false);
        }, 400);
    }, [currentSellerId]);

    const tabs = [
        { key: 'store', label: 'Store Info', icon: Store },
        { key: 'branding', label: 'Branding', icon: Paintbrush },
        { key: 'shipping', label: 'Shipping', icon: Globe },
        { key: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors`;

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Store Settings</h2>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.key ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'}`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'store' && (
                <div className="max-w-lg space-y-5">
                    {/* ── Shop Username (the star feature) ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft">
                        <div className="flex items-center gap-2 mb-4">
                            <Link2 size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">Shop Username</h3>
                        </div>
                        <p className="text-xs text-text-muted mb-4">
                            Your unique storefront URL. Customers will find your shop at{' '}
                            <span className="font-semibold text-text-primary">toroongo.com/{shopUsername || '...'}</span>
                        </p>

                        {/* Username Input */}
                        <div className="space-y-2">
                            <div className="flex items-stretch">
                                <span className="inline-flex items-center px-4 text-sm font-medium text-text-muted bg-surface-bg border border-r-0 border-border-soft rounded-l-xl whitespace-nowrap">
                                    toroongo.com/
                                </span>
                                <input
                                    type="text"
                                    value={shopUsername}
                                    onChange={(e) => checkSlug(e.target.value)}
                                    placeholder="your-shop-name"
                                    className={`flex-1 px-4 py-3 text-sm bg-white border rounded-r-xl outline-none transition-colors font-mono
                                        ${isChecking
                                            ? 'border-gray-300'
                                            : slugStatus.available
                                                ? 'border-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-100'
                                                : 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                        }`}
                                />
                            </div>

                            {/* Status indicator */}
                            <div className="flex items-center gap-1.5 h-5">
                                {isChecking ? (
                                    <>
                                        <Loader2 size={13} className="text-gray-400 animate-spin" />
                                        <span className="text-xs text-gray-400">Checking availability...</span>
                                    </>
                                ) : shopUsername ? (
                                    slugStatus.available ? (
                                        <>
                                            <CheckCircle2 size={13} className="text-green-500" />
                                            <span className="text-xs text-green-600 font-medium">{slugStatus.reason || 'Username is available!'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={13} className="text-red-500" />
                                            <span className="text-xs text-red-500 font-medium">{slugStatus.reason}</span>
                                        </>
                                    )
                                ) : null}
                            </div>

                            {/* Preview link */}
                            {shopUsername && slugStatus.available && (
                                <Link
                                    to={`/${shopUsername}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors mt-1"
                                >
                                    <ExternalLink size={11} />
                                    Preview your storefront
                                </Link>
                            )}
                        </div>

                        <button
                            disabled={!slugStatus.available || shopUsername === currentSlug}
                            className={`mt-4 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors
                                ${slugStatus.available && shopUsername !== currentSlug
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {shopUsername === currentSlug ? 'Current Username' : 'Claim Username'}
                        </button>
                    </div>

                    {/* ── Store Info ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <h3 className="text-lg font-semibold text-text-primary">Store Information</h3>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Store Name</label>
                            <input type="text" defaultValue={user?.name || 'Sony Electronics'} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
                            <textarea
                                rows={3}
                                defaultValue="Official store for premium electronics and entertainment products."
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Contact Email</label>
                            <input type="email" defaultValue={user?.email || 'support@sonyelectronics.com'} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
                            <input type="tel" defaultValue="+1 (800) 222-7669" className={inputClass} />
                        </div>
                        <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'branding' && (
                <div className="max-w-lg space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">Brand Customization</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Primary Brand Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" defaultValue="#000000" className="w-10 h-10 rounded-lg border border-border-soft cursor-pointer" />
                            <input type="text" defaultValue="#000000" className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Logo URL</label>
                        <input type="url" defaultValue="https://images.unsplash.com/..." className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Banner Image URL</label>
                        <input type="url" defaultValue="https://images.unsplash.com/..." className={inputClass} />
                    </div>
                    <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Update Branding
                    </button>
                </div>
            )}

            {activeTab === 'shipping' && (
                <div className="max-w-lg space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">Shipping Settings</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Processing Time (days)</label>
                        <input type="number" defaultValue={2} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Free Shipping Threshold ($)</label>
                        <input type="number" defaultValue={50} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Standard Shipping Rate ($)</label>
                        <input type="number" defaultValue={5.99} step="0.01" className={inputClass} />
                    </div>
                    <label className="flex items-center gap-3 p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300">
                        <input type="checkbox" defaultChecked className="accent-brand-primary w-4 h-4" />
                        <div>
                            <p className="text-sm font-medium text-text-primary">Offer express shipping</p>
                            <p className="text-xs text-text-muted">Allow customers to choose faster 2-3 day delivery</p>
                        </div>
                    </label>
                    <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Save Shipping
                    </button>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="max-w-lg space-y-4 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">Notification Preferences</h3>
                    {[
                        { label: 'New orders', desc: 'Get notified when you receive a new order' },
                        { label: 'Order updates', desc: 'Status changes and delivery confirmations' },
                        { label: 'Customer messages', desc: 'When a buyer sends you a message' },
                        { label: 'Low stock alerts', desc: 'When product stock falls below 5 units' },
                        { label: 'Payout notifications', desc: 'When payouts are processed to your bank' },
                    ].map((item, idx) => (
                        <label key={idx} className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={idx < 4} className="accent-brand-primary mt-0.5 w-4 h-4" />
                        </label>
                    ))}
                    <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Save Preferences
                    </button>
                </div>
            )}
        </div>
    );
}
