import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { blogService } from '../../services';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        blogService.getAllBlogs()
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-surface-bg border-b border-border-soft py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Toroongo Blog</h1>
                    <p className="text-text-muted">Tips, updates, and insights for buyers and sellers.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20 text-text-muted">Loading articles...</div>
                ) : posts.length > 0 ? (
                    <>
                        {/* Featured post */}
                        <div className="p-8 bg-white border border-border-soft rounded-2xl mb-8">
                            <span className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-md ${posts[0].color}`}>{posts[0].category}</span>
                            <h2 className="text-2xl font-bold text-text-primary mt-3 mb-2">{posts[0].title}</h2>
                            <p className="text-text-muted leading-relaxed mb-4">{posts[0].summary}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <span className="font-medium text-text-primary">{posts[0].author}</span> &middot; {formatDate(posts[0].createdAt)} &middot; <Clock size={11} /> {posts[0].readTime}
                                </div>
                                <button className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:text-brand-secondary">
                                    Read <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {posts.slice(1).map((post) => (
                                <div key={post.id} className="p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group">
                                    <span className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-md ${post.color}`}>{post.category}</span>
                                    <h3 className="font-semibold text-text-primary mt-3 mb-1.5 group-hover:text-brand-primary transition-colors leading-snug">{post.title}</h3>
                                    <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-3">{post.summary}</p>
                                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                        <span className="font-medium text-text-primary">{post.author}</span> &middot; {formatDate(post.createdAt)} &middot; <Clock size={10} /> {post.readTime}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-text-muted">No posts available at this time.</div>
                )}
            </div>
        </div>
    );
}
