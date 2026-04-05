import React, { useState } from 'react';
import { 
    History, Search, Filter, Download, 
    User, Shield, ShoppingBag, Globe, 
    AlertTriangle, CheckCircle, Info, ArrowRight,
    Calendar, MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const LOG_DATA = [
    { id: 'LOG-8234', user: 'Admin Sarah', action: 'Modified seller commission', entity: 'Financial Policy', status: 'success', time: '12:45 PM', date: 'Oct 12, 2023', ip: '192.168.1.1' },
    { id: 'LOG-8235', user: 'System Alpha', action: 'Daily database backup', entity: 'Database', status: 'success', time: '11:00 AM', date: 'Oct 12, 2023', ip: 'internal' },
    { id: 'LOG-8236', user: 'Support Team', action: 'Banned user #4921', entity: 'User Registry', status: 'warning', time: '10:15 AM', date: 'Oct 12, 2023', ip: '102.44.12.8' },
    { id: 'LOG-8237', user: 'Admin Mike', action: 'Deleted category "Test"', entity: 'Taxonomy', status: 'success', time: '09:30 AM', date: 'Oct 12, 2023', ip: '197.12.4.21' },
    { id: 'LOG-8238', user: 'Automatic Bot', action: 'Rate limit tripped', entity: 'Security Layer', status: 'error', time: '08:45 AM', date: 'Oct 12, 2023', ip: '142.12.45.1' },
    { id: 'LOG-8239', user: 'Admin Sarah', action: 'Updated site logo', entity: 'Assets', status: 'success', time: '03:15 PM', date: 'Oct 11, 2023', ip: '192.168.1.1' },
    { id: 'LOG-8240', user: 'Finance Bot', action: 'Calculated seller payouts', entity: 'Finance', status: 'success', time: '02:00 PM', date: 'Oct 11, 2023', ip: 'internal' },
];

export default function AuditLogs() {
    const [searchTerm, setSearchTerm] = useState('');

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle className="text-green-500" size={14} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={14} />;
            case 'error': return <Info className="text-red-500" size={14} />;
            default: return <Info className="text-slate-400" size={14} />;
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
                    <p className="text-slate-500 mt-1">Immutable record of all administrative and system events.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-text-primary font-bold rounded-xl border border-border-soft shadow-sm hover:bg-surface-bg transition-all">
                        <Download size={18} />
                        Export Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-[2rem] border border-border-soft shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search logs by user, action or entity..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface-bg border border-border-soft rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface-bg border border-border-soft rounded-2xl text-xs font-bold text-text-muted cursor-pointer hover:bg-white transition-all w-full md:w-auto justify-center">
                        <Calendar size={14} />
                        Last 30 Days
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[2.5rem] border border-border-soft shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-surface-bg/50 border-b border-border-soft">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Timestamp</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Initiator</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Action performed</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Entity</th>
                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Reference</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-soft/50">
                        {LOG_DATA.map((log) => (
                            <tr key={log.id} className="hover:bg-brand-primary/5 transition-all group">
                                <td className="px-8 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{log.time}</span>
                                        <span className="text-[10px] text-text-muted font-medium">{log.date}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-surface-bg flex items-center justify-center text-slate-400">
                                            <User size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{log.user}</span>
                                            <span className="text-[10px] text-text-muted font-medium">IP: {log.ip}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-700">{log.action}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-bg rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {log.entity}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="p-2 rounded-xl bg-surface-bg group-hover:bg-white transition-all shadow-sm">
                                            {getStatusIcon(log.status)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <button className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:underline">
                                        {log.id}
                                        <ArrowRight size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center pt-4">
                <button className="px-6 py-3 bg-white border border-border-soft text-sm font-bold text-slate-600 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                    Load More Events
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </motion.div>
    );
}
