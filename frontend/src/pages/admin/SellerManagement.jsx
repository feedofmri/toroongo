import React from 'react';
import { CheckCircle, Clock, XCircle, Eye, MoreHorizontal } from 'lucide-react';

const SELLERS = [
    { id: 1, name: 'Sony Electronics', email: 'admin@sony.com', products: 324, revenue: 82400, rating: 4.8, status: 'approved' },
    { id: 2, name: 'Urban Threads', email: 'hi@urbanthreads.com', products: 560, revenue: 64200, rating: 4.6, status: 'approved' },
    { id: 3, name: 'NaturGlow', email: 'hello@naturglow.com', products: 180, revenue: 45800, rating: 4.9, status: 'approved' },
    { id: 4, name: 'TechVault', email: 'support@techvault.com', products: 412, revenue: 38200, rating: 4.7, status: 'approved' },
    { id: 5, name: 'ArtisanCraft', email: 'apply@artisancraft.com', products: 0, revenue: 0, rating: 0, status: 'pending' },
    { id: 6, name: 'FakeGoods Inc.', email: 'fake@email.com', products: 12, revenue: 800, rating: 1.2, status: 'rejected' },
];

const STATUS_CONFIG = {
    approved: { label: 'Approved', icon: CheckCircle, style: 'text-green-600 bg-green-50' },
    pending: { label: 'Pending', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    rejected: { label: 'Rejected', icon: XCircle, style: 'text-red-500 bg-red-50' },
};

export default function SellerManagement() {
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
                            {SELLERS.map((seller) => {
                                const cfg = STATUS_CONFIG[seller.status];
                                return (
                                    <tr key={seller.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-text-primary">{seller.name}</p>
                                            <p className="text-[11px] text-text-muted">{seller.email}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{seller.products}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${seller.revenue.toLocaleString()}</td>
                                        <td className="px-5 py-3.5 text-sm text-text-muted">{seller.rating > 0 ? `⭐ ${seller.rating}` : '—'}</td>
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
