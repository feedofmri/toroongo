import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  Star, Search, X, CheckCircle2, XCircle, Trash2,
  Package, User, Image as ImageIcon, MessageSquare,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUSES = ['all', 'pending', 'approved', 'rejected'];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  );
}

function ReviewModal({ review, onClose, onApprove, onReject, onDelete }) {
  const [loading, setLoading] = useState('');

  const act = async (action) => {
    setLoading(action);
    try { await action(); onClose(); }
    finally { setLoading(''); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-text-primary">Review</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[review.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {review.status}
              </span>
            </div>
            <p className="text-xs text-text-muted">{review.created_at}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Product + User */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-border-soft">
          <div className="bg-surface-bg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={13} className="text-purple-500" />
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Product</p>
            </div>
            {review.product_image && (
              <img src={review.product_image} alt="" className="w-12 h-12 rounded-lg object-cover mb-2 border border-border-soft" />
            )}
            <p className="text-sm font-semibold text-text-primary">{review.product_name}</p>
          </div>
          <div className="bg-surface-bg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={13} className="text-blue-500" />
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Reviewer</p>
            </div>
            <p className="text-sm font-semibold text-text-primary">{review.user_name}</p>
            <p className="text-xs text-text-muted">{review.user_email}</p>
          </div>
        </div>

        {/* Rating + Comment */}
        <div className="p-6 border-b border-border-soft space-y-3">
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <span className="text-sm font-bold text-text-primary">{review.rating}/5</span>
          </div>
          {review.comment && (
            <p className="text-sm text-text-primary leading-relaxed bg-surface-bg rounded-xl p-4">{review.comment}</p>
          )}
          {review.media?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.media.map((url, i) => (
                <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-border-soft" />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-wrap gap-3">
          {review.status !== 'approved' && (
            <button
              onClick={() => act(onApprove)}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium transition-colors disabled:opacity-60"
            >
              <CheckCircle2 size={14} /> Approve
            </button>
          )}
          {review.status !== 'rejected' && (
            <button
              onClick={() => act(onReject)}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium transition-colors disabled:opacity-60"
            >
              <XCircle size={14} /> Reject
            </button>
          )}
          <button
            onClick={() => act(onDelete)}
            disabled={!!loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [status, setStatus]   = useState('all');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query)            params.search = query;
    if (status !== 'all') params.status = status;

    adminService.getReviews(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: 0 };
        setReviews(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, status]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => {
    adminService.markAllAsRead('reviews').catch(() => {});
  }, []);

  const handleApprove = async (id) => {
    await adminService.updateReview(id, { status: 'approved' });
    fetchReviews();
  };
  const handleReject = async (id) => {
    await adminService.updateReview(id, { status: 'rejected' });
    fetchReviews();
  };
  const handleDelete = async (id) => {
    await adminService.deleteReview(id);
    fetchReviews();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reviews</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product, reviewer, or comment…"
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Reviewer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Rating</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Comment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
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
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <MessageSquare size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No reviews found</p>
                  </td>
                </tr>
              ) : reviews.map(review => (
                <tr key={review.id}
                  onClick={() => setSelected(review)}
                  className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {review.product_image ? (
                        <img src={review.product_image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-border-soft" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-surface-bg border border-border-soft flex items-center justify-center flex-shrink-0">
                          <Package size={13} className="text-text-muted/40" />
                        </div>
                      )}
                      <p className="font-semibold text-text-primary truncate max-w-[160px]">{review.product_name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-sm text-text-primary">{review.user_name}</p>
                    <p className="text-xs text-text-muted">{review.user_email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={review.rating} />
                      <span className="text-xs font-bold text-text-primary">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-text-muted text-xs max-w-[220px]">
                    <p className="truncate">{review.comment ?? '—'}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{review.created_at}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[review.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApprove(review.id)}
                        title="Approve"
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        title="Reject"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
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
          label="reviews"
        />
      </div>

      {selected && (
        <ReviewModal
          review={selected}
          onClose={() => setSelected(null)}
          onApprove={() => handleApprove(selected.id)}
          onReject={() => handleReject(selected.id)}
          onDelete={() => handleDelete(selected.id)}
        />
      )}
    </div>
  );
}
