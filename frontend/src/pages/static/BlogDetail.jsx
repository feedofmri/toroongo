import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { blogService } from '../../services';

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const data = await blogService.getBlogBySlug(slug);
                setBlog(data);
                // Increment views
                blogService.incrementViews(data.id);
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Article not found');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-text-muted font-medium">Loading article...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-4">{error}</h2>
                <Link to="/blog" className="text-brand-primary font-semibold hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-20">
            {/* Breadcrumbs */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-xs font-medium text-text-muted">
                        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/blog" className="hover:text-brand-primary transition-colors">Blog</Link>
                        <ChevronRight size={12} />
                        <span className="text-text-primary truncate">{blog.title}</span>
                    </nav>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Header */}
                <header className="mb-10 text-center">
                    <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase text-white rounded-lg mb-6 ${blog.color || 'bg-brand-primary'}`}>
                        {blog.category}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted border-y border-border-soft py-6 mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-xs uppercase">
                                {blog.author.substring(0, 2)}
                            </div>
                            <span className="font-bold text-text-primary">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{blog.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </header>

                {/* Banner Image */}
                {blog.imageUrl && (
                    <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-border-soft">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto">
                    {/* Summary/Intro */}
                    <div className="text-xl text-text-muted font-medium leading-relaxed mb-10 italic border-l-4 border-brand-primary pl-6 py-2">
                        {blog.summary}
                    </div>

                    {/* Body */}
                    <div
                        className="prose prose-brand max-w-none text-text-primary leading-loose font-medium ql-editor !p-0"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Footer / Social Share */}
                    <div className="mt-16 pt-10 border-t border-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-text-primary">Share:</span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-surface-bg hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl transition-all border border-border-soft">
                                    <Facebook size={18} />
                                </button>
                                <button className="p-2 bg-surface-bg hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl transition-all border border-border-soft">
                                    <Twitter size={18} />
                                </button>
                                <button className="p-2 bg-surface-bg hover:bg-brand-primary/10 hover:text-brand-primary rounded-xl transition-all border border-border-soft">
                                    <LinkIcon size={18} />
                                </button>
                            </div>
                        </div>
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors">
                            <ArrowLeft size={18} /> Back to all articles
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
