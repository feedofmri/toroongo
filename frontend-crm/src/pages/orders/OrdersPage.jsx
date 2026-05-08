import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  ShoppingBag, Search,
  Loader2, X, Eye, Package, DollarSign, User,
  Store, Calendar, Hash, MapPin, CreditCard, Receipt,
  Truck, Tag,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
  refunded:   'bg-gray-100 text-gray-600',
};

const STATUS_TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/* ─── Order Detail Modal ──────────────────────────────── */
function OrderModal({ order, onClose }) {
  const addr = order.shipping_address;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash size={14} className="text-text-muted" />
              <h2 className="text-lg font-bold text-text-primary">Order {order.id}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-text-muted flex items-center gap-1.5">
              <Calendar size={12} /> {order.created_at}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Totals Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-border-soft">
            {[
              { label: 'Subtotal',  value: `$${Number(order.subtotal ?? 0).toFixed(2)}`,       Icon: Receipt,   cls: 'text-blue-500',   bg: 'bg-blue-50' },
              { label: 'Shipping',  value: `$${Number(order.shipping_cost ?? 0).toFixed(2)}`,  Icon: Truck,     cls: 'text-indigo-500', bg: 'bg-indigo-50' },
              { label: 'Tax',       value: `$${Number(order.tax ?? 0).toFixed(2)}`,            Icon: Tag,       cls: 'text-amber-500',  bg: 'bg-amber-50' },
              { label: 'Total',     value: `$${Number(order.total ?? 0).toFixed(2)}`,          Icon: DollarSign,cls: 'text-green-600',  bg: 'bg-green-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <s.Icon size={14} className={`${s.cls} mx-auto mb-1`} />
                <p className="text-base font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Buyer + Seller + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b border-border-soft">
            {/* Buyer */}
            <div className="bg-surface-bg rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <User size={13} className="text-blue-500" />
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Customer</p>
              </div>
              <p className="text-sm font-semibold text-text-primary">{order.buyer_name}</p>
              {order.buyer_email && <p className="text-xs text-text-muted">{order.buyer_email}</p>}
            </div>

            {/* Seller(s) */}
            <div className="bg-surface-bg rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <Store size={13} className="text-teal-500" />
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {order.seller_names?.length > 1 ? 'Sellers' : 'Seller'}
                </p>
              </div>
              {order.seller_names?.length > 0 ? (
                order.seller_names.map((s, i) => (
                  <p key={i} className="text-sm font-semibold text-text-primary">{s}</p>
                ))
              ) : (
                <p className="text-sm text-text-muted">—</p>
              )}
            </div>

            {/* Payment */}
            <div className="bg-surface-bg rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={13} className="text-purple-500" />
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Payment</p>
              </div>
              <p className="text-sm font-semibold text-text-primary capitalize">{order.payment_method ?? '—'}</p>
              {order.payment_details?.transaction_id && (
                <p className="text-xs text-text-muted font-mono">TXN: {order.payment_details.transaction_id}</p>
              )}
              {order.payment_details?.account && (
                <p className="text-xs text-text-muted">{order.payment_details.account}</p>
              )}
            </div>

            {/* Shipping Address */}
            {addr && (
              <div className="bg-surface-bg rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={13} className="text-red-500" />
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Ship To</p>
                </div>
                <p className="text-sm font-semibold text-text-primary">{addr.first_name} {addr.last_name}</p>
                {addr.phone && <p className="text-xs text-text-muted">{addr.phone}</p>}
                <p className="text-xs text-text-muted leading-relaxed">
                  {[addr.address, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          {order.items?.length > 0 && (
            <div className="p-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-bg rounded-xl">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border-soft" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white border border-border-soft flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-text-muted/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                      {item.variant && <p className="text-xs text-text-muted">{item.variant}</p>}
                      {item.seller && <p className="text-xs text-brand-primary">{item.seller}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-text-primary">${Number(item.price ?? 0).toFixed(2)}</p>
                      <p className="text-xs text-text-muted">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [status, setStatus]   = useState('all');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError]     = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError('');
    const params = { page, per_page: 15 };
    if (query)            params.search = query;
    if (status !== 'all') params.status = status;

    adminService.getAllOrders(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 };
        setOrders(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(err => setError(err.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [page, query, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1 overflow-x-auto">
          {STATUS_TABS.map(s => (
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Seller(s)</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Items</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-surface-bg rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <ShoppingBag size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}
                    onClick={() => setSelected(order)}
                    className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-text-primary bg-surface-bg px-2 py-1 rounded-lg">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-text-primary text-sm">{order.buyer_name}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-text-muted text-xs max-w-[180px] truncate">
                      {order.seller_name || '—'}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs whitespace-nowrap">{order.created_at}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{order.items_count} items</td>
                    <td className="px-5 py-4 font-bold text-text-primary">${Number(order.total ?? 0).toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg hover:bg-surface-bg text-text-muted transition-colors">
                        <Eye size={15} />
                      </button>
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
          label="orders"
        />
      </div>

      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
