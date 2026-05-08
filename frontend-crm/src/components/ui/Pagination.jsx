import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Shared pagination bar used on every list page.
 *
 * Props
 *   current   – current page number (1-based)
 *   last      – total number of pages
 *   total     – total item count
 *   perPage   – items per page
 *   onPage    – (page: number) => void
 *   onPerPage – (perPage: number) => void   (optional; hides selector when omitted)
 *   label     – noun used in the count string, e.g. "users" (default "items")
 */
export default function Pagination({ current, last, total, perPage, onPage, onPerPage, label = 'items' }) {
  if (!total) return null;

  const start = (current - 1) * perPage + 1;
  const end   = Math.min(current * perPage, total);

  // Build a window of up to 5 page numbers centred on `current`
  const windowSize  = Math.min(5, last);
  const windowStart = Math.max(1, Math.min(current - Math.floor(windowSize / 2), last - windowSize + 1));
  const pages       = Array.from({ length: windowSize }, (_, i) => windowStart + i);

  const btn = (onClick, disabled, children, extra = '') => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center h-8 rounded-lg text-xs font-semibold transition-all
        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-bg ${extra}`}
    >
      {children}
    </button>
  );

  return (
    <div className="px-5 py-3.5 border-t border-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">

      {/* Left: count + per-page */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted whitespace-nowrap">
          {start}–{end} of <span className="font-semibold text-text-primary">{total.toLocaleString()}</span> {label}
        </span>
        {onPerPage && (
          <select
            value={perPage}
            onChange={e => onPerPage(Number(e.target.value))}
            className="text-xs border border-border-soft rounded-lg px-2 py-1.5 bg-surface-bg text-text-muted focus:border-brand-primary outline-none cursor-pointer"
          >
            {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        )}
      </div>

      {/* Right: page controls */}
      <div className="flex items-center gap-0.5">
        {/* First */}
        {btn(() => onPage(1), current === 1, '«', 'px-2.5 text-text-muted')}
        {/* Prev */}
        {btn(() => onPage(current - 1), current === 1,
          <ChevronLeft size={15} className="text-text-muted" />, 'w-8')}

        {/* Leading ellipsis */}
        {windowStart > 1 && (
          <span className="w-8 h-8 flex items-center justify-center text-xs text-text-muted select-none">…</span>
        )}

        {/* Page numbers */}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              current === p
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-text-muted hover:bg-surface-bg'
            }`}
          >
            {p}
          </button>
        ))}

        {/* Trailing ellipsis */}
        {windowStart + windowSize - 1 < last && (
          <span className="w-8 h-8 flex items-center justify-center text-xs text-text-muted select-none">…</span>
        )}

        {/* Next */}
        {btn(() => onPage(current + 1), current === last,
          <ChevronRight size={15} className="text-text-muted" />, 'w-8')}
        {/* Last */}
        {btn(() => onPage(last), current === last, '»', 'px-2.5 text-text-muted')}
      </div>
    </div>
  );
}
