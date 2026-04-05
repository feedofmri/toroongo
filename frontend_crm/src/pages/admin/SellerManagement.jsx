import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Eye, MoreHorizontal, Star, Search, Filter } from 'lucide-react';
import { adminService } from '../../services';
import Pagination from '../../components/ui/Pagination';

const STATUS_CONFIG = {
    approved: { label: 'Approved', icon: CheckCircle, style: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    pending: { label: 'Pending', icon: Clock, style: 'text-amber-600 bg-amber-50 border-amber-100' },
    rejected: { label: 'Rejected', icon: XCircle, style: 'text-red-500 bg-red-50 border-red-100' },
};

export default function SellerManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchSellers = () => {
        setLoading(true);
        adminService.getSellers(page, search)
            .then(data => {
                setSellers(data.data);
                setTotalPages(data.last_page);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchSellers();
    }, [page]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchSellers();
        }
    };

    return (
        <div className="animate-fade-in flex flex-col min-h-[calc(100vh-160px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Merchant Control</h2>
                    <p className="text-slate-500 text-sm font-medium">Verify and monitor platform business partners</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
                        <Filter size={16} /> Advanced Filters
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search seller by shop name or email (Press Enter)..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-14 pr-6 py-4 text-sm bg-white border border-border-soft rounded-[1.5rem] focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none shadow-sm transition-all" 
                />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-border-soft shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-bg/50 border-b border-border-soft">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Info</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue (LTR)</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse h-24">
                                        <td colSpan="6" className="px-8 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : sellers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No merchants in directory</td>
                                </tr>
                            ) : sellers.map((seller) => {
                                const cfg = STATUS_CONFIG[seller.status] || STATUS_CONFIG.approved;
                                return (
                                    <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary text-base font-black border border-brand-primary/10">
                                                    {seller.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors">{seller.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{seller.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-slate-700">{seller.products} SKU</span>
                                                <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-primary" style={{ width: `${Math.min(100, (seller.products/50)*100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-900">${seller.revenue.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm font-black text-amber-500">
                                                <Star size={16} className="fill-amber-500" />
                                                {seller.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border w-fit ${cfg.style}`}>
                                                <cfg.icon size={12} strokeWidth={3} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-3 bg-surface-bg text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all shadow-sm" title="Merchant Insights">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-3 bg-surface-bg text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all shadow-sm">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {!loading && sellers.length > 0 && (
                    <div className="mt-auto border-t border-border-soft">
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(p) => setPage(p)} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

