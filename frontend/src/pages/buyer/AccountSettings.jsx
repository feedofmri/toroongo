import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { User, MapPin, CreditCard, Bell, Plus, Pencil, Trash2, Loader2, X, Globe, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService, addressService, paymentMethodService } from '../../services';
import CountrySelector from '../../components/ui/CountrySelector';
import { setBuyerCurrencyCode } from '../../utils/currency';

export default function AccountSettings() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    // Notification State
    const [notificationPrefs, setNotificationPrefs] = useState({
        orderUpdates: true,
        promotions: true,
        sellerMessages: true,
        wishlistAlerts: false
    });
    // Profile State
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Address State
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        label: 'Home', first_name: '', last_name: '', email: '', phone: '',
        address: '', city: '', state: '', zip: '', country: 'BD'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isSavingCountry, setIsSavingCountry] = useState(false);
    const [countryData, setCountryData] = useState({ country: '', currency_code: 'USD', country_custom_name: '' });
    const [saveSuccess, setSaveSuccess] = useState(null);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { changePassword } = useAuth();

    const isProfileDirty = React.useMemo(() => {
        if (!user) return false;
        const currentFirst = user.name?.split(' ')[0] || '';
        const currentLast = user.name?.split(' ').slice(1).join(' ') || '';
        return profile.firstName !== currentFirst ||
               profile.lastName !== currentLast ||
               profile.email !== (user.email || '') ||
               profile.phone !== (user.phone || '');
    }, [profile, user]);

    const isCountryDirty = React.useMemo(() => {
        if (!user) return false;
        return countryData.country !== (user.country || '') ||
               countryData.currency_code !== (user.currency_code || 'USD') ||
               countryData.country_custom_name !== (user.country_custom_name || '');
    }, [countryData, user]);

    const isNotificationsDirty = React.useMemo(() => {
        if (!user) return false;
        const n = user.buyer_settings?.notifications || {
            orderUpdates: true, promotions: true, sellerMessages: true, wishlistAlerts: false
        };
        return notificationPrefs.orderUpdates !== n.orderUpdates ||
               notificationPrefs.promotions !== n.promotions ||
               notificationPrefs.sellerMessages !== n.sellerMessages ||
               notificationPrefs.wishlistAlerts !== n.wishlistAlerts;
    }, [notificationPrefs, user]);


    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            setCountryData({
                country: user.country || '',
                currency_code: user.currency_code || 'USD',
                country_custom_name: user.country_custom_name || '',
            });

            if (user.buyer_settings?.notifications) {
                setNotificationPrefs({
                    ...notificationPrefs,
                    ...user.buyer_settings.notifications
                });
            }
            
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, {
                name: `${profile.firstName} ${profile.lastName}`.trim(),
                email: profile.email,
                phone: profile.phone
            });
            updateUser(updatedUser);
            // alert(t('account.profileUpdated', 'Profile updated successfully!'));
        } catch (error) {
            console.error('Failed to update profile:', error);
            // alert(t('account.profileUpdateError', 'Failed to update profile.'));
        } finally {
            setIsSavingProfile(false);
            setSaveSuccess('profile');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const handleOpenAddressModal = (addr = null) => {
        if (addr) {
            setEditingAddress(addr);
            setAddressForm({ ...addr });
        } else {
            setEditingAddress(null);
            setAddressForm({
                label: 'Home', first_name: profile.firstName, last_name: profile.lastName, 
                email: profile.email, phone: profile.phone,
                address: '', city: '', state: '', zip: '', country: 'BD'
            });
        }
        setIsAddressModalOpen(true);
    };

    useEffect(() => {
        if (user && activeTab === 'payment') {
            const fetchPayments = async () => {
                setLoadingPayments(true);
                try {
                    const data = await paymentMethodService.getMyMethods();
                    setPaymentMethods(data || []);
                } catch (err) {
                    console.error('Failed to fetch payment methods:', err);
                } finally {
                    setLoadingPayments(false);
                }
            };
            fetchPayments();
        }
    }, [user, activeTab]);

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setIsSavingAddress(true);
        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, addressForm);
            } else {
                await addressService.createAddress(addressForm);
            }
            await fetchAddresses();
            setIsAddressModalOpen(false);
        } catch (error) {
            console.error('Failed to save address:', error);
            // alert(t('account.addressSaveError', 'Failed to save address.'));
        } finally {
            setIsSavingAddress(false);
            setSaveSuccess('address');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm(t('account.confirmDeleteAddress'))) return;
        try {
            await addressService.deleteAddress(id);
            await fetchAddresses();
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

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
            setSaveSuccess('notifications');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const handleSaveCountry = async () => {
        setIsSavingCountry(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, {
                country: countryData.country || null,
                currency_code: countryData.currency_code || 'USD',
                country_custom_name: countryData.country_custom_name || null,
            });
            updateUser(updatedUser);
            setBuyerCurrencyCode(countryData.currency_code || 'USD');
            // alert(t('account.countryCurrencyUpdated', 'Country & currency updated!'));
        } catch (err) {
            // alert('Failed to update: ' + err.message);
        } finally {
            setIsSavingCountry(false);
            setSaveSuccess('country');
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    const tabs = [
        { key: 'profile', label: t('account.profile'), icon: User },
        { key: 'addresses', label: t('account.addresses'), icon: MapPin },
        { key: 'country', label: t('account.countryCurrency'), icon: Globe },
        { key: 'payment', label: t('account.payment'), icon: CreditCard },
        { key: 'notifications', label: t('account.notifications'), icon: Bell },
        { key: 'security', label: t('account.security', 'Security'), icon: Lock },
    ];

    const handleCompletePasswordReset = async () => {
        setIsSaving(true);
        setError('');
        if (passwordData.password !== passwordData.confirmPassword) {
            setError(t('auth.errorPasswordMatch'));
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
            setError(err.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

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
                            <input 
                                type="text" 
                                value={profile.firstName} 
                                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.lastName')}</label>
                            <input 
                                type="text" 
                                value={profile.lastName} 
                                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                                className={inputClass} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.email')}</label>
                        <input 
                            type="email" 
                            value={profile.email} 
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className={inputClass} 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.phone')}</label>
                        <input 
                            type="tel" 
                            value={profile.phone} 
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className={inputClass} 
                        />
                    </div>
                    <button 
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile || (!isProfileDirty && saveSuccess !== 'profile')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'profile' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isProfileDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
                        {saveSuccess === 'profile' ? (
                            <><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</>
                        ) : (
                            t('account.saveChanges')
                        )}
                    </button>
                </div>
            )}

            {/* Country & Currency Tab */}
            {activeTab === 'country' && (
                <div className="max-w-lg space-y-5">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">{t('account.countryCurrency')}</h3>
                        <p className="text-sm text-text-muted mt-1">
                            {t('account.countryCurrencyDesc')}
                        </p>
                    </div>
                    <CountrySelector value={countryData} onChange={setCountryData} />
                    <button
                        onClick={handleSaveCountry}
                        disabled={isSavingCountry || (!isCountryDirty && saveSuccess !== 'country')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'country' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isCountryDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {isSavingCountry ? <Loader2 size={16} className="animate-spin" /> : null}
                        {saveSuccess === 'country' ? (
                            <><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</>
                        ) : (
                            t('account.saveCountryCurrency')
                        )}
                    </button>
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-text-primary">{t('account.savedAddresses')}</h3>
                        <button 
                            onClick={() => handleOpenAddressModal()}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 transition-colors"
                        >
                            <Plus size={15} /> {t('account.addAddress')}
                        </button>
                    </div>
                    
                    {loadingAddresses ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={32} className="text-brand-primary animate-spin mb-4" />
                            <p className="text-sm text-text-muted">{t('account.loadingAddresses')}</p>
                        </div>
                    ) : addresses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="p-5 border border-border-soft rounded-xl relative hover:border-brand-primary/30 transition-colors group">
                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{addr.label}</p>
                                    <p className="text-sm font-medium text-text-primary">{addr.first_name} {addr.last_name}</p>
                                    <p className="text-sm text-text-muted mt-0.5">{addr.address}</p>
                                    <p className="text-sm text-text-muted">{addr.city}, {addr.state} {addr.zip}</p>
                                    <p className="text-sm text-text-muted mt-1">{addr.phone}</p>
                                    <div className="flex gap-4 mt-4 pt-3 border-t border-border-soft opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenAddressModal(addr)}
                                            className="flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                        >
                                            <Pencil size={12} /> {t('account.edit')}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={12} /> {t('account.remove')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-border-soft rounded-2xl">
                            <MapPin size={40} className="text-text-muted/30 mx-auto mb-3" />
                            <p className="text-sm text-text-muted font-medium">{t('account.noAddresses')}</p>
                            <button 
                                onClick={() => handleOpenAddressModal()}
                                className="mt-4 text-xs font-bold text-brand-primary hover:underline"
                            >
                                {t('account.addFirstAddress')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
                        <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-bg">
                            <h3 className="font-bold text-text-primary">
                                {editingAddress ? t('account.editAddress') : t('account.addNewAddress')}
                            </h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.addressLabel')}</label>
                                <input 
                                    type="text" required value={addressForm.label} 
                                    onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} className={inputClass} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.firstName')}</label>
                                    <input 
                                        type="text" required value={addressForm.first_name} 
                                        onChange={(e) => setAddressForm({...addressForm, first_name: e.target.value})} className={inputClass} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.lastName')}</label>
                                    <input 
                                        type="text" required value={addressForm.last_name} 
                                        onChange={(e) => setAddressForm({...addressForm, last_name: e.target.value})} className={inputClass} 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.email')}</label>
                                    <input 
                                        type="email" value={addressForm.email} 
                                        onChange={(e) => setAddressForm({...addressForm, email: e.target.value})} className={inputClass} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.phone')}</label>
                                    <input 
                                        type="tel" required value={addressForm.phone} 
                                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className={inputClass} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.streetAddress')}</label>
                                <input 
                                    type="text" required value={addressForm.address} 
                                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} className={inputClass} 
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.city')}</label>
                                    <input 
                                        type="text" required value={addressForm.city} 
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className={inputClass} 
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.state')}</label>
                                    <input 
                                        type="text" value={addressForm.state} 
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className={inputClass} 
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.zip')}</label>
                                    <input 
                                        type="text" required value={addressForm.zip} 
                                        onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})} className={inputClass} 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" onClick={() => setIsAddressModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-text-muted bg-surface-bg rounded-xl hover:text-text-primary transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button 
                                    type="submit" disabled={isSavingAddress}
                                    className={`flex-[2] py-3 text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2
                                        ${saveSuccess === 'address' 
                                            ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                            : 'bg-brand-primary text-white hover:bg-brand-secondary'}`}
                                >
                                    {isSavingAddress ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {saveSuccess === 'address' ? (
                                        <><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</>
                                    ) : (
                                        editingAddress ? t('account.updateAddress') : t('account.saveAddress')
                                    )}
                                </button>
                            </div>
                        </form>
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
                        {loadingPayments ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 size={24} className="text-brand-primary animate-spin mb-2" />
                                <p className="text-sm text-text-muted">{t('common.loading', 'Loading...')}</p>
                            </div>
                        ) : paymentMethods.length > 0 ? (
                            paymentMethods.map((card) => (
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
                            ))
                        ) : (
                            <div className="text-center py-12 bg-surface-bg/30 rounded-2xl border border-dashed border-border-soft">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <CreditCard size={24} className="text-text-muted" />
                                </div>
                                <h4 className="text-sm font-bold text-text-primary mb-1">{t('account.noPayments', 'No payment methods found')}</h4>
                                <p className="text-xs text-text-muted max-w-[200px] mx-auto">{t('account.noPaymentsDesc', 'Add a card or bank account to speed up your checkout process.')}</p>
                            </div>
                        )}
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
                        disabled={isSaving || (!isNotificationsDirty && saveSuccess !== 'notifications')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${saveSuccess === 'notifications' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : isNotificationsDirty
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                            disabled:opacity-70`}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                        {saveSuccess === 'notifications' ? (
                            <><CheckCircle2 size={16} className="text-gray-500" /> {t('common.saved', 'Saved!')}</>
                        ) : (
                            t('account.savePrefs')
                        )}
                    </button>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="max-w-lg space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">{t('account.security', 'Security Settings')}</h3>
                        <p className="text-sm text-text-muted mt-1">
                            {t('account.securityDesc', 'Manage your account security and password.')}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="p-6 border border-border-soft rounded-2xl bg-surface-bg/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Shield className="text-brand-primary" size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">{t('account.password', 'Account Password')}</p>
                                <p className="text-xs text-text-muted">{t('account.passwordLastChanged', 'Recommended to change password every 3 months')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {user?.has_password !== false && (
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.currentPassword', 'Current Password')}</label>
                                    <input
                                        type="password"
                                        placeholder={t('account.currentPasswordPlaceholder', 'Enter current password')}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.newPassword', 'New Password')}</label>
                                <input
                                    type="password"
                                    placeholder={t('account.newPasswordPlaceholder', 'Min 8 characters')}
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('account.confirmNewPassword', 'Confirm New Password')}</label>
                                <input
                                    type="password"
                                    placeholder={t('account.confirmNewPasswordPlaceholder', 'Repeat new password')}
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
                                    {t('account.updatePassword', 'Update Password')}
                                </button>
                            </div>
                        </div>

                        {saveSuccess === 'security' && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                {t('account.passwordUpdated', 'Password updated successfully!')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
