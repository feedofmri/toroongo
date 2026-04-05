import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, UserCheck, UserX, MoreHorizontal, Eye, Shield, Trash2 } from 'lucide-react';
import { adminService } from '../../services';
import Pagination from '../../components/ui/Pagination';
import UserDetailModal from '../../components/ui/UserDetailModal';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // UI state
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchUsers = () => {
        setLoading(true);
        adminService.getAllUsers(page, search, roleFilter)
            .then(data => {
                const results = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
                const mapped = results.map(u => ({
                    ...u,
                    joined: u.created_at || new Date().toISOString(),
                    status: 'active', // mock status
                    order_count: Math.floor(Math.random() * 10), // static for UI
                    total_spent: Math.floor(Math.random() * 1000)
                }));
                setUsers(mapped);
                setTotalPages(data?.last_page || 1);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchUsers();
        }
    };

    const handleViewUser = async (user) => {
        try {
            const fullDetails = await adminService.getUserDetails(user.id);
            setSelectedUser({ ...user, ...fullDetails });
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error("Failed to load user details", error);
        }
    };

    return (
        <div className="animate-fade-in flex flex-col min-h-[calc(100vh-160px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Registries</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage and monitor all platform accounts</p>
                </div>
                <div className="flex items-center gap-2">
                   {/* Actions placeholder */}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or ID (Press Enter)" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-border-soft rounded-[1.2rem] focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none shadow-sm transition-all" 
                    />
                </div>
                <div className="relative">
                    <select 
                        value={roleFilter} 
                        onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}
                        className="appearance-none pl-5 pr-12 py-3.5 text-sm bg-white border border-border-soft rounded-[1.2rem] cursor-pointer outline-none font-bold text-slate-600 focus:border-brand-primary shadow-sm"
                    >
                        <option value="all">Global (All Roles)</option>
                        <option value="buyer">Buyers Only</option>
                        <option value="seller">Sellers Only</option>
                        <option value="admin">Administrators</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-border-soft shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-bg/50 border-b border-border-soft">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Account</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Orders</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6 h-20 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{user.name}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest 
                                            ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                                              user.role === 'seller' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                              'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-slate-700">{user.order_count || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-slate-500">{new Date(user.joined).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 w-fit text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewUser(user)}
                                                className="p-2.5 bg-surface-bg text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                                title="View Detail"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2.5 bg-surface-bg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Security Settings">
                                                <Shield size={18} />
                                            </button>
                                            <button className="p-2.5 bg-surface-bg text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Restrict Access">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                {!loading && users.length > 0 && (
                    <div className="mt-auto">
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(p) => setPage(p)} 
                        />
                    </div>
                )}
            </div>

            <UserDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                user={selectedUser} 
            />
        </div>
    );
}

