import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Image as ImageIcon, Layout, Type, FileText, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { blogService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote', 'code-block'
];

export default function BlogEditor() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        category: 'Seller Tips',
        summary: '',
        content: '',
        imageUrl: '',
        color: 'bg-brand-primary',
        readTime: '5 min read'
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const blog = await blogService.getBlogById(id);
            // Security check: only owner or admin can edit
            if (blog.sellerId !== user.id && user.role !== 'admin') {
                alert('You do not have permission to edit this blog.');
                navigate('/seller/blogs');
                return;
            }
            setFormData({
                title: blog.title,
                category: blog.category,
                summary: blog.summary,
                content: blog.content,
                imageUrl: blog.imageUrl || '',
                color: blog.color || 'bg-brand-primary',
                readTime: blog.readTime || '5 min read'
            });
        } catch (error) {
            console.error('Error fetching blog:', error);
            navigate('/seller/blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await blogService.updateBlog(id, formData);
            } else {
                await blogService.createBlog({
                    ...formData,
                    sellerId: user.id,
                    author: user.name || user.storeName
                });
            }
            navigate('/seller/blogs');
        } catch (error) {
            alert('Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = `w-full px-4 py-3 bg-white border border-border-soft rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-text-muted/40`;
    const labelClass = `block text-xs font-bold text-text-muted uppercase tracking-wider mb-2`;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-3">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Loading editor...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-surface-bg/80 backdrop-blur-md z-30 py-4 -mt-4 border-b border-border-soft mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/seller/blogs')}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-white rounded-xl transition-all border border-transparent hover:border-border-soft"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            {isEdit ? 'Edit Blog Post' : 'Create New Post'}
                        </h2>
                        <span className="text-xs text-text-muted font-medium">
                            {isEdit ? 'Updating your shared insights' : 'Share your knowledge with Toroongo'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${previewMode
                            ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                            : 'bg-white text-text-primary border-border-soft hover:bg-surface-bg'
                            }`}
                    >
                        {previewMode ? <Layout size={18} /> : <Eye size={18} />}
                        {previewMode ? 'Back to Edit' : 'Preview Post'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary disabled:opacity-50 transition-all shadow-lg shadow-brand-primary/20"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        {isEdit ? 'Update Post' : 'Publish Post'}
                    </button>
                </div>
            </div>

            {previewMode ? (
                <div className="bg-white rounded-3xl border border-border-soft overflow-hidden shadow-xl animate-scale-in">
                    {formData.imageUrl && (
                        <div className="w-full aspect-[21/9] bg-surface-bg relative">
                            <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="max-w-3xl mx-auto px-8 py-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase text-white rounded-lg ${formData.color}`}>
                                {formData.category}
                            </span>
                            <span className="text-xs text-text-muted font-medium italic">{formData.readTime}</span>
                        </div>
                        <h1 className="text-4xl font-black text-text-primary mb-6 leading-tight">
                            {formData.title || 'Untitled Post'}
                        </h1>
                        <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border-soft">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-black text-brand-primary text-sm uppercase">
                                {user?.name?.substring(0, 2) || 'SE'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">{user.name || 'Your Store'}</p>
                                <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="prose prose-brand max-w-none">
                            <p className="text-lg text-text-muted font-medium leading-relaxed mb-8 italic border-l-4 border-brand-primary pl-6 py-2">
                                {formData.summary || 'Post summary will appear here...'}
                            </p>
                            <div
                                className="text-text-primary leading-loose font-medium ql-editor !p-0"
                                dangerouslySetInnerHTML={{ __html: formData.content || '<p>Start writing your content...</p>' }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Post Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                    <Type size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">Content Strategy</h3>
                            </div>

                            <div>
                                <label className={labelClass}>Post Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 5 Strategies for High Conversion"
                                    className={`${inputClass} text-xl font-bold`}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Short Summary</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="A brief hook that appears in the blog feed..."
                                    className={`${inputClass} resize-none italic font-medium`}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={labelClass}>Full Article Content</label>
                                    <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">Rich Text Enabled</span>
                                </div>
                                <div className="quill-editor-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Tell your story..."
                                        className="bg-white rounded-xl border-border-soft overflow-hidden"
                                    />
                                    <style>{`
                                        .quill-editor-wrapper .ql-container {
                                            min-height: 400px;
                                            font-family: inherit;
                                            font-size: 14px;
                                            border-bottom-left-radius: 12px;
                                            border-bottom-right-radius: 12px;
                                            border-color: #f1f5f9;
                                        }
                                        .quill-editor-wrapper .ql-toolbar {
                                            border-top-left-radius: 12px;
                                            border-top-right-radius: 12px;
                                            border-color: #f1f5f9;
                                            background: #f8fafc;
                                        }
                                        .quill-editor-wrapper .ql-editor {
                                            min-height: 400px;
                                            padding: 20px;
                                        }
                                    `}</style>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Metadata & Assets */}
                    <div className="space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">Metadata</h3>
                            </div>

                            <div>
                                <label className={labelClass}>Category</label>
                                <select
                                    className={inputClass}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Seller Tips</option>
                                    <option>Industry Insight</option>
                                    <option>Product Guide</option>
                                    <option>Brand Story</option>
                                    <option>Update</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Post Color Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { name: 'Brand', class: 'bg-brand-primary' },
                                        { name: 'Purple', class: 'bg-purple-500' },
                                        { name: 'Blue', class: 'bg-blue-500' },
                                        { name: 'Green', class: 'bg-green-500' },
                                        { name: 'Amber', class: 'bg-amber-500' },
                                        { name: 'Dark', class: 'bg-gray-800' }
                                    ].map(color => (
                                        <button
                                            key={color.class}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color.class })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color.class ? 'border-brand-primary scale-110' : 'border-transparent'
                                                } ${color.class}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <ImageIcon size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">Cover Image</h3>
                            </div>

                            <div>
                                <label className={labelClass}>Image URL</label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className={inputClass}
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                    {formData.imageUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                {formData.imageUrl ? (
                                    <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-border-soft bg-surface-bg">
                                        <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="mt-4 aspect-video rounded-2xl border-2 border-dashed border-border-soft flex flex-col items-center justify-center text-text-muted text-[10px] font-bold uppercase tracking-widest gap-2">
                                        <ImageIcon size={20} className="text-border-soft" />
                                        No Preview Available
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </form>
            )}
        </div>
    );
}
