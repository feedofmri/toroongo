import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  BookOpen, Search, X, Trash2, ExternalLink, Eye,
  Tag, Clock, User, Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

function ConfirmModal({ title, message, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6">
        <h3 className="text-base font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg transition-colors">
            Cancel
          </button>
          <button
            onClick={async () => { setLoading(true); try { await onConfirm(); } finally { setLoading(false); } }}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogModal({ blog, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Hero */}
          {blog.image_url ? (
            <div className="w-full h-44 overflow-hidden">
              <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-44 bg-surface-bg flex items-center justify-center" style={{ background: blog.color ?? undefined }}>
              <BookOpen size={36} className="text-white/40" />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary leading-snug">{blog.title}</h2>
                {blog.category && (
                  <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                    {blog.category}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><User size={11} /> {blog.author}</span>
              {blog.read_time && <span className="flex items-center gap-1"><Clock size={11} /> {blog.read_time} min read</span>}
              <span className="flex items-center gap-1"><Eye size={11} /> {(blog.views ?? 0).toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {blog.created_at}</span>
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-surface-bg text-text-muted px-2 py-0.5 rounded-full border border-border-soft">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {blog.summary && (
              <p className="text-sm text-text-primary leading-relaxed line-clamp-4 mb-4">{blog.summary}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border-soft">
              {blog.slug && (
                <a
                  href={`${import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}/blog/${blog.slug}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-soft text-sm font-medium text-text-primary hover:bg-surface-bg transition-colors"
                >
                  <ExternalLink size={14} /> View Post
                </a>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Blog Post"
          message={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
          onConfirm={async () => { await onDelete(blog.id); onClose(); }}
          onClose={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs]     = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query) params.search = query;

    adminService.getBlogs(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: 0 };
        setBlogs(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id) => {
    await adminService.deleteBlog(id);
    fetchBlogs();
    setConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Blog Posts</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total posts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-border-soft p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or author…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-bg/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Post</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Author</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Views</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-surface-bg rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <BookOpen size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No blog posts found</p>
                  </td>
                </tr>
              ) : blogs.map(blog => (
                <tr key={blog.id}
                  onClick={() => setSelected(blog)}
                  className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {blog.image_url ? (
                        <img src={blog.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border-soft" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center border border-border-soft"
                          style={{ background: blog.color ?? '#f3f4f6' }}>
                          <BookOpen size={14} className="text-white/60" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate max-w-[200px]">{blog.title}</p>
                        {blog.tags?.length > 0 && (
                          <p className="text-xs text-text-muted truncate">{blog.tags.slice(0, 3).map(t => `#${t}`).join(' ')}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-text-muted text-xs">{blog.author}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {blog.category && (
                      <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full capitalize">
                        {blog.category}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Eye size={12} /> {(blog.views ?? 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{blog.created_at}</td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setConfirmId(blog.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
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
          label="posts"
        />
      </div>

      {selected && (
        <BlogModal
          blog={selected}
          onClose={() => setSelected(null)}
          onDelete={async (id) => { await handleDelete(id); setSelected(null); }}
        />
      )}

      {confirmId && (
        <ConfirmModal
          title="Delete Blog Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onClose={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
