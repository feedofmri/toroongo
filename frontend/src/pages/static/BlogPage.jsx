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
                        <div className="bg-white border border-border-soft rounded-2xl mb-12 overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                            {posts[0].imageUrl && (
                                <Link to={`/blog/${posts[0].slug}`} className="block w-full aspect-[21/9] overflow-hidden">
                                    <img
                                        src={posts[0].imageUrl}
                                        alt={posts[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </Link>
                            )}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-[10px] font-bold uppercase text-white px-3 py-1 rounded-lg ${posts[0].color}`}>{posts[0].category}</span>
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                        <Clock size={14} />
                                        <span>{posts[0].readTime}</span>
                                    </div>
                                </div>
                                <Link to={`/blog/${posts[0].slug}`}>
                                    <h2 className="text-3xl font-black text-text-primary mb-4 hover:text-brand-primary transition-colors leading-tight">{posts[0].title}</h2>
                                </Link>
                                <p className="text-text-muted leading-relaxed mb-6 text-lg font-medium opacity-80">{posts[0].summary}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-border-soft/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-xs uppercase italic">
                                            {posts[0].author.substring(0, 2)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-primary">{posts[0].author}</span>
                                            <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{formatDate(posts[0].createdAt)}</span>
                                        </div>
                                    </div>
                                    <Link to={`/blog/${posts[0].slug}`} className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary/5 text-brand-primary text-sm font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-all group/btn">
                                        Read Article <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {posts.slice(1).map((post) => (
                                <div key={post.id} className="bg-white border border-border-soft rounded-3xl hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group overflow-hidden flex flex-col h-full">
                                    {post.imageUrl && (
                                        <Link to={`/blog/${post.slug}`} className="block w-full aspect-[16/10] overflow-hidden border-b border-border-soft">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </Link>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-md ${post.color || 'bg-brand-primary'}`}>{post.category}</span>
                                            {post.sellerId && (
                                                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-md">Partner Post</span>
                                            )}
                                        </div>
                                        <Link to={`/blog/${post.slug}`}>
                                            <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-brand-primary transition-colors leading-snug">{post.title}</h3>
                                        </Link>
                                        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-6 font-medium opacity-80">{post.summary}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-soft/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand-primary/5 flex items-center justify-center font-bold text-brand-primary text-[8px] uppercase">
                                                    {post.author.substring(0, 2)}
                                                </div>
                                                <span className="text-[11px] font-bold text-text-primary">{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold">
                                                <Clock size={12} />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-text-muted bg-surface-bg rounded-3xl border-2 border-dashed border-border-soft">
                        <p className="font-bold text-lg mb-2">No articles found</p>
                        <p className="text-sm">We are busy writing new content. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
