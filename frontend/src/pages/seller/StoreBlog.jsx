import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { blogService } from '../../services/blogService';

export default function StoreBlog() {
    const { t } = useTranslation();
    const { seller } = useOutletContext();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!seller?.id) return;
        blogService.getBlogsBySeller(seller.id)
            .then(data => setBlogs(data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [seller?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin text-text-muted" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-text-primary mb-3">
                    {t("storefront.blog.title", "Store Blog")}
                </h2>
                <p className="text-text-muted max-w-xl">
                    Stay updated with the latest news, product guides, and stories from {seller.store_name || seller.name}.
                </p>
            </div>

            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <article key={blog.id} className="group bg-white rounded-2xl border border-border-soft overflow-hidden hover:shadow-xl transition-all duration-300">
                            {blog.featured_image && (
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                        src={blog.featured_image} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> {seller.name}</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-text-muted mb-5 line-clamp-3 leading-relaxed">
                                    {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                                </p>
                                <Link 
                                    to={`/blog/${blog.slug}`} 
                                    className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                                    style={{ color: 'var(--seller-brand)' }}
                                >
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-bg rounded-3xl border border-border-soft border-dashed">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 shadow-sm">
                        <Newspaper size={32} className="text-text-muted/40" />
                    </div>
                    <p className="text-lg font-medium text-text-primary mb-1">No articles yet</p>
                    <p className="text-sm text-text-muted">Check back later for exciting updates and stories.</p>
                </div>
            )}
        </div>
    );
}
