import React, { useState, useEffect } from 'react';
import {
    Users, Store, ShoppingBag, DollarSign,
    ArrowUp, ArrowDown, TrendingUp, Package,
    Star, Activity, Zap, ShieldCheck, Globe,
    ChevronDown, Download, Filter, Calendar,
    PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
    PieChart, Pie, Sector, ResponsiveContainer as RC,
    ComposedChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services';

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7');
    const [activeDrillDown, setActiveDrillDown] = useState(null);

    useEffect(() => {
        setLoading(true);
        adminService.getPlatformStats(timeRange)
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [timeRange]);

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-text-muted animate-pulse">Synchronizing Platform Data...</p>
            </div>
        );
    }

    const cards = [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+12%', up: true, icon: Users, color: 'bg-indigo-500' },
        { label: 'Active Sellers', value: stats.sellerCount.toLocaleString(), change: '+3.4%', up: true, icon: Store, color: 'bg-emerald-500' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+18%', up: true, icon: ShoppingBag, color: 'bg-brand-primary' },
        { label: 'Platform Rev.', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+5.2%', up: true, icon: DollarSign, color: 'bg-amber-500' },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-10"
        >
            {/* Header / Global Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Live Feed Active
                        </span>
                        <p className="text-slate-500 text-xs font-medium">Real-time sync: Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-border-soft">
                    {['7', '30', '90'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                                ${timeRange === range
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            {range} Days
                        </button>
                    ))}
                    <div className="w-px h-6 bg-border-soft mx-1 hidden sm:block"></div>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                        <Calendar size={14} /> Custom
                    </button>
                    <button className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
                        <Download size={14} />
                    </button>
                </div>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-border-soft shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`${card.color} w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                                <card.icon size={22} />
                            </div>
                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${card.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {card.change} {card.up ? <ArrowUp size={10} className="inline ml-0.5" /> : <ArrowDown size={10} className="inline ml-0.5" />}
                            </div>
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{card.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 relative z-10">{card.value}</h3>

                        {/* Decorative Background Icon */}
                        <card.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-100 group-hover:text-slate-200 transition-colors pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. Revenue & Orders (Composed Chart) */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-border-soft p-10 shadow-sm relative overflow-hidden min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <LineIcon size={24} className="text-brand-primary" />
                                Revenue Velocity
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">Correlating gross sales with successful order fulfillment</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-brand-primary"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart data={stats.salesData}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#008080" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#008080" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false} tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false} tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false} tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#f1f5f9', strokeWidth: 20 }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="sales" fill="url(#revGrad)" stroke="none" />
                                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#008080" strokeWidth={5} dot={{ r: 6, fill: '#008080', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
                                <Bar yAxisId="right" dataKey="orders" fill="#f59e0b" radius={[10, 10, 0, 0]} barSize={20} opacity={0.6} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Category Share (Pie Chart) */}
                <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-border-soft p-10 shadow-sm flex flex-col items-center min-w-0">
                    <div className="w-full mb-8">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <PieIcon size={24} className="text-indigo-500" />
                            Market Share
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">Inventory distribution across core categories</p>
                    </div>

                    <div className="h-[300px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={stats.categoryStats}
                                    cx="50%" cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    onMouseEnter={(_, idx) => setActiveDrillDown(stats.categoryStats[idx])}
                                    onMouseLeave={() => setActiveDrillDown(null)}
                                >
                                    {stats.categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <h4 className="text-3xl font-black text-slate-900">
                                {activeDrillDown ? activeDrillDown.percentage : '100'}%
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {activeDrillDown ? activeDrillDown.name : 'Total Share'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 w-full space-y-3">
                        {stats.categoryStats.slice(0, 4).map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-xs font-bold text-slate-600">{entry.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-400">{entry.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Operational Intelligence Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Executive Log */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-border-soft shadow-sm lg:col-span-2">
                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 px-1">
                        <Zap size={22} className="text-amber-500 fill-amber-500" />
                        Executive Log Feed
                    </h3>
                    <div className="space-y-6">
                        {stats.recentActivity.map((item, idx) => (
                            <div key={idx} className="flex gap-5 group items-center">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100 transition-all group-hover:scale-110
                                    ${item.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                                        item.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                            item.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                    <Activity size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-black text-slate-800 leading-tight mb-1">{item.text}</p>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            Internal Event
                                        </span>
                                        <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Trace Route</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Pulse Monitor */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:rotate-12 transition-transform">
                                <Activity className="text-teal-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">System Pulse</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Global Clusters Healthy</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 mt-10">
                            {[
                                { label: 'Cluster Load', value: stats.systemHealth.cpu, color: 'bg-teal-400' },
                                { label: 'Memory Buffer', value: stats.systemHealth.memory, color: 'bg-indigo-400' },
                                { label: 'API Latency', value: stats.systemHealth.latency > 100 ? 80 : 20, color: 'bg-amber-400', valText: `${stats.systemHealth.latency}ms` }
                            ].map((meter, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{meter.label}</span>
                                        <span className="text-sm font-black text-white">{meter.valText || `${meter.value}%`}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full p-0.5 border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${meter.value}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.2 }}
                                            className={`h-full rounded-full ${meter.color} shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-10">
                        <button className="w-full py-5 bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-xl flex items-center justify-center gap-2">
                            <ShieldCheck size={16} /> Run Full Diagnostic
                        </button>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute top-0 -right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                </div>
            </div>
        </motion.div>
    );
}

