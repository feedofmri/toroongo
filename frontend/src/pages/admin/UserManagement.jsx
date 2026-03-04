import React, { useState } from 'react';
import { Search, ChevronDown, UserCheck, UserX, MoreHorizontal } from 'lucide-react';

const USERS = [
    { id: 1, name: 'Sarah Mitchell', email: 'sarah@email.com', role: 'buyer', orders: 24, joined: '2025-08-12', status: 'active' },
    { id: 2, name: 'James Kim', email: 'james@email.com', role: 'buyer', orders: 15, joined: '2025-10-22', status: 'active' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily@email.com', role: 'buyer', orders: 8, joined: '2025-12-01', status: 'active' },
    { id: 4, name: 'Michael Thompson', email: 'michael@email.com', role: 'seller', orders: 0, joined: '2025-06-15', status: 'active' },
    { id: 5, name: 'Anna Lee', email: 'anna@email.com', role: 'buyer', orders: 31, joined: '2025-04-20', status: 'suspended' },
];

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filtered = USERS.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">User Management</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none" />
                </div>
                <div className="relative">
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-border-soft rounded-xl cursor-pointer outline-none">
                        <option value="all">All Roles</option>
                        <option value="buyer">Buyers</option>
                        <option value="seller">Sellers</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-surface-bg text-left">
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">User</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Role</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Orders</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Joined</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                            <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-border-soft">
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                        <p className="text-[11px] text-text-muted">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${user.role === 'seller' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'}`}>{user.role}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{user.orders}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{new Date(user.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${user.status === 'active' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                            {user.status === 'active' ? <UserCheck size={11} /> : <UserX size={11} />} {user.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button className="p-1.5 text-text-muted hover:text-text-primary"><MoreHorizontal size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
