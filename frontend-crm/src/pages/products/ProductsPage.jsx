import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  Package, Search,
  Eye, Star, X, Image as ImageIcon, DollarSign,
  Store, Tag, BarChart2, AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  active:       'bg-green-100 text-green-700',
  out_of_stock: 'bg-amber-100 text-amber-700',
  draft:        'bg-gray-100 text-gray-600',
  inactive:     'bg-red-100 text-red-700',
};

/* ─── Product Detail Modal ────────────────────────────── */
function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Hero */}
        {product.image ? (
          <div className="w-full h-52 bg-surface-bg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-52 bg-surface-bg flex items-center justify-center">
            <ImageIcon size={44} className="text-text-muted/20" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{product.name}</h2>
            {product.category && (
              <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                {product.category}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-6 border-b border-border-soft">
          {[
            { label: 'Price',  value: `$${Number(product.price ?? 0).toFixed(2)}`, Icon: DollarSign, cls: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rating', value: `${Number(product.rating ?? 0).toFixed(1)} ★`, Icon: Star, cls: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Stock',  value: `${product.stock ?? 0} units`, Icon: BarChart2, cls: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <s.Icon size={15} className={`${s.cls} mx-auto mb-1`} />
              <p className="text-sm font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="p-6 space-y-3 border-b border-border-soft">
          <Row label="Status">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[product.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {product.status ?? '—'}
            </span>
          </Row>
          {product.seller_name && <Row label="Seller"><span className="flex items-center gap-1.5"><Store size={12} className="text-teal-500" />{product.seller_name}</span></Row>}
          {product.sku && <Row label="SKU"><span className="font-mono text-xs">{product.sku}</span></Row>}
          {product.created_at && <Row label="Listed">{product.created_at}</Row>}
        </div>

        {product.description && (
          <div className="p-6">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-text-primary leading-relaxed line-clamp-6">{product.description}</p>
          </div>
        )}
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

/* ─── Main Page ───────────────────────────────────────── */
export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta]           = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]       = useState('');
  const [query, setQuery]         = useState('');
  const [category, setCategory]   = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    adminService.getCategories()
      .then(res => setCategories(Array.isArray(res) ? res : (res?.data ?? [])))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query)    params.search = query;
    if (category) params.category = category;

    adminService.getAllProducts(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: Array.isArray(res) ? res.length : 0 };
        setProducts(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total products</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search products or sellers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary outline-none transition-all min-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug ?? c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-bg/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Stock</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Rating</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Package size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}
                    onClick={() => setSelected(product)}
                    className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border-soft"
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 rounded-lg bg-surface-bg border border-border-soft items-center justify-center flex-shrink-0 ${product.image ? 'hidden' : 'flex'}`}>
                          <Package size={14} className="text-text-muted/40" />
                        </div>
                        <p className="font-semibold text-text-primary truncate max-w-[200px]">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {product.category && (
                        <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full capitalize">
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-text-muted text-xs">{product.seller_name ?? '—'}</td>
                    <td className="px-5 py-4 font-semibold text-text-primary">${Number(product.price ?? 0).toFixed(2)}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{product.stock ?? '—'}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-text-primary">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        {Number(product.rating ?? 0).toFixed(1)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[product.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {(product.status ?? '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelected(product)} className="p-1.5 rounded-lg hover:bg-surface-bg text-text-muted transition-colors">
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
          label="products"
        />
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
