import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, UserCheck, UserX,
  Shield, ShoppingBag, Store, MoreVertical,
  Users, X, Mail, Calendar, Package, Loader2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Pagination from '../../components/ui/Pagination';

/* ─── Helpers ─────────────────────────────────────────── */
const AVATAR_COLORS = ['bg-blue-500','bg-teal-500','bg-purple-500','bg-amber-500','bg-pink-500','bg-indigo-500','bg-rose-500'];
const ROLE_BADGE = { buyer:'bg-blue-100 text-blue-700', seller:'bg-teal-100 text-brand-primary', admin:'bg-purple-100 text-purple-700' };
const ROLE_ICON  = { buyer: ShoppingBag, seller: Store, admin: Shield };

function Avatar({ name, size = 'md' }) {
  const ini   = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[ini.charCodeAt(0) % AVATAR_COLORS.length];
  const dim   = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' }[size];
  return <div className={`${dim} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>{ini}</div>;
}

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

/* ─── User Detail Modal ──────────────────────────────── */
function UserModal({ user, onClose, onRoleChange, onToggle, busy }) {
  const RoleIcon = ROLE_ICON[user.role] || ShoppingBag;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft bg-surface-bg/50">
          <h3 className="font-bold text-text-primary">User Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-text-muted transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <p className="font-bold text-text-primary text-lg leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                <Mail size={11} /> {user.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { l: 'Role',   v: user.role,         Icon: RoleIcon    },
              { l: 'Orders', v: user.order_count ?? '—', Icon: ShoppingBag },
              { l: 'Spent',  v: user.total_spent ? `$${Number(user.total_spent).toLocaleString()}` : '—', Icon: Package },
            ].map(m => (
              <div key={m.l} className="bg-surface-bg rounded-xl p-3 text-center">
                <m.Icon size={13} className="mx-auto mb-1 text-text-muted" />
                <p className="text-sm font-bold text-text-primary capitalize truncate">{m.v}</p>
                <p className="text-[10px] text-text-muted">{m.l}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar size={11} /> Joined {fmtDate(user.created_at)}
          </div>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Change Role</p>
            <div className="flex gap-2">
              {['buyer','seller','admin'].map(r => {
                const Icon = ROLE_ICON[r];
                return (
                  <button key={r} disabled={user.role === r || busy}
                    onClick={() => onRoleChange(user.id, r)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all capitalize
                      ${user.role === r ? 'bg-brand-primary text-white cursor-default' : 'bg-surface-bg text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary border border-border-soft disabled:opacity-50'}`}>
                    <Icon size={11} /> {r}
                  </button>
                );
              })}
            </div>
          </div>

          <button disabled={busy} onClick={() => onToggle(user.id)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${user.is_active === false ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}
              disabled:opacity-50`}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : user.is_active === false ? <UserCheck size={15} /> : <UserX size={15} />}
            {user.is_active === false ? 'Reactivate Account' : 'Suspend Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────── */
export default function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');   // controlled input
  const [query, setQuery]     = useState('');   // submitted search
  const [role, setRole]       = useState('all');
  const [page, setPage]       = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState(false);
  const [menu, setMenu]       = useState(null);
  const [modal, setModal]     = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: perPage };
    if (query.trim())  params.search = query.trim();
    if (role !== 'all') params.role  = role;

    adminService.getAllUsers(params)
      .then(res => {
        const norm = res?.data !== undefined
          ? res
          : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 };
        setUsers(Array.isArray(norm.data) ? norm.data : []);
        setMeta({ current_page: norm.current_page ?? 1, last_page: norm.last_page ?? 1, total: norm.total ?? 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, perPage, query, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = () => { setQuery(search); setPage(1); };
  const handleRole   = (r) => { setRole(r); setPage(1); };
  const handlePage   = (p) => setPage(p);
  const handlePerPage = (n) => { setPerPage(n); setPage(1); };

  const doRoleChange = async (userId, newRole) => {
    setBusy(true);
    try {
      await adminService.updateUserRole(userId, newRole);
      const upd = u => u.id === userId ? { ...u, role: newRole } : u;
      setUsers(list => list.map(upd));
      setModal(m => m ? upd(m) : m);
    } catch (e) { console.error(e); }
    finally { setBusy(false); setMenu(null); }
  };

  const doToggle = async (userId) => {
    setBusy(true);
    try {
      await adminService.toggleUserStatus(userId);
      const upd = u => u.id === userId ? { ...u, is_active: u.is_active !== false ? false : true } : u;
      setUsers(list => list.map(upd));
      setModal(m => m ? upd(m) : m);
    } catch (e) { console.error(e); }
    finally { setBusy(false); setMenu(null); }
  };

  const openDetail = async (user) => {
    setModal(user);
    try { const full = await adminService.getUserById(user.id); setModal(full); } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-in" onClick={() => setMenu(null)}>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} registered users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search name or email… (Enter to search)"
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1 self-start">
          {['all','buyer','seller','admin'].map(r => (
            <button key={r} onClick={() => handleRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${role === r ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-bg border-b border-border-soft text-left">
                  {['User','Role','Joined','Status','Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide ${i === 2 ? 'hidden md:table-cell' : i === 3 ? 'hidden lg:table-cell' : ''} ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {[...Array(perPage)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-surface-bg animate-pulse" /><div className="space-y-1.5"><div className="h-3 w-32 bg-surface-bg rounded animate-pulse" /><div className="h-2.5 w-24 bg-surface-bg rounded animate-pulse" /></div></div></td>
                    <td className="px-6 py-4"><div className="h-5 w-16 bg-surface-bg rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-3 w-20 bg-surface-bg rounded animate-pulse" /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-5 w-14 bg-surface-bg rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-6 bg-surface-bg rounded-lg animate-pulse ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : users.length === 0 ? (
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
                    {['User','Role','Joined','Status','Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide ${i === 2 ? 'hidden md:table-cell' : i === 3 ? 'hidden lg:table-cell' : ''} ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {users.map(u => {
                    const RI = ROLE_ICON[u.role] || ShoppingBag;
                    const active = u.is_active !== false;
                    return (
                      <tr key={u.id} className="hover:bg-surface-bg/40 transition-colors">
                        <td className="px-6 py-4">
                          <button onClick={() => openDetail(u)} className="flex items-center gap-3 text-left group">
                            <Avatar name={u.name} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate max-w-[160px]">{u.name}</p>
                              <p className="text-xs text-text-muted truncate max-w-[160px]">{u.email}</p>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-600'}`}>
                            <RI size={10} /> {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-xs text-text-muted">{fmtDate(u.created_at)}</td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setMenu(menu === u.id ? null : u.id)}
                              className="p-2 rounded-xl hover:bg-surface-bg text-text-muted hover:text-text-primary transition-colors">
                              <MoreVertical size={15} />
                            </button>
                            {menu === u.id && (
                              <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-border-soft z-20 overflow-hidden">
                                <div className="p-2">
                                  <p className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Set Role</p>
                                  {['buyer','seller','admin'].map(r => {
                                    const Icon = ROLE_ICON[r];
                                    return (
                                      <button key={r} disabled={u.role === r || busy}
                                        onClick={() => doRoleChange(u.id, r)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl capitalize transition-colors ${u.role === r ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-text-primary hover:bg-surface-bg disabled:opacity-50'}`}>
                                        <Icon size={12} /> {r}
                                      </button>
                                    );
                                  })}
                                  <div className="my-1.5 border-t border-border-soft" />
                                  <button disabled={busy} onClick={() => doToggle(u.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors ${active ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}>
                                    {active ? <UserX size={12} /> : <UserCheck size={12} />}
                                    {active ? 'Suspend' : 'Reactivate'}
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

            <Pagination
              current={meta.current_page}
              last={meta.last_page}
              total={meta.total}
              perPage={perPage}
              onPage={handlePage}
              onPerPage={handlePerPage}
              label="users"
            />
          </>
        )}
      </div>

      {modal && (
        <UserModal user={modal} onClose={() => setModal(null)} onRoleChange={doRoleChange} onToggle={doToggle} busy={busy} />
      )}
    </div>
  );
}
