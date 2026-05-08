import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  Store, Search, ExternalLink,
  Star, Package, DollarSign, MoreVertical, CheckCircle2,
  XCircle, Loader2, X, TrendingUp, ShoppingBag,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const BADGE = {
  active:    'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending:   'bg-amber-100 text-amber-700',
};

function Avatar({ name, size = 9 }) {
  const COLORS = [
    'bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-amber-500',
    'bg-green-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  ];
  const initials = (name || 'S').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = COLORS[(name?.charCodeAt(0) ?? 0) % COLORS.length];
  return (
    <div className={`w-${size} h-${size} rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ─── Seller Detail Modal ─────────────────────────────── */
function SellerModal({ seller, onClose, onToggleStatus }) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggleStatus(seller.id);
      onClose();
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div className="flex items-center gap-4">
            <Avatar name={seller.name} size={12} />
            <div>
              <h2 className="text-lg font-bold text-text-primary">{seller.name}</h2>
              <p className="text-sm text-text-muted">{seller.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-border-soft">
          {[
            { label: 'Products', value: seller.products ?? 0, Icon: Package, cls: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Revenue',  value: `$${Number(seller.revenue ?? 0).toLocaleString()}`, Icon: DollarSign, cls: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rating',   value: `${Number(seller.rating ?? 0).toFixed(1)} ★`, Icon: Star, cls: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <s.Icon size={16} className={`${s.cls} mx-auto mb-1`} />
              <p className="text-lg font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="p-6 space-y-3 border-b border-border-soft">
          <Row label="Status">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[seller.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {seller.status ?? 'unknown'}
            </span>
          </Row>
          <Row label="Joined">{seller.joined ?? '—'}</Row>
          {seller.shop_name && <Row label="Shop">{seller.shop_name}</Row>}
          {seller.phone && <Row label="Phone">{seller.phone}</Row>}
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-wrap items-center gap-3">
          {seller.shop_slug && (
            <a
              href={`${import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}/shop/${seller.shop_slug}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-soft text-sm font-medium text-text-primary hover:bg-surface-bg transition-colors"
            >
              <ExternalLink size={14} /> View Store
            </a>
          )}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
              seller.status === 'active'
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {toggling ? <Loader2 size={14} className="animate-spin" /> : seller.status === 'active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
            {seller.status === 'active' ? 'Suspend Seller' : 'Reactivate Seller'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-muted w-24 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">{children}</span>
    </div>
  );
}

/* ─── Action Dropdown ─────────────────────────────────── */
function ActionMenu({ seller, onView, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="p-1.5 rounded-lg hover:bg-surface-bg text-text-muted transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-border-soft z-20 overflow-hidden py-1">
            <button onClick={() => { setOpen(false); onView(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:bg-surface-bg transition-colors">
              <Store size={13} /> View Details
            </button>
            {seller.shop_slug && (
              <a
                href={`${import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}/shop/${seller.shop_slug}`}
                target="_blank" rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-primary hover:bg-surface-bg transition-colors"
              >
                <ExternalLink size={13} /> View Store
              </a>
            )}
            <div className="border-t border-border-soft my-1" />
            <button onClick={() => { setOpen(false); onToggle(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${seller.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-700 hover:bg-green-50'}`}>
              {seller.status === 'active' ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
              {seller.status === 'active' ? 'Suspend' : 'Reactivate'}
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
  const [status, setStatus]   = useState('all');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchSellers = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query)            params.search = query;
    if (status !== 'all') params.status = status;

    adminService.getSellersList(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 };
        setSellers(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, status]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const handleToggle = async (id) => {
    await adminService.toggleUserStatus(id);
    fetchSellers();
  };

  const STATUS_TABS = ['all', 'active', 'suspended', 'pending'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sellers</h1>
          <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} registered sellers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search sellers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1">
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${status === s ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-bg/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Products</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Revenue</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Rating</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-surface-bg rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Store size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No sellers found</p>
                  </td>
                </tr>
              ) : (
                sellers.map(seller => (
                  <tr key={seller.id}
                    onClick={() => setSelected(seller)}
                    className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={seller.name} />
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{seller.name}</p>
                          <p className="text-xs text-text-muted truncate">{seller.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <Package size={13} className="text-purple-500" />
                        {seller.products ?? 0}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-text-primary">
                        <DollarSign size={13} className="text-green-500" />
                        {Number(seller.revenue ?? 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-text-primary">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        {Number(seller.rating ?? 0).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{seller.joined ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${BADGE[seller.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {seller.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <ActionMenu
                        seller={seller}
                        onView={() => setSelected(seller)}
                        onToggle={() => handleToggle(seller.id)}
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

      {/* Modal */}
      {selected && (
        <SellerModal
          seller={selected}
          onClose={() => setSelected(null)}
          onToggleStatus={async (id) => { await handleToggle(id); setSelected(null); }}
        />
      )}
    </div>
  );
}
