import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, UserCheck, UserX, MoreHorizontal } from 'lucide-react';
import { adminService } from '../../services';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        adminService.getAllUsers()
            .then(data => {
                const mapped = data.map(u => ({
                    ...u,
                    joined: u.createdAt || new Date().toISOString(),
                    status: 'active', // mock status
                    orders: Math.floor(Math.random() * 10) // mock orders count for UI richness
                }));
                // Sort by joined descending
                mapped.sort((a, b) => new Date(b.joined) - new Date(a.joined));
                setUsers(mapped);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const filtered = users.filter((u) => {
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
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-text-muted">Loading users...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-text-muted">No users found.</td>
                                </tr>
                            ) : filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                        <p className="text-[11px] text-text-muted">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${user.role === 'seller' ? 'text-purple-600 bg-purple-50' : user.role === 'admin' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>{user.role}</span>
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
