import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Newspaper, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { blogService } from '../../services';
import { useAuth } from '../../context/AuthContext';

export default function BlogManagement() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

    useEffect(() => {
        if (user?.id) {
            fetchBlogs();
        }
    }, [user]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await blogService.getBlogsBySeller(user.id);
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('sellerBlogs.deleteConfirm'))) {
            try {
                await blogService.deleteBlog(id);
                fetchBlogs();
            } catch (error) {
                alert(t('sellerBlogs.deleteFailed') || 'Failed to delete blog');
            }
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(i18n.language || 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{t('sellerBlogs.title')}</h2>
                    <p className="text-text-muted text-sm">{t('sellerBlogs.subtitle')}</p>
                </div>
                <Link
                    to="/seller/blogs/new"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    <Plus size={18} />
                    {t('sellerBlogs.createNew')}
                </Link>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-border-soft">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder={t('sellerBlogs.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface-bg border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 border border-border-soft rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:bg-surface-bg'}`}
                    >
                        <ListIcon size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:bg-surface-bg'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-3">
                    <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">{t('sellerBlogs.loading')}</p>
                </div>
            ) : filteredBlogs.length > 0 ? (
                viewMode === 'list' ? (
                    <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-surface-bg border-b border-border-soft">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t('sellerBlogs.table.details')}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t('sellerBlogs.table.category')}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{t('sellerBlogs.table.status')}</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t('sellerBlogs.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                                    {blog.image_url ? (
                                                        <img src={blog.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Newspaper size={20} className="text-brand-primary" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-text-primary line-clamp-1">{blog.title}</p>
                                                    <p className="text-xs text-text-muted">{t('sellerBlogs.table.publishedOn', { date: formatDate(blog.created_at) })}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-surface-bg border border-border-soft rounded-full text-xs font-medium text-text-primary">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                {t('sellerBlogs.status.published')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/seller/blogs/edit/${blog.id}`)}
                                                    className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                                                    title={t('sellerBlogs.edit')}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title={t('sellerBlogs.delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog) => (
                            <div key={blog.id} className="bg-white rounded-2xl border border-border-soft overflow-hidden group hover:border-brand-primary/30 transition-all shadow-sm">
                                <div className="aspect-video bg-surface-bg relative overflow-hidden">
                                    {blog.image_url ? (
                                        <img src={blog.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Newspaper size={40} className="text-brand-primary/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase rounded-md shadow-sm">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-text-primary line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">{blog.title}</h3>
                                    <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed">{blog.summary}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-border-soft">
                                        <div className="text-[10px] text-text-muted flex items-center gap-1">
                                            <Eye size={12} /> {t('sellerBlogs.views', { count: blog.views || 0 })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => navigate(`/seller/blogs/edit/${blog.id}`)}
                                                className="p-1.5 text-text-muted hover:text-brand-primary transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="bg-white rounded-2xl border border-border-soft p-12 text-center">
                    <div className="w-16 h-16 bg-surface-bg rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-muted">
                        <Newspaper size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('sellerBlogs.empty.title')}</h3>
                    <p className="text-text-muted text-sm max-w-sm mx-auto mb-6">
                        {searchQuery 
                            ? t('sellerBlogs.empty.searchNoMatch', { query: searchQuery }) 
                            : t('sellerBlogs.empty.subtitle')}
                    </p>
                    {searchQuery ? (
                        <button onClick={() => setSearchQuery('')} className="text-brand-primary font-semibold text-sm">{t('sellerBlogs.empty.clearSearch')}</button>
                    ) : (
                        <Link
                            to="/seller/blogs/new"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                        >
                            <Plus size={18} />
                            {t('sellerBlogs.empty.createFirst')}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
