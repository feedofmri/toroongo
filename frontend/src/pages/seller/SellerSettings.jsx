import React, { useState, useCallback, useEffect } from 'react';
import { Store, Paintbrush, Globe, Bell, Link2, CheckCircle2, XCircle, Loader2, ExternalLink, BookOpen, FileText, Info, Lock, Code, Sparkles, Eye, Banknote } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { userService } from '../../services';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

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
 * @param {Array} sellersList - Array of all current sellers
 * @returns {{ available: boolean, reason?: string }}
 */
function checkSlugAvailability(slug, currentSellerId, sellersList) {
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
    const takenBy = sellersList.find((s) => s.slug === slug);
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
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const { canAccess, currentPlan } = useSubscription();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'store';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Resolve current seller slug
    const currentSellerId = user?.id;
    const currentSlug = user?.slug || '';

    // Shop username state
    const [shopUsername, setShopUsername] = useState(currentSlug);
    const [slugStatus, setSlugStatus] = useState({ available: true, reason: 'This is your current username' });
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [allSellers, setAllSellers] = useState([]);

    useEffect(() => {
        userService.getAllSellers().then(setAllSellers).catch(console.error);
    }, []);

    // Tab states
    const [storeInfo, setStoreInfo] = useState({
        store_name: user?.store_name || user?.name || '',
        description: user?.description || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
    });
    const [saveStoreInfoLoading, setSaveStoreInfoLoading] = useState(false);

    const [branding, setBranding] = useState({
        brand_color: user?.brand_color || '#000000',
        logo: user?.logo || '',
        banner: user?.banner || '',
    });
    const [saveBrandingLoading, setSaveBrandingLoading] = useState(false);

    const [shipping, setShipping] = useState({
        processing_time: user?.seller_settings?.processing_time || 2,
        free_shipping_threshold: user?.seller_settings?.free_shipping_threshold || 50,
        standard_shipping_rate: user?.seller_settings?.standard_shipping_rate || 5.99,
        offer_express_shipping: user?.seller_settings?.offer_express_shipping !== undefined ? user?.seller_settings?.offer_express_shipping : true,
    });
    const [saveShippingLoading, setSaveShippingLoading] = useState(false);

    const [notifications, setNotifications] = useState({
        new_orders: user?.seller_settings?.notifications?.new_orders !== undefined ? user?.seller_settings?.notifications?.new_orders : true,
        order_updates: user?.seller_settings?.notifications?.order_updates !== undefined ? user?.seller_settings?.notifications?.order_updates : true,
        customer_messages: user?.seller_settings?.notifications?.customer_messages !== undefined ? user?.seller_settings?.notifications?.customer_messages : true,
        low_stock_alerts: user?.seller_settings?.notifications?.low_stock_alerts !== undefined ? user?.seller_settings?.notifications?.low_stock_alerts : true,
        payout_notifications: user?.seller_settings?.notifications?.payout_notifications !== undefined ? user?.seller_settings?.notifications?.payout_notifications : false,
    });
    const [saveNotificationsLoading, setSaveNotificationsLoading] = useState(false);
    
    const [storeContent, setStoreContent] = useState({
        about_content: user?.seller_settings?.about_content || '',
        policies: {
            shipping: user?.seller_settings?.policies?.shipping || '',
            returns: user?.seller_settings?.policies?.returns || '',
            warranty: user?.seller_settings?.policies?.warranty || '',
            faq: user?.seller_settings?.policies?.faq || '',
        },
        benefits: user?.seller_settings?.benefits || [
            { title: 'Quality Guaranteed', desc: 'Every product undergoes rigorous quality checks before reaching you.' },
            { title: 'Fast & Reliable Shipping', desc: 'We partner with trusted carriers to get your order to you quickly.' },
            { title: 'Exceptional Support', desc: 'Our dedicated team is always ready to help with any questions or concerns.' },
            { title: 'Easy Returns', desc: 'Not satisfied? Return any product within 30 days for a full refund.' },
        ]
    });
    const [saveContentLoading, setSaveContentLoading] = useState(false);

    const handleSaveStoreInfo = async () => {
        setSaveStoreInfoLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, storeInfo);
            updateUser(updatedUser);
        } catch (e) {
            console.error('Failed to save store info', e);
        } finally {
            setSaveStoreInfoLoading(false);
        }
    };

    const handleSaveBranding = async () => {
        setSaveBrandingLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, branding);
            updateUser(updatedUser);
        } catch (e) {
            console.error('Failed to save branding', e);
        } finally {
            setSaveBrandingLoading(false);
        }
    };

    const handleSaveSettings = async (settingsType, data, setLoader) => {
        setLoader(true);
        try {
            const currentSettings = user?.seller_settings || {};
            const newSettings = settingsType === 'notifications' 
                ? { ...currentSettings, notifications: data }
                : { ...currentSettings, ...data };
            
            const updatedUser = await userService.updateProfile(user.id, { seller_settings: newSettings });
            updateUser(updatedUser);
        } catch (e) {
            console.error(`Failed to save ${settingsType}`, e);
        } finally {
            setLoader(false);
        }
    };

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
            const result = checkSlugAvailability(slug, currentSellerId, allSellers);
            setSlugStatus(result);
            setIsChecking(false);
        }, 400);
    }, [currentSellerId, allSellers]);

    const handleClaimUsername = async () => {
        if (!slugStatus.available || shopUsername === currentSlug) return;
        setIsSaving(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, { slug: shopUsername });
            updateUser(updatedUser);
            setSlugStatus({ available: true, reason: 'This is your current username' });
        } catch (error) {
            console.error('Failed to update username:', error);
            setSlugStatus({ available: false, reason: error.response?.data?.message || 'Failed to update username.' });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { key: 'store', label: t('sellerSettings.tabs.store'), icon: Store },
        { key: 'branding', label: t('sellerSettings.tabs.branding'), icon: Paintbrush },
        { key: 'content', label: 'Store Content', icon: BookOpen },
        { key: 'whitelabel', label: 'White-Label', icon: Eye, locked: !canAccess('whitelabel') },
        { key: 'currency', label: 'Multi-Currency', icon: Banknote, locked: !canAccess('currency') },
        { key: 'customcode', label: 'Custom Code', icon: Code, locked: !canAccess('css') },
        { key: 'shipping', label: t('sellerSettings.tabs.shipping'), icon: Globe },
        { key: 'notifications', label: t('sellerSettings.tabs.notifications'), icon: Bell },
    ];

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors`;

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('sellerSettings.title')}</h2>

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
                        {tab.locked && <Lock size={11} className="text-text-muted/50" />}
                    </button>
                ))}
            </div>

            {activeTab === 'store' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    {/* ── Shop Username (the star feature) ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft">
                        <div className="flex items-center gap-2 mb-4">
                            <Link2 size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.username.title')}</h3>
                        </div>
                        <p className="text-xs text-text-muted mb-4">
                            {t('sellerSettings.username.desc')}{' '}
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
                            onClick={handleClaimUsername}
                            disabled={!slugStatus.available || shopUsername === currentSlug || isSaving}
                            className={`mt-4 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors
                                ${slugStatus.available && shopUsername !== currentSlug && !isSaving
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                            {isSaving ? 'Claiming...' : shopUsername === currentSlug ? t('sellerSettings.username.currentBtn') : t('sellerSettings.username.claim')}
                        </button>
                    </div>

                    {/* ── Store Info ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.storeInfo.title')}</h3>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.name')}</label>
                            <input type="text" value={storeInfo.store_name} onChange={(e) => setStoreInfo({...storeInfo, store_name: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.description')}</label>
                            <textarea
                                rows={3}
                                value={storeInfo.description}
                                onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.email')}</label>
                            <input type="email" value={storeInfo.email} onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.phone')}</label>
                            <input type="tel" value={storeInfo.phone} onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Location</label>
                            <input type="text" value={storeInfo.location} onChange={(e) => setStoreInfo({...storeInfo, location: e.target.value})} className={inputClass} placeholder="e.g. United States, New York" />
                        </div>
                        <button onClick={handleSaveStoreInfo} disabled={saveStoreInfoLoading} className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {saveStoreInfoLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                            {t('sellerSettings.storeInfo.save')}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'branding' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.branding.title')}</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Primary Brand Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className="w-10 h-10 rounded-lg border border-border-soft cursor-pointer" />
                            <input type="text" value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Logo URL</label>
                        <input type="url" value={branding.logo} onChange={(e) => setBranding({...branding, logo: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Banner Image URL</label>
                        <input type="url" value={branding.banner} onChange={(e) => setBranding({...branding, banner: e.target.value})} className={inputClass} />
                    </div>
                    <button onClick={handleSaveBranding} disabled={saveBrandingLoading} className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {saveBrandingLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {t('sellerSettings.branding.save')}
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'shipping' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.shipping.title')}</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Processing Time (days)</label>
                        <input type="number" value={shipping.processing_time} onChange={(e) => setShipping({...shipping, processing_time: parseInt(e.target.value) || 0})} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Free Shipping Threshold ($)</label>
                        <input type="number" value={shipping.free_shipping_threshold} onChange={(e) => setShipping({...shipping, free_shipping_threshold: parseFloat(e.target.value) || 0})} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Standard Shipping Rate ($)</label>
                        <input type="number" value={shipping.standard_shipping_rate} onChange={(e) => setShipping({...shipping, standard_shipping_rate: parseFloat(e.target.value) || 0})} step="0.01" className={inputClass} />
                    </div>
                    <label className="flex items-center gap-3 p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300">
                        <input type="checkbox" checked={shipping.offer_express_shipping} onChange={(e) => setShipping({...shipping, offer_express_shipping: e.target.checked})} className="accent-brand-primary w-4 h-4" />
                        <div>
                            <p className="text-sm font-medium text-text-primary">Offer express shipping</p>
                            <p className="text-xs text-text-muted">Allow customers to choose faster 2-3 day delivery</p>
                        </div>
                    </label>
                    <button onClick={() => handleSaveSettings('shipping', shipping, setSaveShippingLoading)} disabled={saveShippingLoading} className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {saveShippingLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {t('sellerSettings.shipping.save')}
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.notifications.title')}</h3>
                    {[
                        { key: 'new_orders', label: 'New orders', desc: 'Get notified when you receive a new order' },
                        { key: 'order_updates', label: 'Order updates', desc: 'Status changes and delivery confirmations' },
                        { key: 'customer_messages', label: 'Customer messages', desc: 'When a buyer sends you a message' },
                        { key: 'low_stock_alerts', label: 'Low stock alerts', desc: 'When product stock falls below 5 units' },
                        { key: 'payout_notifications', label: 'Payout notifications', desc: 'When payouts are processed to your bank' },
                    ].map((item) => (
                        <label key={item.key} className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <input type="checkbox" checked={notifications[item.key]} onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})} className="accent-brand-primary mt-0.5 w-4 h-4" />
                        </label>
                    ))}
                    <button onClick={() => handleSaveSettings('notifications', notifications, setSaveNotificationsLoading)} disabled={saveNotificationsLoading} className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {saveNotificationsLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {t('sellerSettings.notifications.save')}
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-6">
                    {/* About Store */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Info size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">About Your Store</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            Tell your story. This will be displayed on the "About" tab of your storefront.
                        </p>
                        <div>
                            <textarea
                                rows={8}
                                value={storeContent.about_content}
                                onChange={(e) => setStoreContent({...storeContent, about_content: e.target.value})}
                                className={`${inputClass} resize-none`}
                                placeholder="Describe your store, your team, and your mission..."
                            />
                        </div>
                    </div>

                    {/* Why Shop With Us (Benefits) */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">Why Shop With Us</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            Highlight what makes your store unique. These appear on your "About" page.
                        </p>
                        
                        <div className="space-y-4">
                            {storeContent.benefits.map((benefit, index) => (
                                <div key={index} className="p-4 border border-border-soft rounded-xl space-y-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Benefit #{index + 1}</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={benefit.title}
                                        onChange={(e) => {
                                            const newBenefits = [...storeContent.benefits];
                                            newBenefits[index].title = e.target.value;
                                            setStoreContent({...storeContent, benefits: newBenefits});
                                        }}
                                        className={inputClass}
                                        placeholder="Benefit Title"
                                    />
                                    <textarea
                                        rows={2}
                                        value={benefit.desc}
                                        onChange={(e) => {
                                            const newBenefits = [...storeContent.benefits];
                                            newBenefits[index].desc = e.target.value;
                                            setStoreContent({...storeContent, benefits: newBenefits});
                                        }}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Description..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>

                    <div className="space-y-6">
                    {/* Store Policies */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">Store Policies</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            Custom policies for your customers. Defaults will be shown if left blank.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">Shipping Policy</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.shipping}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, shipping: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Order processing times, shipping methods, areas covered..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">Return & Refund Policy</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.returns}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, returns: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Return windows, refund conditions, who pays for shipping..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">Warranty Information</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.warranty}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, warranty: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Product guarantee periods, coverage details..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">Frequently Asked Questions (FAQ)</label>
                                <textarea
                                    rows={4}
                                    value={storeContent.policies.faq}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, faq: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Common questions and answers for your buyers..."
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleSaveSettings('content', storeContent, setSaveContentLoading)} 
                        disabled={saveContentLoading} 
                        className="px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saveContentLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        Save Store Content
                    </button>
                    </div>
                </div>
            )}
            {activeTab === 'whitelabel' && (
                !canAccess('whitelabel') ? (
                    <div className="py-8">
                        <UpgradePrompt
                            currentPlan={currentPlan}
                            feature="White-Labeling"
                            requiredPlan="business"
                            message="Remove all Toroongo branding from your storefront. Your customers will see only your brand — no 'Powered by Toroongo' footer."
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Eye size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">White-Label Settings</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                Control the Toroongo branding on your storefront. Your Business plan includes full white-labeling.
                            </p>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Remove "Powered by Toroongo" footer</p>
                                    <p className="text-xs text-text-muted mt-0.5">Your storefront will show no Toroongo branding to customers</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Hide Toroongo from email templates</p>
                                    <p className="text-xs text-text-muted mt-0.5">Order confirmations and notifications will use your brand only</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Custom favicon</p>
                                    <p className="text-xs text-text-muted mt-0.5">Use your own favicon instead of the Toroongo icon</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <div className="pt-2">
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-800">White-Label Active</p>
                                        <p className="text-xs text-green-600 mt-0.5">All Toroongo branding has been removed from your storefront.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                Save White-Label Settings
                            </button>
                        </div>
                    </div>
                )
            )}

            {activeTab === 'customcode' && (
                !canAccess('css') ? (
                    <div className="py-8">
                        <UpgradePrompt
                            currentPlan={currentPlan}
                            feature="Custom CSS/HTML Access"
                            requiredPlan="enterprise"
                            message="Inject custom CSS and HTML into your storefront for bespoke design. Create a truly unique shopping experience."
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Code size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">Custom CSS</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                Add custom CSS to override storefront styles. Changes apply to your public storefront only.
                            </p>
                            <textarea
                                rows={12}
                                className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
                                placeholder={`/* Your custom storefront CSS */\n\n.store-header {\n    background: linear-gradient(135deg, #667eea, #764ba2);\n}\n\n.product-card {\n    border-radius: 16px;\n    box-shadow: 0 4px 20px rgba(0,0,0,0.08);\n}`}
                                defaultValue=""
                            />
                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                Save Custom CSS
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Code size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">Custom HTML (Head Injection)</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                Inject custom HTML into the &lt;head&gt; of your storefront. Useful for analytics scripts, meta tags, or third-party integrations.
                            </p>
                            <textarea
                                rows={8}
                                className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
                                placeholder={`<!-- Custom head HTML -->\n<meta name="google-site-verification" content="..." />\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>`}
                                defaultValue=""
                            />
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    <strong>Caution:</strong> Injecting invalid HTML or scripts may break your storefront. Test changes carefully.
                                </p>
                            </div>
                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                Save Custom HTML
                            </button>
                        </div>
                    </div>
                )
            )}
            {activeTab === 'currency' && (
                !canAccess('currency') ? (
                    <div className="py-8">
                        <UpgradePrompt
                            currentPlan={currentPlan}
                            feature="Multi-Currency Support"
                            requiredPlan="business"
                            message="Automatically convert prices based on your visitor's location. Show prices in BDT, USD, MYR, AED, INR, and more."
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Banknote size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">Multi-Currency Settings</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                Enable currencies for your store. Prices auto-convert based on the visitor's IP address.
                            </p>

                            <label className="flex items-start justify-between p-4 border border-brand-primary/20 bg-brand-primary/[0.03] rounded-xl cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Auto-detect currency by IP</p>
                                    <p className="text-xs text-text-muted mt-0.5">Automatically show prices in the visitor's local currency</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Enabled Currencies</p>
                                <div className="space-y-2">
                                    {[
                                        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', enabled: true },
                                        { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', enabled: true },
                                        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', enabled: true },
                                        { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', enabled: true },
                                        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', enabled: false },
                                        { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵', enabled: false },
                                        { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', enabled: false },
                                        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', enabled: false },
                                        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', enabled: false },
                                    ].map(curr => (
                                        <label key={curr.code} className="flex items-center justify-between p-3 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{curr.flag}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{curr.code} — {curr.name}</p>
                                                    <p className="text-xs text-text-muted">{curr.symbol}</p>
                                                </div>
                                            </div>
                                            <input type="checkbox" defaultChecked={curr.enabled} className="accent-brand-primary w-4 h-4" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                Save Currency Settings
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
