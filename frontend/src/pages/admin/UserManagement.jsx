import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, ChevronLeft, ChevronRight, UserCheck, UserX,
  Shield, ShoppingBag, Store, MoreVertical, RefreshCw, Users, X,
  Mail, Calendar, Package,
} from 'lucide-react';
import { adminService } from '../../services';

const ROLE_BADGE = {
  buyer:  'bg-blue-100 text-blue-700',
  seller: 'bg-teal-100 text-brand-primary',
  admin:  'bg-purple-100 text-purple-700',
};
const ROLE_ICON = { buyer: ShoppingBag, seller: Store, admin: Shield };

const AVATAR_COLORS = [
  'bg-blue-500','bg-teal-500','bg-purple-500','bg-amber-500',
  'bg-pink-500','bg-indigo-500','bg-rose-500','bg-cyan-500',
];

function UserAvatar({ name, size = 'md' }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  const dim = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs';
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function UserDetailModal({ user, onClose, onRoleChange, onToggleStatus, actionLoading }) {
  if (!user) return null;
  const RoleIcon = ROLE_ICON[user.role] || ShoppingBag;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-bg/50">
          <h3 className="font-bold text-text-primary">User Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="lg" />
            <div>
              <p className="font-bold text-text-primary text-lg">{user.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                <Mail size={12} /> {user.email}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Role',    value: user.role,         icon: RoleIcon  },
              { label: 'Orders',  value: user.order_count ?? '—', icon: ShoppingBag },
              { label: 'Spent',   value: user.total_spent ? `$${Number(user.total_spent).toLocaleString()}` : '—', icon: Package },
            ].map(s => (
              <div key={s.label} className="bg-surface-bg rounded-xl p-3 text-center">
                <s.icon size={14} className="mx-auto mb-1 text-text-muted" />
                <p className="text-sm font-bold text-text-primary capitalize">{s.value}</p>
                <p className="text-[10px] text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Joined */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar size={12} />
            Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {/* Change Role */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Change Role</p>
            <div className="flex gap-2">
              {['buyer', 'seller', 'admin'].map(role => {
                const Icon = ROLE_ICON[role];
                return (
                  <button
                    key={role}
                    disabled={user.role === role || actionLoading}
                    onClick={() => onRoleChange(user.id, role)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all capitalize
                      ${user.role === role
                        ? 'bg-brand-primary text-white cursor-default'
                        : 'bg-surface-bg text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary border border-border-soft'}`}
                  >
                    <Icon size={12} /> {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status action */}
          <button
            disabled={actionLoading}
            onClick={() => onToggleStatus(user.id)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${user.is_active === false
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
          >
            {user.is_active === false ? <UserCheck size={16} /> : <UserX size={16} />}
            {user.is_active === false ? 'Reactivate Account' : 'Suspend Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setPagData]  = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]  = useState('');
  const [roleFilter, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setAL] = useState(null);
  const [openMenu, setMenu]   = useState(null);
  const [detailUser, setDetail] = useState(null);
  const searchRef = useRef(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;
      const res = await adminService.getAllUsers(params);
      setPagData(res.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setAL(`role-${userId}`);
    try {
      await adminService.updateUserRole(userId, newRole);
      setPagData(prev => ({ ...prev, data: prev.data.map(u => u.id === userId ? { ...u, role: newRole } : u) }));
      setDetail(prev => prev?.id === userId ? { ...prev, role: newRole } : prev);
    } catch (e) { console.error(e); }
    finally { setAL(null); setMenu(null); }
  };

  const handleToggleStatus = async (userId) => {
    setAL(`status-${userId}`);
    try {
      await adminService.toggleUserStatus(userId);
      setPagData(prev => ({ ...prev, data: prev.data.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u) }));
      setDetail(prev => prev?.id === userId ? { ...prev, is_active: !prev.is_active } : prev);
    } catch (e) { console.error(e); }
    finally { setAL(null); setMenu(null); }
  };

  const openDetail = async (user) => {
    setDetail(user);
    try {
      const full = await adminService.getUserById(user.id);
      setDetail(full);
    } catch { /* keep existing data */ }
  };

  const { data: userList, current_page, last_page, total } = users;

  return (
    <div className="animate-fade-in space-y-6" onClick={() => setMenu(null)}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
          <p className="text-sm text-text-muted mt-0.5">{total.toLocaleString()} total registered users</p>
        </div>
        <button
          onClick={() => fetchUsers(current_page)}
          className="p-2.5 bg-white border border-border-soft rounded-xl text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all self-start"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers(1)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border-soft rounded-xl p-1 self-start">
          {['all', 'buyer', 'seller', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${roleFilter === r ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-brand-primary" />
            <p className="text-sm text-text-muted">Loading users…</p>
          </div>
        ) : userList.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-surface-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-text-muted/40" />
            </div>
            <p className="text-sm font-semibold text-text-primary">No users found</p>
            <p className="text-xs text-text-muted mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-bg border-b border-border-soft text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">User</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Role</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Joined</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Status</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {userList.map(user => {
                    const RoleIcon = ROLE_ICON[user.role] || ShoppingBag;
                    const isActive = user.is_active !== false;
                    return (
                      <tr key={user.id} className="hover:bg-surface-bg/50 transition-colors">
                        <td className="px-6 py-4">
                          <button onClick={() => openDetail(user)} className="flex items-center gap-3 text-left group">
                            <UserAvatar name={user.name} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate max-w-[160px]">{user.name}</p>
                              <p className="text-xs text-text-muted truncate max-w-[160px]">{user.email}</p>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[user.role] || 'bg-gray-100 text-gray-600'}`}>
                            <RoleIcon size={10} /> {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs text-text-muted">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setMenu(openMenu === user.id ? null : user.id)}
                              className="p-2 rounded-lg hover:bg-surface-bg text-text-muted hover:text-text-primary transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === user.id && (
                              <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-border-soft z-20 overflow-hidden">
                                <div className="p-2">
                                  <p className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wide">Set Role</p>
                                  {['buyer', 'seller', 'admin'].map(role => {
                                    const Icon = ROLE_ICON[role];
                                    return (
                                      <button
                                        key={role}
                                        disabled={user.role === role || !!actionLoading}
                                        onClick={() => handleRoleChange(user.id, role)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors capitalize ${user.role === role ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-text-primary hover:bg-surface-bg disabled:opacity-50'}`}
                                      >
                                        <Icon size={12} /> {role}
                                      </button>
                                    );
                                  })}
                                  <div className="my-1.5 border-t border-border-soft" />
                                  <button
                                    disabled={!!actionLoading}
                                    onClick={() => handleToggleStatus(user.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}
                                  >
                                    {isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                                    {isActive ? 'Suspend' : 'Reactivate'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {last_page > 1 && (
              <div className="px-6 py-4 border-t border-border-soft flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Page {current_page} of {last_page} · {total.toLocaleString()} users
                </span>
                <div className="flex items-center gap-2">
                  <button disabled={current_page <= 1} onClick={() => fetchUsers(current_page - 1)}
                    className="p-2 rounded-xl border border-border-soft hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <button disabled={current_page >= last_page} onClick={() => fetchUsers(current_page + 1)}
                    className="p-2 rounded-xl border border-border-soft hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetail(null)}
          onRoleChange={handleRoleChange}
          onToggleStatus={handleToggleStatus}
          actionLoading={!!actionLoading}
        />
      )}
    </div>
  );
}
