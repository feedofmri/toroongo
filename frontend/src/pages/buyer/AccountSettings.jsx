import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, MapPin, CreditCard, Bell, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOCK_ADDRESSES = [
    { id: 1, label: 'Home', name: 'John Doe', address: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', phone: '+1 (555) 123-4567', isDefault: true },
    { id: 2, label: 'Office', name: 'John Doe', address: '456 Business Ave, Suite 200', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (555) 987-6543', isDefault: false },
];

const MOCK_PAYMENTS = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/28', isDefault: false },
];

export default function AccountSettings() {
    const { user } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        { key: 'profile', label: 'Profile', icon: User },
        { key: 'addresses', label: 'Addresses', icon: MapPin },
        { key: 'payment', label: 'Payment', icon: CreditCard },
        { key: 'notifications', label: 'Notifications', icon: Bell },
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
                    <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <User size={28} className="text-brand-primary" />
                        </div>
                        <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                            Change Photo
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">First Name</label>
                            <input type="text" defaultValue={user?.name?.split(' ')[0] || ''} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Last Name</label>
                            <input type="text" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
                        <input type="tel" defaultValue="+1 (555) 123-4567" className={inputClass} />
                    </div>
                    <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        Save Changes
                    </button>
                </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-text-primary">Saved Addresses</h3>
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 transition-colors">
                            <Plus size={15} /> Add Address
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_ADDRESSES.map((addr) => (
                            <div key={addr.id} className="p-5 border border-border-soft rounded-xl relative">
                                {addr.isDefault && (
                                    <span className="absolute top-3 right-3 text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                                        Default
                                    </span>
                                )}
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{addr.label}</p>
                                <p className="text-sm font-medium text-text-primary">{addr.name}</p>
                                <p className="text-sm text-text-muted mt-0.5">{addr.address}</p>
                                <p className="text-sm text-text-muted">{addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-sm text-text-muted mt-1">{addr.phone}</p>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-brand-primary transition-colors">
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={12} /> Remove
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
                        <h3 className="text-lg font-semibold text-text-primary">Payment Methods</h3>
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 transition-colors">
                            <Plus size={15} /> Add Card
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
                                                    Default
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-text-muted">Expires {card.expiry}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs font-medium text-text-muted hover:text-brand-primary transition-colors">Edit</button>
                                    <button className="text-xs font-medium text-text-muted hover:text-red-500 transition-colors">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="max-w-lg space-y-5">
                    <h3 className="text-lg font-semibold text-text-primary">Notification Preferences</h3>
                    {[
                        { label: 'Order updates', desc: 'Shipping confirmations and delivery alerts' },
                        { label: 'Promotions & deals', desc: 'Sales, discount codes, and special offers' },
                        { label: 'Seller messages', desc: 'Responses from sellers you contacted' },
                        { label: 'Wishlist alerts', desc: 'Price drops on your saved items' },
                    ].map((item, idx) => (
                        <label key={idx} className="flex items-start justify-between p-4 border border-border-soft rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={idx < 3} className="accent-brand-primary mt-0.5 w-4 h-4" />
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
