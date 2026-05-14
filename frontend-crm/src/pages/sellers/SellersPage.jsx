import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  Store, Search, ExternalLink,
  MoreVertical, XCircle, CheckCircle2,
  BadgeCheck, Loader2, Star, Users
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { fmtAdminPrice } from '../../utils/currency';

const STATUS_COLORS = {
  active:    'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending:   'bg-amber-100 text-amber-700',
};

/* ─── Seller Detail Modal ────────────────────────────── */
function SellerModal({ seller, onClose, onToggleStatus, onVerify }) {
  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    setBusy(true);
    try { await onToggleStatus(seller.id); }
    finally { setBusy(false); }
  };

  const handleVerify = async () => {
    setBusy(true);
    try { await onVerify(seller.id); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
              {seller.name?.[0] || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-text-primary">{seller.name}</h2>
                {seller.is_verified && <BadgeCheck size={18} className="text-brand-primary" />}
              </div>
              <p className="text-sm text-text-muted">{seller.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors flex-shrink-0">
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Products', value: seller.product_count ?? 0, icon: Store },
              { label: 'Rating',   value: `${Number(seller.rating ?? 0).toFixed(1)} ★`, icon: Star },
              { label: 'Revenue',  value: fmtAdminPrice(seller.total_revenue || 0), icon: ExternalLink },
            ].map(s => (
              <div key={s.label} className="bg-surface-bg rounded-2xl p-4 text-center border border-border-soft/50">
                <p className="text-lg font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <Row label="Shop Slug">{seller.shop_slug || '—'}</Row>
            <Row label="Joined Date">{seller.created_at || '—'}</Row>
            <Row label="Status">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_COLORS[seller.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {seller.status || 'unknown'}
              </span>
            </Row>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border-soft">
            <button
              onClick={handleToggle}
              disabled={busy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${seller.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : seller.status === 'active' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
              {seller.status === 'active' ? 'Suspend Seller' : 'Reactivate Seller'}
            </button>

            <button
              onClick={handleVerify}
              disabled={busy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border
                ${seller.is_verified ? 'bg-gray-50 text-gray-600 border-border-soft' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'}`}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
              {seller.is_verified ? 'Remove Verification' : 'Verify Seller'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{children}</span>
    </div>
  );
}

/* ─── Action Menu ────────────────────────────────────── */
function ActionMenu({ seller, onView, onToggle, onRefresh }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="p-2 rounded-xl hover:bg-surface-bg text-text-muted hover:text-text-primary transition-all"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-border-soft z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-150">
            <button onClick={() => { setOpen(false); onView(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:bg-surface-bg transition-colors">
              <Store size={14} className="text-text-muted" /> View Details
            </button>
            {seller.shop_slug && (
              <a
                href={`${import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}/shop/${seller.shop_slug}`}
                target="_blank" rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:bg-surface-bg transition-colors"
              >
                <ExternalLink size={14} className="text-text-muted" /> View Store
              </a>
            )}
            <div className="border-t border-border-soft my-1" />
            <button onClick={() => { setOpen(false); onToggle(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${seller.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}>
              {seller.status === 'active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
              {seller.status === 'active' ? 'Suspend' : 'Reactivate'}
            </button>
            <button onClick={() => { setOpen(false); adminService.verifySeller(seller.id).then(onRefresh); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${seller.is_verified ? 'text-gray-600 hover:bg-gray-50' : 'text-brand-primary hover:bg-brand-primary/5'}`}>
              <BadgeCheck size={14} />
              {seller.is_verified ? 'Remove Verification' : 'Verify Shop'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [filter, setFilter]   = useState('all');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchSellers = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query) params.search = query;
    if (filter !== 'all') params.status = filter;

    adminService.getSellersList(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 };
        setSellers(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, filter]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const handleToggle = async (id) => {
    await adminService.toggleUserStatus(id);
    fetchSellers();
    if (selected?.id === id) {
      const full = await adminService.getUserById(id);
      setSelected(prev => ({ ...prev, ...full }));
    }
  };

  const handleVerify = async (id) => {
    await adminService.verifySeller(id);
    fetchSellers();
    if (selected?.id === id) {
      const full = await adminService.getUserById(id);
      setSelected(prev => ({ ...prev, ...full }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sellers</h1>
          <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} registered sellers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search shops or emails…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1">
          {['all', 'active', 'suspended', 'pending'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto min-h-[450px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-bg/50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Products</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Revenue</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden lg:table-cell">Rating</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider hidden xl:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-surface-bg rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <Store size={40} className="text-text-muted/20 mx-auto mb-4" />
                    <p className="text-text-muted font-medium">No sellers found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                sellers.map(seller => (
                  <tr key={seller.id}
                    onClick={() => setSelected(seller)}
                    className="hover:bg-surface-bg/50 cursor-pointer transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs flex-shrink-0">
                          {seller.name?.[0] || 'S'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-text-primary truncate group-hover:text-brand-primary transition-colors">{seller.name}</p>
                            {seller.is_verified && <BadgeCheck size={14} className="text-brand-primary flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-muted truncate">{seller.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-text-primary font-medium">
                        <Store size={12} className="text-brand-primary" /> {seller.product_count ?? 0}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-text-primary font-semibold">{fmtAdminPrice(seller.total_revenue || 0)}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-text-primary font-medium">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        {Number(seller.rating ?? 0).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell text-text-muted text-xs">{seller.created_at || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_COLORS[seller.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        seller={seller}
                        onView={() => setSelected(seller)}
                        onToggle={() => handleToggle(seller.id)}
                        onRefresh={fetchSellers}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          current={meta.current_page}
          last={meta.last_page}
          total={meta.total}
          perPage={15}
          onPage={p => setPage(p)}
          label="sellers"
        />
      </div>

      {selected && (
        <SellerModal
          seller={selected}
          onClose={() => setSelected(null)}
          onToggleStatus={handleToggle}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
}
