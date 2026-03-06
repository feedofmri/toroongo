import React, { useState } from 'react';
import { Store, Paintbrush, Globe, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SellerSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('store');

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
                <div className="max-w-lg space-y-5 bg-white p-6 rounded-2xl border border-border-soft">
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
