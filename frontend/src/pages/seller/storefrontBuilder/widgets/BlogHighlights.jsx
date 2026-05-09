import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '../../../../services/api.js';

export default function BlogHighlights({
    title,
    maxPosts = 3,
    posts: staticPosts = [],
    layout = 'grid',
    showAuthor = true,
    showCategory = true,
    sellerId,
}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (!sellerId) return;
        setLoading(true);
        setFetchError(false);
        api(`/blogs/seller/${sellerId}`)
            .then((data) => {
                const normalized = (Array.isArray(data) ? data : []).map((b) => ({
                    id: b.id,
                    title: b.title,
                    summary: b.summary || '',
                    author: b.author || 'Store',
                    readTime: b.read_time || '3 min read',
                    category: b.category || 'General',
                    imageUrl: b.image_url || `https://placehold.co/600x400/f8fafc/94a3b8?text=${encodeURIComponent(b.title || 'Post')}`,
                    slug: b.slug,
                }));
                setPosts(normalized);
            })
            .catch((err) => {
                console.error('[BlogHighlights] Failed to fetch posts:', err);
                setFetchError(true);
            })
            .finally(() => setLoading(false));
    }, [sellerId]);

    // In the builder (no sellerId), show placeholder previews.
    // On the live shop, never show fake content — show real posts or empty state.
    const isLive = !!sellerId;

    const builderPlaceholders = !isLive
        ? Array.from({ length: Math.max(maxPosts, 2) }, (_, i) => ({
              id: `blog_${i}`,
              title: `Top Tips for Smart Shopping — Part ${i + 1}`,
              summary: 'Discover the best practices and essential tips to make the most of every purchase.',
              author: 'Store Admin',
              readTime: '5 min read',
              category: 'Tips',
              imageUrl: `https://placehold.co/600x400/f8fafc/94a3b8?text=Post+${i + 1}`,
          }))
        : [];

    const items = (posts.length > 0 ? posts : builderPlaceholders).slice(0, maxPosts);

    if (loading) {
        return (
            <div>
                {title && <div className="h-7 bg-gray-100 rounded w-48 mb-6 animate-pulse" />}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: maxPosts }).map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-video bg-gray-200" />
                            <div className="p-5 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-full" />
                                <div className="h-3 bg-gray-100 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isLive && fetchError) {
        return (
            <div className="text-center py-10 text-sm text-gray-400">
                {title && <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--seller-text, #0F172A)' }}>{title}</h2>}
                Could not load blog posts right now.
            </div>
        );
    }

    if (isLive && posts.length === 0) {
        return (
            <div className="text-center py-10 text-sm text-gray-400">
                {title && <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--seller-text, #0F172A)' }}>{title}</h2>}
                No blog posts yet.
            </div>
        );
    }

    const TitleBlock = title ? (
        <div className="flex items-center justify-between mb-6">
            <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
            >
                {title}
            </h2>
            <a
                href="/blog"
                className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-75 transition-opacity"
                style={{ color: 'var(--seller-brand, #008080)' }}
            >
                View All <ArrowRight size={14} />
            </a>
        </div>
    ) : null;

    // ── List layout ────────────────────────────────────────────────────────
    if (layout === 'list') {
        return (
            <div>
                {TitleBlock}
                <div className="space-y-4">
                    {items.map((post) => (
                        <a
                            key={post.id}
                            href={post.slug ? `/blog/${post.slug}` : '#'}
                            className="flex gap-4 bg-white border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                            style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                        >
                            <div className="w-36 sm:w-48 shrink-0">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="py-4 pr-4 flex flex-col justify-center">
                                {showCategory && (
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-widest mb-1"
                                        style={{ color: 'var(--seller-brand, #008080)' }}
                                    >
                                        {post.category}
                                    </span>
                                )}
                                <h3
                                    className="text-base font-bold line-clamp-2 leading-snug mb-1.5"
                                    style={{ color: 'var(--seller-text, #0F172A)' }}
                                >
                                    {post.title}
                                </h3>
                                <p className="text-xs line-clamp-2 text-gray-500">{post.summary}</p>
                                {showAuthor && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                                        <div className="w-4 h-4 rounded-full bg-gray-200" />
                                        {post.author} · {post.readTime}
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // ── Featured layout: 1 large + smaller cards ───────────────────────────
    if (layout === 'featured' && items.length >= 2) {
        const [featured, ...rest] = items;
        return (
            <div>
                {TitleBlock}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <a
                        href={featured.slug ? `/blog/${featured.slug}` : '#'}
                        className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                        style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={featured.imageUrl}
                                alt={featured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {showCategory && (
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider"
                                        style={{ color: 'var(--seller-brand, #008080)' }}
                                    >
                                        {featured.category}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3
                                className="text-xl font-bold line-clamp-2 mb-2 leading-snug"
                                style={{ color: 'var(--seller-text, #0F172A)' }}
                            >
                                {featured.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{featured.summary}</p>
                            {showAuthor && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                                    {featured.author} · {featured.readTime}
                                </div>
                            )}
                        </div>
                    </a>

                    <div className="space-y-4">
                        {rest.slice(0, 3).map((post) => (
                            <a
                                key={post.id}
                                href={post.slug ? `/blog/${post.slug}` : '#'}
                                className="flex gap-4 bg-white border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                            >
                                <div className="w-28 shrink-0">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="py-3 pr-3 flex flex-col justify-center">
                                    {showCategory && (
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                                            style={{ color: 'var(--seller-brand, #008080)' }}
                                        >
                                            {post.category}
                                        </span>
                                    )}
                                    <h3
                                        className="text-sm font-bold line-clamp-2 leading-snug"
                                        style={{ color: 'var(--seller-text, #0F172A)' }}
                                    >
                                        {post.title}
                                    </h3>
                                    {showAuthor && (
                                        <span className="text-xs text-gray-400 mt-1">{post.readTime}</span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Grid layout (default) ──────────────────────────────────────────────
    return (
        <div>
            {TitleBlock}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((post) => (
                    <a
                        key={post.id}
                        href={post.slug ? `/blog/${post.slug}` : '#'}
                        className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                        style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                    >
                        <div className="relative aspect-video overflow-hidden bg-gray-50">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {showCategory && (
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider"
                                        style={{ color: 'var(--seller-brand, #008080)' }}
                                    >
                                        {post.category}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <h3
                                className="text-base font-bold mb-2 line-clamp-2 leading-snug group-hover:opacity-80 transition-opacity"
                                style={{ color: 'var(--seller-text, #0F172A)' }}
                            >
                                {post.title}
                            </h3>
                            <p className="text-sm line-clamp-2 mb-4 text-gray-500">{post.summary}</p>
                            {showAuthor && (
                                <div
                                    className="flex items-center justify-between text-xs pt-4 border-t border-gray-50"
                                    style={{ color: 'var(--seller-text-muted, #64748B)' }}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                                        {post.author}
                                    </span>
                                    <span>{post.readTime}</span>
                                </div>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
