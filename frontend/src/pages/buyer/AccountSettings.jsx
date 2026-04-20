import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { User, MapPin, CreditCard, Bell, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';

const MOCK_ADDRESSES = [
    { id: 1, label: 'Home', name: 'John Doe', address: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', phone: '+1 (555) 123-4567', isDefault: true },
    { id: 2, label: 'Office', name: 'John Doe', address: '456 Business Ave, Suite 200', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (555) 987-6543', isDefault: false },
];

const MOCK_PAYMENTS = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/28', isDefault: false },
];

export default function AccountSettings() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Notification State
    const [notificationPrefs, setNotificationPrefs] = useState({
        orderUpdates: true,
        promotions: true,
        sellerMessages: true,
        wishlistAlerts: false
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.buyer_settings?.notifications) {
            setNotificationPrefs({
                ...notificationPrefs,
                ...user.buyer_settings.notifications
            });
        }
    }, [user]);

    const handleSaveNotifications = async () => {
        setIsSaving(true);
        try {
            const currentSettings = user?.buyer_settings || {};
            const updatedUser = await userService.updateProfile(user.id, {
                buyer_settings: {
                    ...currentSettings,
                    notifications: notificationPrefs
                }
            });
            updateUser(updatedUser);
        } catch (error) {
            console.error('Failed to save notification preferences:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { key: 'profile', label: t('account.profile'), icon: User },
        { key: 'addresses', label: t('account.addresses'), icon: MapPin },
        { key: 'payment', label: t('account.payment'), icon: CreditCard },
        { key: 'notifications', label: t('account.notifications'), icon: Bell },
    ];

    const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.key
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-text-muted hover:bg-surface-bg hover:text-text-primary'
                            }`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="max-w-lg space-y-5">
                    <h3 className="text-lg font-semibold text-text-primary">{t('account.profileInfo')}</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <User size={28} className="text-brand-primary" />
                        </div>
                        <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                            {t('account.changePhoto')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.firstName')}</label>
                            <input type="text" defaultValue={user?.name?.split(' ')[0] || ''} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.lastName')}</label>
                            <input type="text" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.email')}</label>
                        <input type="email" defaultValue={user?.email || ''} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.phone')}</label>
                        <input type="tel" defaultValue={user?.phone || "+1 (555) 123-4567"} className={inputClass} />
                    </div>
                    <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        {t('account.saveChanges')}
                    </button>
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-text-primary">{t('account.savedAddresses')}</h3>
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 transition-colors">
                            <Plus size={15} /> {t('account.addAddress')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_ADDRESSES.map((addr) => (
                            <div key={addr.id} className="p-5 border border-border-soft rounded-xl relative">
                                {addr.isDefault && (
                                    <span className="absolute top-3 right-3 text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                                        {t('account.default')}
                                    </span>
                                )}
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{addr.label}</p>
                                <p className="text-sm font-medium text-text-primary">{addr.name}</p>
                                <p className="text-sm text-text-muted mt-0.5">{addr.address}</p>
                                <p className="text-sm text-text-muted">{addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-sm text-text-muted mt-1">{addr.phone}</p>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-brand-primary transition-colors">
                                        <Pencil size={12} /> {t('account.edit')}
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={12} /> {t('account.remove')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-text-primary">{t('account.paymentMethods')}</h3>
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 transition-colors">
                            <Plus size={15} /> {t('account.addCard')}
                        </button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_PAYMENTS.map((card) => (
                            <div key={card.id} className="flex items-center justify-between p-5 border border-border-soft rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-surface-bg rounded-lg flex items-center justify-center border border-border-soft">
                                        <CreditCard size={18} className="text-text-muted" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            {card.type} •••• {card.last4}
                                            {card.isDefault && (
                                                <span className="ml-2 text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                                                    {t('account.default')}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-text-muted">{t('account.expires', { date: card.expiry })}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs font-medium text-text-muted hover:text-brand-primary transition-colors">{t('account.edit')}</button>
                                    <button className="text-xs font-medium text-text-muted hover:text-red-500 transition-colors">{t('account.remove')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="max-w-lg space-y-5">
                    <h3 className="text-lg font-semibold text-text-primary">{t('account.notificationPrefs')}</h3>
                    {[
                        { label: t('account.orderUpdates'), desc: t('account.orderUpdatesDesc'), key: 'orderUpdates' },
                        { label: t('account.promotions'), desc: t('account.promotionsDesc'), key: 'promotions' },
                        { label: t('account.sellerMessages'), desc: t('account.sellerMessagesDesc'), key: 'sellerMessages' },
                        { label: t('account.wishlistAlerts'), desc: t('account.wishlistAlertsDesc'), key: 'wishlistAlerts' },
                    ].map((item, idx) => (
                        <label key={idx} className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={notificationPrefs[item.key]} 
                                onChange={(e) => setNotificationPrefs({...notificationPrefs, [item.key]: e.target.checked})}
                                className="accent-brand-primary mt-0.5 w-4 h-4" 
                            />
                        </label>
                    ))}
                    <button 
                        onClick={handleSaveNotifications}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-70"
                    >
                        {isSaving && <Loader2 size={16} className="animate-spin" />}
                        {t('account.savePrefs')}
                    </button>
                </div>
            )}
        </div>
    );
}
