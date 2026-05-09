import React, { useState, useCallback, useEffect } from 'react';
import { Store, Paintbrush, Globe, Bell, Link2, CheckCircle2, XCircle, Loader2, ExternalLink, BookOpen, FileText, Info, Lock, Code, Sparkles, Eye, Banknote, MapPin, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { userService } from '../../services';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';
import CountrySelector from '../../components/ui/CountrySelector';
import MediaUploader from '../../components/ui/MediaUploader';
import { setBuyerCurrencyCode } from '../../utils/currency';
import { RESERVED_SLUGS, PLATFORM_CONFIG } from '../../config/constants';

// RESERVED_SLUGS moved to constants.js

/**
 * Check if a slug is available (not taken by another seller and not reserved).
 * @param {string} slug
 * @param {string} [currentSellerId] - Exclude the current seller's own slug
 * @param {Array} sellersList - Array of all current sellers
 * @returns {{ available: boolean, reason?: string }}
 */
function checkSlugAvailability(slug, currentSellerId, sellersList) {
    if (!slug || slug.length < 3) {
        return { available: false, reason: t('sellerSettings.slug.errorMin', 'Must be at least 3 characters') };
    }
    if (slug.length > 30) {
        return { available: false, reason: t('sellerSettings.slug.errorMax', 'Must be 30 characters or fewer') };
    }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length > 1) {
        return { available: false, reason: t('sellerSettings.slug.errorChars', 'Only lowercase letters, numbers, and hyphens. Cannot start/end with a hyphen.') };
    }
    if (/--/.test(slug)) {
        return { available: false, reason: t('sellerSettings.slug.errorHyphens', 'Cannot contain consecutive hyphens') };
    }
    if (RESERVED_SLUGS.includes(slug)) {
        return { available: false, reason: t('sellerSettings.slug.errorReserved', 'This username is reserved') };
    }
    // Check against existing sellers
    const takenBy = sellersList.find((s) => s.slug === slug);
    if (takenBy) {
        // Allow if it's the current seller's own slug
        const currentNumId = typeof currentSellerId === 'string' && currentSellerId.startsWith('seller_')
            ? parseInt(currentSellerId.replace('seller_', ''))
            : parseInt(currentSellerId);
        if (takenBy.id === currentNumId) {
            return { available: true, reason: t('sellerSettings.slug.current', 'This is your current username') };
        }
        return { available: false, reason: t('sellerSettings.slug.takenBy', 'Already taken by "{{name}}"', { name: takenBy.name }) };
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
    const [slugStatus, setSlugStatus] = useState({ available: true, reason: t('sellerSettings.slug.current', 'This is your current username') });
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
        benefits: user?.seller_settings?.benefits || []
    });
    const [saveContentLoading, setSaveContentLoading] = useState(false);
    const [countryData, setCountryData] = useState({
        country: user?.country || '',
        currency_code: user?.currency_code || 'USD',
        country_custom_name: user?.country_custom_name || '',
    });
    const [saveCountryLoading, setSaveCountryLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', password: '', confirmPassword: '' });
    const [securityError, setSecurityError] = useState('');
    const { changePassword } = useAuth();

    // Dirty state checks
    const isStoreInfoDirty = React.useMemo(() => {
        return storeInfo.store_name !== (user?.store_name || user?.name || '') ||
               storeInfo.description !== (user?.description || '') ||
               storeInfo.email !== (user?.email || '') ||
               storeInfo.phone !== (user?.phone || '') ||
               storeInfo.location !== (user?.location || '');
    }, [storeInfo, user]);

    const isBrandingDirty = React.useMemo(() => {
        return branding.brand_color !== (user?.brand_color || '#000000') ||
               branding.logo !== (user?.logo || '') ||
               branding.banner !== (user?.banner || '');
    }, [branding, user]);

    const isCountryDirty = React.useMemo(() => {
        return countryData.country !== (user?.country || '') ||
               countryData.currency_code !== (user?.currency_code || 'USD') ||
               countryData.country_custom_name !== (user?.country_custom_name || '');
    }, [countryData, user]);

    const isShippingDirty = React.useMemo(() => {
        const s = user?.seller_settings || {};
        return shipping.processing_time !== (s.processing_time || 2) ||
               shipping.free_shipping_threshold !== (s.free_shipping_threshold || 50) ||
               shipping.standard_shipping_rate !== (s.standard_shipping_rate || 5.99) ||
               shipping.offer_express_shipping !== (s.offer_express_shipping !== undefined ? s.offer_express_shipping : true);
    }, [shipping, user]);

    const isNotificationsDirty = React.useMemo(() => {
        const n = user?.seller_settings?.notifications || {};
        return notifications.new_orders !== (n.new_orders !== undefined ? n.new_orders : true) ||
               notifications.order_updates !== (n.order_updates !== undefined ? n.order_updates : true) ||
               notifications.customer_messages !== (n.customer_messages !== undefined ? n.customer_messages : true) ||
               notifications.low_stock_alerts !== (n.low_stock_alerts !== undefined ? n.low_stock_alerts : true) ||
               notifications.payout_notifications !== (n.payout_notifications !== undefined ? n.payout_notifications : false);
    }, [notifications, user]);

    const isContentDirty = React.useMemo(() => {
        const c = user?.seller_settings || {};
        const p = c.policies || {};
        const b = c.benefits || [];
        return storeContent.about_content !== (c.about_content || '') ||
               storeContent.policies.shipping !== (p.shipping || '') ||
               storeContent.policies.returns !== (p.returns || '') ||
               storeContent.policies.warranty !== (p.warranty || '') ||
               storeContent.policies.faq !== (p.faq || '') ||
               JSON.stringify(storeContent.benefits) !== JSON.stringify(b);
    }, [storeContent, user]);

    const isUsernameDirty = shopUsername !== currentSlug;


    const handleSaveStoreInfo = async () => {
        setSaveStoreInfoLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, storeInfo);
            updateUser(updatedUser);
        } catch (e) {
            console.error('Failed to save store info', e);
        } finally {
            setSaveStoreInfoLoading(false);
            setSaveSuccess('store');
            setTimeout(() => setSaveSuccess(null), 3000);
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
            setSaveSuccess('branding');
            setTimeout(() => setSaveSuccess(null), 3000);
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
            setSaveSuccess(settingsType);
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    // Debounced slug check
    const checkSlug = useCallback(async (value) => {
        const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
        setShopUsername(slug);
        
        if (!slug) {
            setSlugStatus({ available: false, reason: t('sellerSettings.slug.errorEmpty', 'Username cannot be empty') });
            return;
        }

        // Basic client side validation before API call
        const localCheck = checkSlugAvailability(slug, currentSellerId, allSellers);
        if (!localCheck.available) {
            setSlugStatus(localCheck);
            return;
        }

        setIsChecking(true);
        try {
            const result = await userService.checkSlug(slug, currentSellerId);
            setSlugStatus({ 
                available: result.available, 
                reason: result.available ? (slug === currentSlug ? t('sellerSettings.slug.current', 'This is your current username') : t('sellerSettings.username.available', 'Username is available!')) : t('sellerSettings.slug.taken', 'Already taken') 
            });
        } catch (error) {
            console.error('Slug check failed:', error);
        } finally {
            setIsChecking(false);
        }
    }, [currentSellerId, allSellers, currentSlug]);

    const handleClaimUsername = async () => {
        if (!slugStatus.available || shopUsername === currentSlug) return;
        setIsSaving(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, { slug: shopUsername });
            updateUser(updatedUser);
            setSlugStatus({ available: true, reason: t('sellerSettings.slug.current', 'This is your current username') });
        } catch (error) {
            console.error('Failed to update username:', error);
            setSlugStatus({ available: false, reason: error.response?.data?.message || t('sellerSettings.username.updateError', 'Failed to update username.') });
        } finally {
            setIsSaving(false);
            setSaveSuccess('username');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const handleSaveCountry = async () => {
        setSaveCountryLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, {
                country: countryData.country || null,
                currency_code: countryData.currency_code || 'USD',
                country_custom_name: countryData.country_custom_name || null,
            });
            updateUser(updatedUser);
            setBuyerCurrencyCode(countryData.currency_code || 'USD', true);
        } catch (e) {
            console.error('Failed to save country', e);
        } finally {
            setSaveCountryLoading(false);
            setSaveSuccess('country_currency');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const tabs = [
        { key: 'store', label: t('sellerSettings.tabs.store', 'Store'), icon: Store },
        { key: 'branding', label: t('sellerSettings.tabs.branding', 'Branding'), icon: Paintbrush },
        { key: 'country_currency', label: t('sellerSettings.tabs.country_currency', 'Country & Currency'), icon: MapPin },
        { key: 'content', label: t('sellerSettings.tabs.content', 'Store Content'), icon: BookOpen },
        { key: 'whitelabel', label: t('sellerSettings.tabs.whitelabel', 'White-Label'), icon: Eye, locked: !canAccess('whitelabel') },
        { key: 'currency', label: t('sellerSettings.tabs.currency', 'Multi-Currency'), icon: Banknote, locked: !canAccess('currency') },
        { key: 'customcode', label: t('sellerSettings.tabs.customcode', 'Custom Code'), icon: Code, locked: !canAccess('css') },
        { key: 'shipping', label: t('sellerSettings.tabs.shipping', 'Shipping'), icon: Globe },
        { key: 'notifications', label: t('sellerSettings.tabs.notifications', 'Notifications'), icon: Bell },
        { key: 'security', label: t('sellerSettings.tabs.security', 'Security'), icon: Shield },
    ];

    const handleCompletePasswordReset = async () => {
        setIsSaving(true);
        setSecurityError('');
        if (passwordData.password !== passwordData.confirmPassword) {
            setSecurityError(t('auth.errorPasswordMatch'));
            setIsSaving(false);
            return;
        }
        try {
            await changePassword({
                current_password: passwordData.currentPassword,
                password: passwordData.password,
                password_confirmation: passwordData.confirmPassword
            });
            setPasswordData({ currentPassword: '', password: '', confirmPassword: '' });
            setSaveSuccess('security');
            setTimeout(() => setSaveSuccess(null), 3000);
        } catch (err) {
            setSecurityError(err.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors`;

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('sellerSettings.title', 'Seller Settings')}</h2>

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
                            <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.username.title', 'Shop Username')}</h3>
                        </div>
                        <p className="text-xs text-text-muted mb-4">
                            {t('sellerSettings.username.desc', "Your shop's unique URL on Toroongo.")}{' '}
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
                                        <span className="text-xs text-gray-400">{t('sellerSettings.username.checking', 'Checking availability...')}</span>
                                    </>
                                ) : shopUsername ? (
                                    slugStatus.available ? (
                                        <>
                                            <CheckCircle2 size={13} className="text-green-500" />
                                            <span className="text-xs text-green-600 font-medium">{slugStatus.reason || t('sellerSettings.username.available', 'Username is available!')}</span>
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
                                    {t('sellerSettings.username.preview', 'Preview your storefront')}
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={handleClaimUsername}
                            disabled={!slugStatus.available || !isUsernameDirty || isSaving}
                            className={`mt-4 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all
                                ${saveSuccess === 'username' 
                                    ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                    : (slugStatus.available && isUsernameDirty && !isSaving
                                        ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed')
                                }`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                            {saveSuccess === 'username' ? (
                                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                            ) : (
                                isSaving ? t('sellerSettings.username.claiming', 'Claiming...') : shopUsername === currentSlug ? t('sellerSettings.username.currentBtn', 'Current Username') : t('sellerSettings.username.claim', 'Claim Username')
                            )}
                        </button>
                    </div>

                    {/* ── Store Info ─── */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.storeInfo.title', 'Store Information')}</h3>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.name', 'Shop Name')}</label>
                            <input type="text" value={storeInfo.store_name} onChange={(e) => setStoreInfo({...storeInfo, store_name: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.description', 'Shop Description')}</label>
                            <textarea
                                rows={3}
                                value={storeInfo.description}
                                onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.email', 'Public Email')}</label>
                            <input type="email" value={storeInfo.email} onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.phone', 'Public Phone')}</label>
                            <input type="tel" value={storeInfo.phone} onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.storeInfo.location', 'Location')}</label>
                            <input type="text" value={storeInfo.location} onChange={(e) => setStoreInfo({...storeInfo, location: e.target.value})} className={inputClass} placeholder={t('sellerSettings.storeInfo.locationPlaceholder', 'e.g. United States, New York')} />
                        </div>
                        <button 
                            onClick={handleSaveStoreInfo} 
                            disabled={saveStoreInfoLoading || (!isStoreInfoDirty && saveSuccess !== 'store')} 
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                                ${saveSuccess === 'store' 
                                    ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                    : isStoreInfoDirty 
                                        ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                                disabled:opacity-70`}
                        >
                            {saveStoreInfoLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                            {saveSuccess === 'store' ? (
                                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                            ) : (
                                t('sellerSettings.storeInfo.save', 'Save Store Info')
                            )}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'country_currency' && (
                <div className="max-w-lg space-y-5">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.countryCurrency.title', 'Country & Currency')}</h3>
                        <p className="text-sm text-text-muted mt-1">
                            {t('sellerSettings.countryCurrency.desc', "Your country sets your store's currency. All product prices you enter will be stored in this currency and automatically converted for buyers worldwide.")}
                        </p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                        <strong>{t('sellerSettings.countryCurrency.important', 'Important:')}</strong> {t('sellerSettings.countryCurrency.importantDesc', "Changing your currency will update the currency for all your existing products. Their stored prices will remain the same numbers, so you may want to review and update them to match the new currency.")}
                    </div>
                    <CountrySelector value={countryData} onChange={setCountryData} />
                    <button
                        onClick={handleSaveCountry}
                        disabled={saveCountryLoading || (!isCountryDirty && saveSuccess !== 'country_currency')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'country_currency' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isCountryDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {saveCountryLoading && <Loader2 size={16} className="animate-spin" />}
                        {saveSuccess === 'country_currency' ? (
                            <><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</>
                        ) : (
                            t('sellerSettings.countryCurrency.save', 'Save Country & Currency')
                        )}
                    </button>
                </div>
            )}

            {activeTab === 'branding' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.branding.title', 'Branding & Appearance')}</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.branding.color', 'Primary Brand Color')}</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className="w-10 h-10 rounded-lg border border-border-soft cursor-pointer" />
                            <input type="text" value={branding.brand_color} onChange={(e) => setBranding({...branding, brand_color: e.target.value})} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.branding.logo', 'Logo')}</label>
                        <MediaUploader
                            variant="compact"
                            maxFiles={1}
                            acceptVideo={false}
                            value={branding.logo ? [branding.logo] : []}
                            onChange={(urls) => setBranding({...branding, logo: urls[0] || ''})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.branding.banner', 'Banner Image')}</label>
                        <MediaUploader
                            variant="compact"
                            maxFiles={1}
                            acceptVideo={false}
                            value={branding.banner ? [branding.banner] : []}
                            onChange={(urls) => setBranding({...branding, banner: urls[0] || ''})}
                        />
                    </div>
                    <button 
                        onClick={handleSaveBranding} 
                        disabled={saveBrandingLoading || (!isBrandingDirty && saveSuccess !== 'branding')} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'branding' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isBrandingDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {saveBrandingLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {saveSuccess === 'branding' ? (
                            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                        ) : (
                            t('sellerSettings.branding.save', 'Save Branding')
                        )}
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'shipping' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.shipping.title', 'Shipping Settings')}</h3>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.shipping.processing', 'Processing Time (days)')}</label>
                        <input type="number" value={shipping.processing_time} onChange={(e) => setShipping({...shipping, processing_time: parseInt(e.target.value) || 0})} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.shipping.threshold', 'Free Shipping Threshold ($)')}</label>
                        <input type="number" value={shipping.free_shipping_threshold} onChange={(e) => setShipping({...shipping, free_shipping_threshold: parseFloat(e.target.value) || 0})} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.shipping.rate', 'Standard Shipping Rate ($)')}</label>
                        <input type="number" value={shipping.standard_shipping_rate} onChange={(e) => setShipping({...shipping, standard_shipping_rate: parseFloat(e.target.value) || 0})} step="0.01" className={inputClass} />
                    </div>
                    <label className="flex items-center gap-3 p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300">
                        <input type="checkbox" checked={shipping.offer_express_shipping} onChange={(e) => setShipping({...shipping, offer_express_shipping: e.target.checked})} className="accent-brand-primary w-4 h-4" />
                        <div>
                            <p className="text-sm font-medium text-text-primary">{t('sellerSettings.shipping.express', 'Offer express shipping')}</p>
                            <p className="text-xs text-text-muted">{t('sellerSettings.shipping.expressDesc', 'Allow customers to choose faster 2-3 day delivery')}</p>
                        </div>
                    </label>
                    <button 
                        onClick={() => handleSaveSettings('shipping', shipping, setSaveShippingLoading)} 
                        disabled={saveShippingLoading || (!isShippingDirty && saveSuccess !== 'shipping')} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'shipping' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isShippingDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {saveShippingLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {saveSuccess === 'shipping' ? (
                            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                        ) : (
                            t('sellerSettings.shipping.save', 'Save Shipping Settings')
                        )}
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4 bg-white p-6 rounded-2xl border border-border-soft">
                    <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.notifications.title', 'Notification Preferences')}</h3>
                    {[
                        { key: 'new_orders', label: t('sellerSettings.notifications.newOrders', 'New orders'), desc: t('sellerSettings.notifications.newOrdersDesc', 'Get notified when you receive a new order') },
                        { key: 'order_updates', label: t('sellerSettings.notifications.orderUpdates', 'Order updates'), desc: t('sellerSettings.notifications.orderUpdatesDesc', 'Status changes and delivery confirmations') },
                        { key: 'customer_messages', label: t('sellerSettings.notifications.customerMessages', 'Customer messages'), desc: t('sellerSettings.notifications.customerMessagesDesc', 'When a buyer sends you a message') },
                        { key: 'low_stock_alerts', label: t('sellerSettings.notifications.lowStock', 'Low stock alerts'), desc: t('sellerSettings.notifications.lowStockDesc', 'When product stock falls below 5 units') },
                        { key: 'payout_notifications', label: t('sellerSettings.notifications.payouts', 'Payout notifications'), desc: t('sellerSettings.notifications.payoutsDesc', 'When payouts are processed to your bank') },
                    ].map((item) => (
                        <label key={item.key} className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <input type="checkbox" checked={notifications[item.key]} onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})} className="accent-brand-primary mt-0.5 w-4 h-4" />
                        </label>
                    ))}
                    <button 
                        onClick={() => handleSaveSettings('notifications', notifications, setSaveNotificationsLoading)} 
                        disabled={saveNotificationsLoading || (!isNotificationsDirty && saveSuccess !== 'notifications')} 
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'notifications' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isNotificationsDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {saveNotificationsLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {saveSuccess === 'notifications' ? (
                            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                        ) : (
                            t('sellerSettings.notifications.save', 'Save Notification Preferences')
                        )}
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
                            <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.content.aboutTitle', 'About Your Store')}</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            {t('sellerSettings.content.aboutDesc', 'Tell your story. This will be displayed on the "About" tab of your storefront.')}
                        </p>
                        <div>
                            <textarea
                                rows={8}
                                value={storeContent.about_content}
                                onChange={(e) => setStoreContent({...storeContent, about_content: e.target.value})}
                                className={`${inputClass} resize-none`}
                                placeholder={t('sellerSettings.content.aboutPlaceholder', 'Describe your store, your team, and your mission...')}
                            />
                        </div>
                    </div>

                    {/* Why Shop With Us (Benefits) */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.content.benefitsTitle', 'Why Shop With Us')}</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            {t('sellerSettings.content.benefitsDesc', 'Highlight what makes your store unique. These appear on your "About" page.')}
                        </p>
                        
                        <div className="space-y-4">
                            {storeContent.benefits.map((benefit, index) => (
                                <div key={index} className="p-4 border border-border-soft rounded-xl space-y-3 relative group">
                                    <button 
                                        onClick={() => {
                                            const newBenefits = [...storeContent.benefits];
                                            newBenefits.splice(index, 1);
                                            setStoreContent({...storeContent, benefits: newBenefits});
                                        }}
                                        className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('sellerSettings.content.benefitNum', 'Benefit #{{num}}', { num: index + 1 })}</span>
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
                                        placeholder={t('sellerSettings.content.benefitPlaceholder', 'Benefit Title (e.g. Fast Shipping)')}
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
                                        placeholder={t('sellerSettings.content.descPlaceholder', 'Description...')}
                                    />
                                </div>
                            ))}

                            <button 
                                onClick={() => setStoreContent({...storeContent, benefits: [...storeContent.benefits, { title: '', desc: '' }]})}
                                className="w-full py-3 border-2 border-dashed border-border-soft rounded-xl text-sm font-medium text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} />
                                {t('sellerSettings.content.addBenefit', 'Add Benefit')}
                            </button>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-6">
                    {/* Store Policies */}
                    <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText size={18} className="text-brand-primary" />
                            <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.content.policiesTitle', 'Store Policies')}</h3>
                        </div>
                        <p className="text-xs text-text-muted">
                            {t('sellerSettings.content.policiesDesc', 'Define your custom policies for shipping, returns, warranty, and FAQs.')}
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">{t('sellerSettings.content.shippingPolicy', 'Shipping Policy')}</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.shipping}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, shipping: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder={t('sellerSettings.content.shippingPlaceholder', 'Order processing times, shipping methods, areas covered...')}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">{t('sellerSettings.content.returnsPolicy', 'Return & Refund Policy')}</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.returns}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, returns: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder={t('sellerSettings.content.returnsPlaceholder', 'Return windows, refund conditions, who pays for shipping...')}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">{t('sellerSettings.content.warrantyPolicy', 'Warranty Information')}</label>
                                <textarea
                                    rows={3}
                                    value={storeContent.policies.warranty}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, warranty: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder={t('sellerSettings.content.warrantyPlaceholder', 'Product guarantee periods, coverage details...')}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-primary mb-1.5 uppercase tracking-wider">{t('sellerSettings.content.faqPolicy', 'Frequently Asked Questions (FAQ)')}</label>
                                <textarea
                                    rows={4}
                                    value={storeContent.policies.faq}
                                    onChange={(e) => setStoreContent({...storeContent, policies: {...storeContent.policies, faq: e.target.value}})}
                                    className={`${inputClass} resize-none`}
                                    placeholder={t('sellerSettings.content.faqPlaceholder', 'Common questions and answers for your buyers...')}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleSaveSettings('content', storeContent, setSaveContentLoading)} 
                        disabled={saveContentLoading || (!isContentDirty && saveSuccess !== 'content')} 
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg
                            ${saveSuccess === 'content' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200 shadow-none' 
                                : isContentDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary shadow-brand-primary/20'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed shadow-none'}
                            disabled:opacity-50`}
                    >
                        {saveContentLoading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                        {saveSuccess === 'content' ? (
                            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</span>
                        ) : (
                            t('sellerSettings.content.save', 'Save Store Content')
                        )}
                    </button>
                    </div>
                </div>
            )}
            {activeTab === 'whitelabel' && (
                !canAccess('whitelabel') ? (
                    <div className="py-8">
                        <UpgradePrompt
                            currentPlan={currentPlan}
                            feature={t('sellerSettings.whitelabel.upgrade.title', 'White-Labeling')}
                            requiredPlan="business"
                            message={t('sellerSettings.whitelabel.upgrade.message', "Remove all Toroongo branding from your storefront. Your customers will see only your brand — no 'Powered by Toroongo' footer.")}
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Eye size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.whitelabel.title', 'White-Label Settings')}</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                {t('sellerSettings.whitelabel.desc', 'Control the Toroongo branding on your storefront. Your Business plan includes full white-labeling.')}
                            </p>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{t('sellerSettings.whitelabel.removeFooter', 'Remove "Powered by Toroongo" footer')}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{t('sellerSettings.whitelabel.removeFooterDesc', 'Your storefront will show no Toroongo branding to customers')}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{t('sellerSettings.whitelabel.hideEmail', 'Hide Toroongo from email templates')}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{t('sellerSettings.whitelabel.hideEmailDesc', 'Order confirmations and notifications will use your brand only')}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <label className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{t('sellerSettings.whitelabel.customFavicon', 'Custom favicon')}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{t('sellerSettings.whitelabel.customFaviconDesc', 'Use your own favicon instead of the Toroongo icon')}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <div className="pt-2">
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-800">{t('sellerSettings.whitelabel.activeTitle', 'White-Label Active')}</p>
                                        <p className="text-xs text-green-600 mt-0.5">{t('sellerSettings.whitelabel.activeDesc', 'All Toroongo branding has been removed from your storefront.')}</p>
                                    </div>
                                </div>
                            </div>

                             <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                {t('sellerSettings.whitelabel.save', 'Save White-Label Settings')}
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
                            feature={t('sellerSettings.customcode.upgrade.title', 'Custom CSS/HTML Access')}
                            requiredPlan="enterprise"
                            message={t('sellerSettings.customcode.upgrade.message', 'Inject custom CSS and HTML into your storefront for bespoke design. Create a truly unique shopping experience.')}
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Code size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.customcode.cssTitle', 'Custom CSS')}</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                {t('sellerSettings.customcode.cssDesc', 'Add custom CSS to override storefront styles. Changes apply to your public storefront only.')}
                            </p>
                            <textarea
                                rows={12}
                                className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
                                placeholder={t('sellerSettings.customcode.cssPlaceholder', '/* Your custom storefront CSS */')}
                                defaultValue=""
                            />
                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                {t('sellerSettings.customcode.cssSave', 'Save Custom CSS')}
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Code size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.customcode.htmlTitle', 'Custom HTML (Head Injection)')}</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                {t('sellerSettings.customcode.htmlDesc', 'Inject custom HTML into the <head> of your storefront. Useful for analytics scripts, meta tags, or third-party integrations.')}
                            </p>
                            <textarea
                                rows={8}
                                className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
                                placeholder={t('sellerSettings.customcode.htmlPlaceholder', '<!-- Custom head HTML -->')}
                                defaultValue=""
                            />
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    <strong>{t('sellerSettings.customcode.htmlCaution', 'Caution:')}</strong> {t('sellerSettings.customcode.htmlCautionDesc', 'Injecting invalid HTML or scripts may break your storefront. Test changes carefully.')}
                                </p>
                            </div>
                            <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                                {t('sellerSettings.customcode.htmlSave', 'Save Custom HTML')}
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
                            feature={t('sellerSettings.currency.upgrade.title', 'Multi-Currency Support')}
                            requiredPlan="business"
                            message={t('sellerSettings.currency.upgrade.message', 'Automatically convert prices based on your visitor\'s location. Show prices in BDT, USD, MYR, AED, INR, and more.')}
                            variant="card"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white p-6 rounded-2xl border border-border-soft space-y-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Banknote size={18} className="text-brand-primary" />
                                <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.currency.title', 'Multi-Currency Settings')}</h3>
                            </div>
                            <p className="text-xs text-text-muted">
                                {t('sellerSettings.currency.desc', 'Enable currencies for your store. Prices auto-convert based on the visitor\'s IP address.')}
                            </p>

                            <label className="flex items-start justify-between p-4 border border-brand-primary/20 bg-brand-primary/[0.03] rounded-xl cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{t('sellerSettings.currency.autoDetect', 'Auto-detect currency by IP')}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{t('sellerSettings.currency.autoDetectDesc', 'Automatically show prices in the visitor\'s local currency')}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="accent-brand-primary mt-0.5 w-4 h-4" />
                            </label>

                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{t('sellerSettings.currency.enabledCurrencies', 'Enabled Currencies')}</p>
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
                                {t('sellerSettings.currency.save', 'Save Currency Settings')}
                            </button>
                        </div>
                    </div>
                )
            )}
            {activeTab === 'security' && (
                <div className="max-w-lg space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">{t('sellerSettings.security.title', 'Security Settings')}</h3>
                        <p className="text-sm text-text-muted mt-1">
                            {t('sellerSettings.security.desc', 'Manage your account security and password.')}
                        </p>
                    </div>

                    {securityError && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                            {securityError}
                        </div>
                    )}

                    <div className="p-6 border border-border-soft rounded-2xl bg-surface-bg/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Shield className="text-brand-primary" size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">{t('sellerSettings.security.password', 'Account Password')}</p>
                                <p className="text-xs text-text-muted">{t('sellerSettings.security.passwordLastChanged', 'Recommended to change password every 3 months')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {user?.has_password !== false && (
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.security.currentPassword', 'Current Password')}</label>
                                    <input
                                        type="password"
                                        placeholder={t('sellerSettings.security.currentPasswordPlaceholder', 'Enter current password')}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.security.newPassword', 'New Password')}</label>
                                <input
                                    type="password"
                                    placeholder={t('sellerSettings.security.newPasswordPlaceholder', 'Min 8 characters')}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerSettings.security.confirmNewPassword', 'Confirm New Password')}</label>
                                <input
                                    type="password"
                                    placeholder={t('sellerSettings.security.confirmNewPasswordPlaceholder', 'Repeat new password')}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={handleCompletePasswordReset}
                                    disabled={isSaving || (user?.has_password !== false && !passwordData.currentPassword) || !passwordData.password}
                                    className="w-full py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                                    {t('sellerSettings.security.updatePassword', 'Update Password')}
                                </button>
                            </div>
                        </div>

                        {saveSuccess === 'security' && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                {t('sellerSettings.security.passwordUpdated', 'Password updated successfully!')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
