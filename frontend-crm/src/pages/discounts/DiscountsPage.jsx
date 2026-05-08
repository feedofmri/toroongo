import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  Tag, Search, X, Percent, DollarSign,
  Store, Calendar, BarChart2, AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  expired:  'bg-red-100 text-red-700',
};

const STATUSES = ['all', 'active', 'inactive', 'expired'];

function DiscountModal({ discount, onClose }) {
  const isPercent = discount.type === 'percentage';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-text-primary">{discount.code}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[discount.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {discount.status}
              </span>
            </div>
            <p className="text-sm text-text-muted">{discount.seller_name} · {discount.seller_email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-6 border-b border-border-soft">
          {[
            {
              label: 'Discount',
              value: isPercent ? `${discount.value}%` : `$${Number(discount.value ?? 0).toFixed(2)}`,
              Icon: isPercent ? Percent : DollarSign,
              cls: 'text-brand-primary',
              bg: 'bg-brand-primary/10',
            },
            {
              label: 'Usage',
              value: discount.usage_limit
                ? `${discount.usage_count} / ${discount.usage_limit}`
                : `${discount.usage_count} uses`,
              Icon: BarChart2,
              cls: 'text-purple-600',
              bg: 'bg-purple-50',
            },
            {
              label: 'Min Order',
              value: discount.min_order_value ? `$${Number(discount.min_order_value).toFixed(2)}` : 'None',
              Icon: DollarSign,
              cls: 'text-green-600',
              bg: 'bg-green-50',
            },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <s.Icon size={15} className={`${s.cls} mx-auto mb-1`} />
              <p className="text-sm font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          <Row label="Seller">
            <span className="flex items-center gap-1.5"><Store size={12} className="text-teal-500" />{discount.seller_name}</span>
          </Row>
          <Row label="Type"><span className="capitalize">{discount.type}</span></Row>
          {discount.expires_at && (
            <Row label="Expires">
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-red-400" />{discount.expires_at}</span>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-muted w-20 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">{children}</span>
    </div>
  );
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [meta, setMeta]           = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]       = useState('');
  const [query, setQuery]         = useState('');
  const [status, setStatus]       = useState('all');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  const fetchDiscounts = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query)            params.search = query;
    if (status !== 'all') params.status = status;

    adminService.getDiscounts(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: 0 };
        setDiscounts(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, status]);

  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Discounts</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total discount codes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by code or seller…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${status === s ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Code</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Value</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Usage</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Min Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Expires</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-surface-bg rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Tag size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No discount codes found</p>
                  </td>
                </tr>
              ) : discounts.map(d => (
                <tr key={d.id}
                  onClick={() => setSelected(d)}
                  className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-bold text-text-primary bg-surface-bg px-2.5 py-1 rounded-lg">
                      {d.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-text-muted text-xs">
                      <Store size={12} className="text-teal-500 flex-shrink-0" />
                      {d.seller_name}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">
                    {d.type === 'percentage'
                      ? <span className="flex items-center gap-1"><Percent size={12} className="text-brand-primary" />{d.value}%</span>
                      : <span className="flex items-center gap-1"><DollarSign size={12} className="text-green-600" />${Number(d.value ?? 0).toFixed(2)}</span>
                    }
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-text-muted text-xs">
                    {d.usage_limit ? `${d.usage_count} / ${d.usage_limit}` : `${d.usage_count} uses`}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">
                    {d.min_order_value ? `$${Number(d.min_order_value).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{d.expires_at ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {d.status ?? 'active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          current={meta.current_page}
          last={meta.last_page}
          total={meta.total}
          perPage={15}
          onPage={p => setPage(p)}
          label="discounts"
        />
      </div>

      {selected && <DiscountModal discount={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
