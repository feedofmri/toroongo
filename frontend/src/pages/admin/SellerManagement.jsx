import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Eye, MoreHorizontal, Star } from 'lucide-react';
import { adminService } from '../../services';

const STATUS_CONFIG = {
    approved: { label: 'Approved', icon: CheckCircle, style: 'text-green-600 bg-green-50' },
    pending: { label: 'Pending', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    rejected: { label: 'Rejected', icon: XCircle, style: 'text-red-500 bg-red-50' },
};

export default function SellerManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAllUsers()
            .then(users => {
                const sellerUsers = users.filter(u => u.role === 'seller').map(s => ({
                    ...s,
                    products: Math.floor(Math.random() * 50) + 1, // mock stat
                    revenue: Math.floor(Math.random() * 10000), // mock stat
                    rating: (Math.random() * 2 + 3).toFixed(1), // mock stat between 3 and 5
                    status: 'approved'
                }));
                setSellers(sellerUsers);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    if (loading) return <div className="p-8 text-center text-text-muted">Loading sellers...</div>;

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Seller Management</h2>
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-surface-bg text-left">
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Seller</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Products</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Revenue</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Rating</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-border-soft">
                            {sellers.length === 0 ? (
                                <tr><td colSpan="6" className="px-5 py-8 text-center text-text-muted">No sellers found.</td></tr>
                            ) : sellers.map((seller) => {
                                const cfg = STATUS_CONFIG[seller.status] || STATUS_CONFIG.approved;
                                return (
                                    <tr key={seller.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-text-primary">{seller.name}</p>
                                            <p className="text-[11px] text-text-muted">{seller.email}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{seller.products}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${seller.revenue.toLocaleString()}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{seller.rating > 0 ? <span className="inline-flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {seller.rating}</span> : '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cfg.style}`}>
                                                <cfg.icon size={11} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-1.5 text-text-muted hover:text-brand-primary"><Eye size={15} /></button>
                                                <button className="p-1.5 text-text-muted hover:text-text-primary"><MoreHorizontal size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
