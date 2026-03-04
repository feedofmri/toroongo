import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const POSTS = [
    {
        id: 1, category: 'Seller Tips',
        title: '10 Ways to Boost Your Storefront Sales in 2026',
        excerpt: 'Learn proven strategies to increase traffic to your Toroongo store, improve conversion rates, and grow your revenue.',
        author: 'Sarah Mitchell', date: 'Mar 2, 2026', readTime: '6 min read',
        color: 'bg-purple-500',
    },
    {
        id: 2, category: 'Platform Updates',
        title: 'Introducing Custom Storefronts: Your Brand, Your Way',
        excerpt: 'Sellers can now fully customize their store appearance with brand colors, banners, logos, and dedicated pages.',
        author: 'Toroongo Team', date: 'Feb 20, 2026', readTime: '4 min read',
        color: 'bg-brand-primary',
    },
    {
        id: 3, category: 'Buyer Guides',
        title: 'How to Shop Smart on Toroongo: A Complete Guide',
        excerpt: 'From finding deals to tracking orders, here is everything you need to know to get the most out of Toroongo.',
        author: 'James Kim', date: 'Feb 12, 2026', readTime: '5 min read',
        color: 'bg-green-500',
    },
    {
        id: 4, category: 'Industry News',
        title: 'The Future of Multi-Vendor E-Commerce',
        excerpt: 'Marketplaces are evolving. Discover how hybrid platforms like Toroongo are changing the way people buy and sell online.',
        author: 'Emily Rodriguez', date: 'Jan 30, 2026', readTime: '7 min read',
        color: 'bg-amber-500',
    },
    {
        id: 5, category: 'Seller Tips',
        title: 'Product Photography Tips That Actually Work',
        excerpt: 'Great photos sell products. Learn how to take professional-quality product images with just your smartphone.',
        author: 'Anna Lee', date: 'Jan 18, 2026', readTime: '5 min read',
        color: 'bg-purple-500',
    },
    {
        id: 6, category: 'Platform Updates',
        title: 'New Analytics Dashboard for Sellers',
        excerpt: 'Track your sales, revenue trends, and customer insights with our brand new seller analytics experience.',
        author: 'Toroongo Team', date: 'Jan 5, 2026', readTime: '3 min read',
        color: 'bg-brand-primary',
    },
];

export default function BlogPage() {
    return (
        <div className="animate-fade-in">
            <div className="bg-surface-bg border-b border-border-soft py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Toroongo Blog</h1>
                    <p className="text-text-muted">Tips, updates, and insights for buyers and sellers.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured post */}
                <div className="p-8 bg-white border border-border-soft rounded-2xl mb-8">
                    <span className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-md ${POSTS[0].color}`}>{POSTS[0].category}</span>
                    <h2 className="text-2xl font-bold text-text-primary mt-3 mb-2">{POSTS[0].title}</h2>
                    <p className="text-text-muted leading-relaxed mb-4">{POSTS[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="font-medium text-text-primary">{POSTS[0].author}</span> &middot; {POSTS[0].date} &middot; <Clock size={11} /> {POSTS[0].readTime}
                        </div>
                        <button className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-secondary">
                            Read <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {POSTS.slice(1).map((post) => (
                        <div key={post.id} className="p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group">
                            <span className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-md ${post.color}`}>{post.category}</span>
                            <h3 className="font-semibold text-text-primary mt-3 mb-1.5 group-hover:text-brand-primary transition-colors leading-snug">{post.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                <span className="font-medium text-text-primary">{post.author}</span> &middot; {post.date} &middot; <Clock size={10} /> {post.readTime}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
