import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, ChevronLeft, ChevronRight, RefreshCw, Store,
  Package, DollarSign, Star, ExternalLink, MoreVertical,
  UserX, UserCheck, X, Mail, Calendar, TrendingUp,
} from 'lucide-react';
import { adminService } from '../../services';

const AVATAR_COLORS = [
  'bg-teal-500','bg-blue-500','bg-purple-500','bg-amber-500','bg-pink-500','bg-indigo-500',
];

function SellerAvatar({ name }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

const STATUS_BADGE = {
  approved:  'bg-green-100 text-green-700',
  pending:   'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
};

function SellerDetailModal({ seller, onClose }) {
  if (!seller) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-bg/50">
          <h3 className="font-bold text-text-primary">Seller Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
              {(seller.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-text-primary text-lg">{seller.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                <Mail size={12} /> {seller.email}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block capitalize ${STATUS_BADGE[seller.status] || STATUS_BADGE.approved}`}>
                {seller.status || 'approved'}
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Products', value: seller.products ?? 0, icon: Package, color: 'text-purple-500' },
              { label: 'Revenue',  value: `$${Number(seller.revenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
              { label: 'Rating',   value: (seller.rating ?? 4.5).toFixed(1), icon: Star, color: 'text-amber-500' },
            ].map(m => (
              <div key={m.label} className="bg-surface-bg rounded-xl p-3 text-center">
                <m.icon size={14} className={`mx-auto mb-1 ${m.color}`} />
                <p className="text-sm font-bold text-text-primary">{m.value}</p>
                <p className="text-[10px] text-text-muted">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Joined */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Calendar size={12} />
            Joined {seller.joined ? new Date(seller.joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`/${seller.slug || seller.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
            >
              <ExternalLink size={14} /> View Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerManagement() {
  const [paged, setPaged] = useState({ data: [], current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [openMenu, setMenu] = useState(null);

  const fetchSellers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      const res = await adminService.getSellersList(params);
      setPaged(res.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchSellers(1); }, [fetchSellers]);

  const { data: sellers, current_page, last_page, total } = paged;

  return (
    <div className="animate-fade-in space-y-6" onClick={() => setMenu(null)}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Seller Management</h1>
          <p className="text-sm text-text-muted mt-0.5">{total.toLocaleString()} sellers on the platform</p>
        </div>
        <button onClick={() => fetchSellers(current_page)}
          className="p-2.5 bg-white border border-border-soft rounded-xl text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all self-start" title="Refresh">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Summary Cards */}
      {!loading && sellers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Sellers', value: total, icon: Store, color: 'bg-brand-primary/10 text-brand-primary' },
            { label: 'Total Products', value: sellers.reduce((s, r) => s + (r.products || 0), 0), icon: Package, color: 'bg-purple-50 text-purple-600' },
            { label: 'Total Revenue', value: `$${sellers.reduce((s, r) => s + Number(r.revenue || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
            { label: 'Avg Rating', value: (sellers.reduce((s, r) => s + Number(r.rating || 4.5), 0) / sellers.length).toFixed(1), icon: Star, color: 'bg-amber-50 text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white p-4 rounded-2xl border border-border-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted">{s.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={14} />
                </div>
              </div>
              <p className="text-xl font-bold text-text-primary">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search sellers by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchSellers(1)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-brand-primary" />
            <p className="text-sm text-text-muted">Loading sellers…</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-surface-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store size={24} className="text-text-muted/40" />
            </div>
            <p className="text-sm font-semibold text-text-primary">No sellers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-bg border-b border-border-soft text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Seller</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Products</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Revenue</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Rating</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Status</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {sellers.map(seller => (
                    <tr key={seller.id} className="hover:bg-surface-bg/50 transition-colors">
                      <td className="px-6 py-4">
                        <button onClick={() => setSelected(seller)} className="flex items-center gap-3 text-left group">
                          <SellerAvatar name={seller.name} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate max-w-[150px]">{seller.name}</p>
                            <p className="text-xs text-text-muted truncate max-w-[150px]">{seller.email}</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Package size={12} className="text-purple-500" />
                          <span className="text-sm font-semibold text-text-primary">{(seller.products ?? 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={12} className="text-green-600" />
                          <span className="text-sm font-semibold text-text-primary">
                            ${Number(seller.revenue ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-sm font-semibold text-text-primary">{(seller.rating ?? 4.5).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[seller.status] || STATUS_BADGE.approved}`}>
                          {seller.status || 'approved'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <a href={`/${seller.slug || seller.id}`} target="_blank" rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-brand-primary/10 text-text-muted hover:text-brand-primary transition-colors" title="View Store">
                            <ExternalLink size={15} />
                          </a>
                          <button onClick={() => setMenu(openMenu === seller.id ? null : seller.id)}
                            className="p-2 rounded-lg hover:bg-surface-bg text-text-muted hover:text-text-primary transition-colors">
                            <MoreVertical size={15} />
                          </button>
                          {openMenu === seller.id && (
                            <div className="absolute right-8 w-44 bg-white rounded-2xl shadow-xl border border-border-soft z-20 overflow-hidden mt-1">
                              <div className="p-2">
                                <button onClick={() => { setSelected(seller); setMenu(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-text-primary hover:bg-surface-bg transition-colors">
                                  <Store size={12} /> View Details
                                </button>
                                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                                  <UserX size={12} /> Suspend
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {last_page > 1 && (
              <div className="px-6 py-4 border-t border-border-soft flex items-center justify-between">
                <span className="text-xs text-text-muted">Page {current_page} of {last_page}</span>
                <div className="flex items-center gap-2">
                  <button disabled={current_page <= 1} onClick={() => fetchSellers(current_page - 1)}
                    className="p-2 rounded-xl border border-border-soft hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <button disabled={current_page >= last_page} onClick={() => fetchSellers(current_page + 1)}
                    className="p-2 rounded-xl border border-border-soft hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selected && <SellerDetailModal seller={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
