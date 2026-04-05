import React from 'react';
import { X, Mail, Phone, Calendar, ShoppingBag, DollarSign, Shield, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDetailModal({ isOpen, onClose, user }) {
    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border-soft"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-border-soft bg-surface-bg/30">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-brand-primary/10 flex items-center justify-center text-brand-primary text-3xl font-black">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                        <p className="text-text-muted flex items-center gap-2 mt-1">
                                            <Mail size={14} /> {user.email}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-500 text-white' : user.role === 'seller' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                {user.role}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-colors text-text-muted">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-surface-bg/50 rounded-2xl border border-border-soft flex flex-col items-center">
                                    <ShoppingBag size={20} className="text-text-muted mb-2" />
                                    <p className="text-xl font-black text-slate-900">{user.order_count || 0}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Orders</p>
                                </div>
                                <div className="p-4 bg-surface-bg/50 rounded-2xl border border-border-soft flex flex-col items-center">
                                    <DollarSign size={20} className="text-text-muted mb-2" />
                                    <p className="text-xl font-black text-slate-900">${(user.total_spent || 0).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Spent</p>
                                </div>
                                <div className="p-4 bg-surface-bg/50 rounded-2xl border border-border-soft flex flex-col items-center">
                                    <Calendar size={20} className="text-text-muted mb-2" />
                                    <p className="text-xs font-black text-slate-900">{new Date(user.created_at || user.joined).toLocaleDateString()}</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Joined Date</p>
                                </div>
                            </div>

                            {/* Detailed Info */}
                            <div className="grid grid-cols-2 gap-8">
                                <section className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                        <Shield size={14} /> Security & System
                                    </h3>
                                    <div className="space-y-3 px-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Account ID</span>
                                            <span className="font-bold text-slate-700">#{user.id}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Last Active</span>
                                            <span className="font-bold text-slate-700">Today</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Login Method</span>
                                            <span className="font-bold text-slate-700">Email/Password</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                        <Activity size={14} /> Administrative
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Reset Password</button>
                                        <button className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">Deactivate Account</button>
                                        <button className="w-full py-2.5 text-text-muted rounded-xl text-[10px] font-bold hover:bg-surface-bg transition-all uppercase tracking-widest">Impersonate User</button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
