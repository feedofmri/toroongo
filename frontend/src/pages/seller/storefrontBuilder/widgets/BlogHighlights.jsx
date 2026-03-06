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
            title: `Blog Post Title ${i + 1}`,
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Short summary of the blog post goes here.',
            author: 'Author Name',
            readTime: '5 min read',
            category: 'Updates',
            color: 'bg-brand-primary',
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
                        style={{ color: 'var(--seller-brand, #06B6D4)' }}
                    >
                        View All <ArrowRight size={14} />
                    </a>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    >
                        <div className="h-2 w-full" style={{ backgroundColor: 'var(--seller-brand, #06B6D4)' }} />
                        <div className="p-5">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--seller-brand, #06B6D4)' }}>
                                {post.category}
                            </span>
                            <h3 className="text-base font-bold mt-2 mb-2 line-clamp-2" style={{ color: 'var(--seller-text, #0F172A)' }}>
                                {post.title}
                            </h3>
                            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                {post.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                <span>{post.author}</span>
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
