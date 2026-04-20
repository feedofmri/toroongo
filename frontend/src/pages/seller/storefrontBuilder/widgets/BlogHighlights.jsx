import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * BlogHighlights Widget
 * Grid showing the latest blog posts (placeholder in builder, real data in storefront).
 */
export default function BlogHighlights({ title, maxPosts = 3, posts = [] }) {
    // Placeholder posts if none provided
    const placeholders = posts.length === 0
        ? Array.from({ length: maxPosts }, (_, i) => ({
            id: `blog_placeholder_${i}`,
            title: `Essential Tips for Your Journey ${i + 1}`,
            summary: 'Discover the best practices and essential tips to make the most out of your upcoming journey with our comprehensive guide.',
            author: 'Store Admin',
            readTime: '5 min read',
            category: 'News',
            imageUrl: `https://placehold.co/600x400/f8fafc/94a3b8?text=Blog+Image+${i + 1}`,
        }))
        : [];

    const items = posts.length > 0 ? posts.slice(0, maxPosts) : placeholders;

    return (
        <div>
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {title}
                    </h2>
                    <a
                        href="/blog"
                        className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80"
                        style={{ color: 'var(--seller-brand, #008080)' }}
                    >
                        View All <ArrowRight size={14} />
                    </a>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((post) => (
                    <div
                        key={post.id}
                        className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
                        style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                    >
                        <div className="relative aspect-video overflow-hidden bg-gray-50 border-b border-gray-100">
                            <img
                                src={post.imageUrl || `https://placehold.co/600x400/f8fafc/94a3b8?text=Image+Not+Found`}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--seller-brand, #008080)' }}>
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:opacity-80 transition-opacity" style={{ color: 'var(--seller-text, #0F172A)' }}>
                                {post.title}
                            </h3>
                            <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                {post.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-gray-50" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                <span className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                                    {post.author}
                                </span>
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
