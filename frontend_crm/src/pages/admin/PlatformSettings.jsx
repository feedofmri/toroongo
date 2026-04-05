import React, { useState, useEffect } from 'react';
import {
    Settings, Shield, Globe, Bell,
    Lock, Database, Cloud, Zap, Save,
    RefreshCcw, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminService } from '../../services';

export default function PlatformSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        marketplace_status: 'Live (Production)',
        primary_currency: 'USD ($)',
        seller_commission: 8,
        withdrawal_fee: 1.50
    });

    useEffect(() => {
        adminService.getSettings()
            .then(data => {
                if (Object.keys(data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminService.updateSettings(settings);
            // Show toast or notification (simulated)
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'system', label: 'System', icon: Database },
    ];

    if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse underline decoration-brand-primary decoration-4 underline-offset-8">Initializing System Parameters...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Configuration</h1>
                    <p className="text-slate-500 text-sm font-medium">Fine-tune global marketplace behavior and security logic.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                >
                    {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                    {saving ? 'Synchronizing...' : 'Commit Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                    : 'text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent hover:border-border-soft'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[3rem] border border-border-soft p-10 shadow-sm">
                        {activeTab === 'general' && (
                            <div className="space-y-10 animate-fade-in text-left">
                                <section>
                                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg"><Globe size={20} className="text-blue-500" /></div>
                                        Marketplace Governance
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Traffic Control Strategy</label>
                                            <select
                                                value={settings.marketplace_status}
                                                onChange={(e) => setSettings({ ...settings, marketplace_status: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all text-slate-700"
                                            >
                                                <option>Live (Production)</option>
                                                <option>Maintenance Mode</option>
                                                <option>Restricted Access</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1) ">Base Ledger Currency</label>
                                            <select
                                                value={settings.primary_currency}
                                                onChange={(e) => setSettings({ ...settings, primary_currency: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all text-slate-700"
                                            >
                                                <option>USD ($) - International</option>
                                                <option>BDT (৳) - Local</option>
                                                <option>INR (₹) - Regional</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px bg-slate-100"></div>

                                <section>
                                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 rounded-lg"><Zap size={20} className="text-amber-500" /></div>
                                        Financial Algorithms
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] transition-colors hover:bg-slate-100/50">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">Standard Seller Commission</p>
                                                <p className="text-xs text-slate-400 font-medium">Global percentage deducted from each successful checkout.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    value={settings.seller_commission}
                                                    onChange={(e) => setSettings({ ...settings, seller_commission: e.target.value })}
                                                    className="w-20 px-4 py-3 text-center font-black bg-white border border-border-soft rounded-xl text-sm shadow-sm focus:border-brand-primary outline-none"
                                                />
                                                <span className="text-xs font-black text-slate-400 uppercase">%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] transition-colors hover:bg-slate-100/50">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">Bank Transfer Overhead</p>
                                                <p className="text-xs text-slate-400 font-medium">Fixed processing cost for seller payout disbursements.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-slate-400">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={settings.withdrawal_fee}
                                                    onChange={(e) => setSettings({ ...settings, withdrawal_fee: e.target.value })}
                                                    className="w-24 px-4 py-3 text-center font-black bg-white border border-border-soft rounded-xl text-sm shadow-sm focus:border-brand-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex gap-5">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                            <AlertCircle className="text-amber-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">Critical Performance Warning</p>
                                            <p className="text-[11px] text-white/50 leading-relaxed mt-1 font-medium italic">
                                                "Modifying governance parameters in production affects active transaction pools and real-time ledger balancing. Proceed with extreme caution."
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab !== 'general' && (
                            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 border border-slate-100">
                                    <Lock size={40} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 italic underline decoration-slate-200 decoration-8 underline-offset-8">Superuser Access Required</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Security Protocol #4412-TRG ACTIVE</p>
                                </div>
                                <button className="px-8 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">Challenge Identity</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

